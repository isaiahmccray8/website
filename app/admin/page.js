import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "../components/Nav";
import LogoutButton from "./LogoutButton";
import { isAdmin } from "@/lib/auth";
import { sql, amountDue, balance } from "@/lib/db";
import { STATUSES } from "@/lib/catalog";
import { money } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard · McCray Made", robots: { index: false } };

export default async function Admin({ searchParams }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { s } = await searchParams;
  const filter = STATUSES[s] ? s : s === "all" ? "all" : "open";
  const orders = await sql`select * from orders order by created_at desc limit 500`;
  const shown = orders.filter((o) =>
    filter === "all" ? true : filter === "open" ? !["paid", "cancelled"].includes(o.status) : o.status === filter);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [{ earned = 0 } = {}] = await sql`select coalesce(sum(amount_cents),0)::int as earned from payments where created_at >= ${monthStart}`;
  const owed = orders.filter((o) => !["cancelled", "new"].includes(o.status)).reduce((t, o) => t + balance(o), 0);
  const newCount = orders.filter((o) => o.status === "new").length;
  const active = orders.filter((o) => ["approved", "in_progress"].includes(o.status)).length;

  const tabs = [["open", "Open"], ["new", "New"], ["approved", "Approved"], ["in_progress", "In progress"], ["completed", "Completed"], ["paid", "Paid"], ["all", "All"]];

  return (
    <>
      <Nav admin />
      <main className="page">
        <div className="wrap">
          <div className="sec-head">
            <h2>Orders</h2>
            <div style={{ display: "flex", gap: 8 }}><Link className="btn" href="/" target="_blank">View site ↗</Link><LogoutButton /></div>
          </div>
          <div className="stats">
            <div className="stat"><span className="mono muted">New to review</span><b>{newCount}</b></div>
            <div className="stat"><span className="mono muted">Active jobs</span><b>{active}</b></div>
            <div className="stat"><span className="mono muted">Owed to you</span><b>{money(owed)}</b></div>
            <div className="stat" style={{ background: "var(--lime)" }}><span className="mono">Paid this month</span><b>{money(earned)}</b></div>
          </div>
          <div className="filters">
            {tabs.map(([k, l]) => <Link key={k} className={filter === k ? "on" : ""} href={`/admin?s=${k}`}>{l}</Link>)}
          </div>
          <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
            <table className="orders">
              <thead><tr><th>Customer</th><th>Items</th><th>Status</th><th>Total</th><th>Balance</th><th>Date</th></tr></thead>
              <tbody>
                {shown.length === 0 && <tr><td colSpan={6} className="muted" style={{ padding: 24 }}>No orders here yet.</td></tr>}
                {shown.map((o) => (
                  <tr key={o.id}>
                    <td><Link href={`/admin/orders/${o.id}`} style={{ fontWeight: 700 }}>{o.name}</Link><div className="muted" style={{ fontSize: ".8rem" }}>{o.business || o.phone}</div></td>
                    <td style={{ maxWidth: 260 }}>{o.items.slice(0, 3).map((l) => l.name).join(", ")}{o.items.length > 3 ? ` +${o.items.length - 3}` : ""}</td>
                    <td><span className={"badge " + o.status}>{STATUSES[o.status]?.label}</span></td>
                    <td>{money(amountDue(o))}{o.has_from && o.final_total_cents == null ? "*" : ""}</td>
                    <td>{money(balance(o))}</td>
                    <td className="muted">{new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine">* has starting prices; set a final total before approving.</p>
        </div>
      </main>
    </>
  );
}
