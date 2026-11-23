import { money } from "./pricing";

// Emails you when a new order arrives. Does nothing unless RESEND_API_KEY is set.
export async function notifyNewOrder(order) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!key || !to) return;
  const items = (order.items || []).map((l) => `• ${l.qty > 1 ? l.qty + " × " : ""}${l.name} — ${money(l.amount)}`).join("\n");
  const text = `New order from ${order.name} (${order.phone}, ${order.email})
Business: ${order.business || "-"}  Website: ${order.website || "-"}

${items}
Total: ${money(order.total_cents)}${order.has_from ? " (has starting prices, confirm final)" : ""}

Details: ${order.details || "-"}

Open it: ${process.env.SITE_URL}/admin/orders/${order.id}`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "McCray Made <onboarding@resend.dev>", to: [to], subject: `New order: ${order.name} · ${money(order.total_cents)}`, text }),
    });
  } catch (e) {
    console.error("notify failed", e);
  }
}
