import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Nav from "../../../components/Nav";
import OrderEditor from "./OrderEditor";
import { isAdmin } from "@/lib/auth";
import { getOrder, sql, amountDue, balance } from "@/lib/db";
import { money } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminOrder({ params }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const o = await getOrder(id);
  if (!o) notFound();
  const payments = await sql`select * from payments where order_id = ${id} order by created_at`;
  const link = `${process.env.SITE_URL}/order/${o.id}`;

  return (
    <>
      <Nav admin />
      <main className="page">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <Link href="/admin" className="muted">← All orders</Link>
          <div className="layout two" style={{ marginTop: 14 }}>
            <div>
              <div className="panel">
                <p className="mono muted">#{o.id.slice(0, 8).toUpperCase()} · {new Date(o.created_at).toLocaleString("en-US")}</p>
                <h2 style={{ margin: "6px 0 12px" }}>{o.name}</h2>
                <p>📱 <a href={`sms:${o.phone}`}>{o.phone}</a> (prefers {o.contact_pref || "text"})</p>
                <p>✉️ <a href={`mailto:${o.email}`}>{o.email}</a></p>
                {o.business && <p>🏢 {o.business}</p>}
                {o.website && <p>🌐 <a href={/^https?:/.test(o.website) ? o.website : `https://${o.website}`} target="_blank" rel="noreferrer">{o.website}</a></p>}
                {o.details && <><h4 style={{ marginTop: 16 }}>What they need</h4><p style={{ whiteSpace: "pre-wrap" }}>{o.details}</p></>}
              </div>
              <div className="panel receipt" style={{ position: "static" }}>
                <h3>ITEMS</h3><div className="hr" />
                {o.items.map((l) => <div className="rline" key={l.id}><span>{l.qty > 1 ? `${l.qty} × ` : ""}{l.name}{l.from ? "*" : ""}{l.monthly ? " /mo" : ""}</span><span>{money(l.amount)}</span></div>)}
                {o.rush && <div className="rline"><span>Rush +25%</span><span>incl.</span></div>}
                {o.discount_cents > 0 && <div className="rline disc"><span>{o.promo}</span><span>−{money(o.discount_cents)}</span></div>}
                <div className="hr" />
                <div className="rline"><span>Quoted total</span><span>{money(o.total_cents)}</span></div>
                <div className="total"><span>Due</span><span>{money(amountDue(o))}</span></div>
                <div className="rline"><span>Paid</span><span>{money(o.amount_paid_cents)}</span></div>
                <div className="rline" style={{ fontWeight: 600 }}><span>Balance</span><span>{money(balance(o))}</span></div>
                {payments.length > 0 && <><div className="rgroup">PAYMENTS</div>{payments.map((p) => (
                  <div className="rline" key={p.id}><span>{new Date(p.created_at).toLocaleDateString("en-US")} · {p.method}</span><span>{money(p.amount_cents)}</span></div>))}</>}
              </div>
            </div>
            <OrderEditor order={JSON.parse(JSON.stringify(o))} link={link} />
          </div>
        </div>
      </main>
    </>
  );
}
