import crypto from "crypto";
import { sql } from "@/lib/db";
import { computeQuote, parsePromos } from "@/lib/pricing";
import { notifyNewOrder } from "@/lib/notify";

const clean = (v, max = 300) => String(v ?? "").trim().slice(0, max);

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }

  const name = clean(body.name, 120), email = clean(body.email, 200), phone = clean(body.phone, 40);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, "").length < 10)
    return Response.json({ error: "Please add your name, a valid email, and a phone number." }, { status: 400 });

  const promo = clean(body.promo, 30).toUpperCase();
  const pct = parsePromos()[promo] || 0;
  // Prices are always recalculated on the server from lib/catalog.js
  const q = computeQuote(body.cart, { rush: !!body.rush, discountPct: pct });
  if (!q.lines.length) return Response.json({ error: "Your quote is empty." }, { status: 400 });

  const order = {
    id: crypto.randomUUID(), name, email, phone,
    business: clean(body.business, 150), website: clean(body.website, 300),
    details: clean(body.details, 4000), contact_pref: clean(body.contactPref, 20),
    items: q.lines, rush: !!body.rush, promo: pct ? promo : null,
    discount_cents: q.discount, total_cents: q.total, monthly_cents: q.monthly, has_from: q.hasFrom,
  };

  await sql`
    insert into orders (id, name, email, phone, business, website, details, contact_pref, items, rush, promo,
                        discount_cents, total_cents, monthly_cents, has_from)
    values (${order.id}, ${name}, ${email}, ${phone}, ${order.business}, ${order.website}, ${order.details},
            ${order.contact_pref}, ${sql.json(order.items)}, ${order.rush}, ${order.promo},
            ${order.discount_cents}, ${order.total_cents}, ${order.monthly_cents}, ${order.has_from})`;
  await notifyNewOrder(order);
  return Response.json({ id: order.id });
}
