import { ITEMS } from "./catalog";

// cart: { itemId: qty }. Returns all amounts in cents.
export function computeQuote(cart, { rush = false, discountPct = 0 } = {}) {
  const lines = [];
  let oneTime = 0, monthly = 0, hasFrom = false;
  for (const [id, rawQty] of Object.entries(cart || {})) {
    const item = ITEMS[id];
    const qty = Math.max(0, Math.min(99, Math.floor(Number(rawQty) || 0)));
    if (!item || !qty) continue;
    const q = item.unit ? qty : 1;
    const amount = item.p * 100 * q;
    if (item.from) hasFrom = true;
    lines.push({ id, name: item.n, qty: q, unit: item.unit || null, amount, monthly: !!item.mo, from: !!item.from });
    if (item.mo) monthly += amount; else oneTime += amount;
  }
  const rushAmt = rush ? Math.round(oneTime * 0.25) : 0;
  const pct = Math.max(0, Math.min(50, discountPct)) / 100;
  const discount = Math.round((oneTime + rushAmt + monthly) * pct);
  const total = oneTime + rushAmt + monthly - discount; // first month of plans included
  return { lines, oneTime, rushAmt, monthly, discount, total, hasFrom };
}

export function parsePromos() {
  const out = {};
  for (const part of (process.env.PROMO_CODES || "").split(",")) {
    const [code, pct] = part.split(":").map((s) => s && s.trim());
    if (code && pct) out[code.toUpperCase()] = Number(pct);
  }
  return out;
}

export const money = (cents) =>
  "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 });
