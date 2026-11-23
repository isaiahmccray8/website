import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "mm_admin";

function token() {
  return crypto
    .createHmac("sha256", process.env.SESSION_SECRET || "dev-secret")
    .update("admin:" + (process.env.ADMIN_PASSWORD || ""))
    .digest("hex");
}

export function checkPassword(pw) {
  const a = Buffer.from(String(pw || ""));
  const b = Buffer.from(process.env.ADMIN_PASSWORD || "");
  return b.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function setAdminCookie() {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const v = (await cookies()).get(COOKIE)?.value;
  return !!v && !!process.env.ADMIN_PASSWORD && v === token();
}
