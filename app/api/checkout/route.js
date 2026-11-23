import Stripe from "stripe";
import { getOrder, amountDue, balance } from "@/lib/db";

export async function POST(req) {
  const { orderId, kind } = await req.json().catch(() => ({}));
  const order = await getOrder(orderId);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  if (!process.env.STRIPE_SECRET_KEY) return Response.json({ error: "Online payments aren't set up yet. Please text Isaiah." }, { status: 500 });

  const due = amountDue(order), left = balance(order);
  let amount, label;
  if (kind === "deposit" && order.amount_paid_cents === 0 && ["approved", "in_progress"].includes(order.status)) {
    amount = Math.round(due / 2); label = "50% deposit";
  } else if (["approved", "in_progress", "completed"].includes(order.status) && left > 0) {
    amount = left; label = order.amount_paid_cents ? "Remaining balance" : "Paid in full";
  } else {
    return Response.json({ error: "This order isn't ready for payment yet." }, { status: 400 });
  }
  if (amount < 50) return Response.json({ error: "Amount too small" }, { status: 400 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // Payment methods (card, Apple Pay, Cash App Pay) come from your Stripe Dashboard settings.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: order.email,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: amount,
        product_data: { name: `McCray Made order #${order.id.slice(0, 8).toUpperCase()} · ${label}` },
      },
    }],
    metadata: { orderId: order.id, kind: label },
    payment_intent_data: { metadata: { orderId: order.id } },
    success_url: `${process.env.SITE_URL}/order/${order.id}?paid=1`,
    cancel_url: `${process.env.SITE_URL}/order/${order.id}`,
  });
  return Response.json({ url: session.url });
}
