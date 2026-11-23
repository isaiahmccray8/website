import { checkPassword, setAdminCookie } from "@/lib/auth";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800));
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }
  await setAdminCookie();
  return Response.json({ ok: true });
}
