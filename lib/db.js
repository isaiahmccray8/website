import postgres from "postgres";

const globalForDb = globalThis;
export const sql =
  globalForDb.__sql ||
  postgres(process.env.DATABASE_URL, {
    ssl: process.env.DATABASE_URL?.includes("localhost") ? false : "require",
    max: 5,
    prepare: false,
  });
if (process.env.NODE_ENV !== "production") globalForDb.__sql = sql;

export const amountDue = (o) => (o.final_total_cents ?? o.total_cents);
export const balance = (o) => Math.max(0, amountDue(o) - o.amount_paid_cents);

export async function getOrder(id) {
  if (!/^[0-9a-f-]{36}$/i.test(id || "")) return null;
  const rows = await sql`select * from orders where id = ${id}`;
  return rows[0] || null;
}
