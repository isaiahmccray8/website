import Link from "next/link";
import Nav, { phoneDisplay } from "../components/Nav";

export const metadata = { title: "Book a call · McCray Made" };

export default function Book() {
  const cal = process.env.NEXT_PUBLIC_CAL_LINK;
  const phone = process.env.NEXT_PUBLIC_PHONE || "";
  return (
    <>
      <Nav />
      <main className="page">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="mono" style={{ color: "var(--coral)" }}>Free · 15 minutes · No pressure</p>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", marginTop: 6 }}>Book a call with Isaiah</h2>
            </div>
            <p>Tell me what you're working on and I'll tell you what it'll take, honestly. Already know what you want? <Link href="/#services">Build your order</Link> instead.</p>
          </div>
          {cal ? (
            <iframe className="cal" src={`https://cal.com/${cal}?embed=true&theme=light`} title="Book a call with Isaiah" loading="lazy" />
          ) : (
            <div className="panel"><p>Online booking is coming soon. For now, text me at <b>{phoneDisplay(phone)}</b> and we'll pick a time.</p></div>
          )}
          <p className="muted" style={{ marginTop: 14 }}>Prefer to text? <a href={`sms:+1${phone}`}>{phoneDisplay(phone)}</a></p>
        </div>
      </main>
    </>
  );
}
