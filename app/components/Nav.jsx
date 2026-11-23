import Link from "next/link";

export function Mark() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M7 31V11l13 13 13-13v20" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="31" r="2.8" fill="currentColor" />
      <circle cx="33" cy="31" r="2.8" fill="currentColor" />
      <path d="M20 2.5l1.7 4.1 4.1 1.7-4.1 1.7L20 14.1l-1.7-4.1-4.1-1.7 4.1-1.7Z" fill="var(--coral)" />
    </svg>
  );
}

export default function Nav({ admin = false }) {
  return (
    <header className="nav">
      <div className="wrap">
        <Link className="logo" href={admin ? "/admin" : "/"}>
          <Mark />
          <div>McCRAY MADE<small>{admin ? "DASHBOARD" : "BY ISAIAH McCRAY"}</small></div>
        </Link>
        {!admin && (
          <nav className="navlinks">
            <Link className="pill hide-sm" href="/#services">Services</Link>
            <Link className="pill lime" href="/book">Book a call</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export const phoneDisplay = (p = process.env.NEXT_PUBLIC_PHONE || "") =>
  p.replace(/\D/g, "").replace(/^1?(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
