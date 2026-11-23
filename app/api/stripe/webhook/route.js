import Stripe from "stripe";
import { sql } from "@/lib/db";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const raw = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, req.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return new Response("Bad signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const s = event.data.object;
    if (s.payment_status === "paid" && s.metadata?.orderId) await recordPayment(s);
  }
  return Response.json({ received: true });
}

async function recordPayment(s) {
  await sql.begin(async (tx) => {
    const inserted = await tx`
      insert into payments (order_id, amount_cents, method, stripe_session)
      values (${s.metadata.orderId}, ${s.amount_total}, 'stripe', ${s.id})
      on conflict (stripe_session) do nothing returning id`;
    if (!inserted.length) return; // already recorded
    await tx`
      update orders set
        amount_paid_cents = amount_paid_cents + ${s.amount_total},
        status = case when amount_paid_cents + ${s.amount_total} >= coalesce(final_total_cents, total_cents) then 'paid'
                      when status = 'approved' then 'in_progress' else status end,
        updated_at = now()
      where id = ${s.metadata.orderId}`;
  });
}
