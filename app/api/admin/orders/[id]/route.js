import { sql, getOrder } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { STATUSES } from "@/lib/catalog";

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return Response.json({ error: "Not found" }, { status: 404 });
  const b = await req.json().catch(() => ({}));

  const status = STATUSES[b.status] ? b.status : order.status;
  const finalTotal = b.finalTotal === "" || b.finalTotal == null ? null : Math.round(Number(b.finalTotal) * 100);
  if (finalTotal != null && (!Number.isFinite(finalTotal) || finalTotal < 0)) return Response.json({ error: "Bad total" }, { status: 400 });
  const manual = Math.round(Number(b.manualPayment || 0) * 100);

  await sql.begin(async (tx) => {
    if (manual > 0) {
      await tx`insert into payments (order_id, amount_cents, method) values (${id}, ${manual}, ${String(b.manualMethod || "manual").slice(0, 30)})`;
    }
    await tx`
      update orders set
        status = ${status},
        final_total_cents = ${finalTotal},
        amount_paid_cents = amount_paid_cents + ${manual > 0 ? manual : 0},
        customer_note = ${String(b.customerNote ?? order.customer_note ?? "").slice(0, 2000)},
        admin_notes = ${String(b.adminNotes ?? order.admin_notes ?? "").slice(0, 4000)},
        updated_at = now()
      where id = ${id}`;
  });
  return Response.json({ ok: true, order: await getOrder(id) });
}
