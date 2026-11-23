import { parsePromos } from "@/lib/pricing";

export async function GET(req) {
  const code = (new URL(req.url).searchParams.get("code") || "").trim().toUpperCase();
  const pct = parsePromos()[code];
  return Response.json(pct ? { valid: true, code, pct } : { valid: false });
}
