import Link from "next/link";
import Nav, { Mark, phoneDisplay } from "./components/Nav";
import QuoteBuilder from "./components/QuoteBuilder";
import { CATS } from "@/lib/catalog";

const PHONE = process.env.NEXT_PUBLIC_PHONE || "";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "";

function Contact() {
  return (
    <div className="ct">
      <a href={`sms:+1${PHONE}`}><b>Text</b>{phoneDisplay(PHONE)}</a>
      <a href={`tel:+1${PHONE}`}><b>Call</b>{phoneDisplay(PHONE)}</a>
      <a href={`mailto:${EMAIL}`}><b>Email</b>{EMAIL}</a>
    </div>
  );
}

export default function Home() {
  const tick = [...CATS.map((c) => c.name), "Change pictures", "New pages", "Prototypes", "Wi-Fi fixes", "Online stores"];
  return (
    <>
      <Nav />
      <header className="hero">
        <div className="wrap">
          <p className="mono" style={{ color: "var(--lime)", marginBottom: 16 }}>McCray Made · Real tech help from a real person</p>
          <h1>I build, fix &amp; grow the <em>tech</em> behind your business.</h1>
          <p className="lead">I'm Isaiah, an engineer who builds websites, designs circuits, and sets up tech for people and small businesses. Pick what you need, see your price instantly, and I'll handle the rest.</p>
          <div className="cta">
            <Link className="btn lime" href="/book">📅 Book a free call</Link>
            <a className="btn ghost" href="#services">Build my quote</a>
          </div>
          <Contact />
        </div>
        <div className="ticker mono" aria-hidden="true"><div>{[...tick, ...tick].map((t, i) => <span key={i}>✦ {t}</span>)}</div></div>
      </header>

      <section style={{ paddingBottom: 30 }}>
        <div className="wrap meet">
          <div className="avatar" aria-hidden="true">IM</div>
          <div>
            <p className="mono" style={{ color: "var(--coral)" }}>The person behind McCray Made</p>
            <h2>Hey, I'm Isaiah 👋</h2>
            <p>I'm an electrical engineering student and research assistant at NC A&amp;T State University. I've worked on embedded systems, digital design, and hardware testing, including an internship on Apple's silicon validation hardware team.</p>
            <p>I started McCray Made because many people and small businesses need real tech help and don't know who to call. Now you do. Whether it's your website, your Wi-Fi, or a product idea you've been sitting on, I'll treat it like it's my own.</p>
            <div className="chips"><span>📱 I actually answer</span><span>💬 No tech-speak</span><span>🏷️ Price before I start</span><span>🤝 I treat your business like mine</span></div>
            <div className="sig">— Isaiah</div>
          </div>
        </div>
      </section>

      <section id="services" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="sec-head">
            <h2>Build Your Order</h2>
            <p>Pick exactly what you want, like a new page or swapped pictures, from any category. Your total updates as you go.</p>
          </div>
          <QuoteBuilder />
        </div>
      </section>

      <section className="dark">
        <div className="wrap">
          <div className="sec-head"><h2>Why work with me</h2><p>Most people hire a web person, an IT person, and an engineer. With me you get all three, and one person who knows your setup.</p></div>
          <div className="wgrid">
            <div className="w"><span className="mono">01</span><b>Engineer-trained</b><p>Embedded systems, digital design, and hardware verification experience.</p></div>
            <div className="w"><span className="mono">02</span><b>Clear pricing</b><p>You see the price before any work starts. No surprise invoices.</p></div>
            <div className="w"><span className="mono">03</span><b>Track your order</b><p>Every order gets its own page showing progress and what you owe.</p></div>
            <div className="w"><span className="mono">04</span><b>Pay your way</b><p>Card, Apple Pay, or Cash App, securely through Stripe.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head"><h2>How It Works</h2></div>
          <div className="steps">
            <div className="step"><h3>Pick &amp; order</h3><p>Choose your services above, or book a call if you're not sure what you need.</p></div>
            <div className="step"><h3>I confirm</h3><p>I review your order and text you. Then you pay a 50% deposit from your order page.</p></div>
            <div className="step"><h3>I build</h3><p>Your order page shows live progress. Nothing goes live without your OK.</p></div>
            <div className="step"><h3>Review &amp; pay</h3><p>Approve the work and pay the balance with card, Apple Pay, or Cash App.</p></div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="refer">
            <div><h3>Send me a client, get $25.</h3><p style={{ marginTop: 6, maxWidth: 520 }}>Refer someone who books $250 or more and you get $25 off your next service, or $25 cash. No limit.</p></div>
            <Link className="btn" href="/book">Book a call</Link>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head"><h2>Good to Know</h2></div>
          <details><summary>Do I pay when I place an order?</summary><p>No. I review every order first and confirm the final price. Then your order page unlocks a 50% deposit. The balance is due when the work is done and you've approved it.</p></details>
          <details><summary>What does a "starting at" price mean?</summary><p>Custom projects vary in size. I'll confirm a fixed price after I see your requirements, before you pay anything.</p></details>
          <details><summary>Should I pick updates or a package?</summary><p>For one or two changes, pick them individually. Once you have 5+ updates, a package like The Refresh usually saves you money. The quote will point it out.</p></details>
          <details><summary>Which website platforms do you work with?</summary><p>Shopify, Wix, Squarespace, WordPress, GoDaddy, and custom-coded sites.</p></details>
          <details><summary>Do you work with students?</summary><p>Yes, through tutoring and project coaching. I'll teach you how to design and debug your project. I don't do graded work for you.</p></details>
          <details><summary>What's not included?</summary><p>Parts, PCB fabrication, hosting, domains, paid themes, apps, and licenses are billed at cost. I'll list them before you approve.</p></details>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="logo" style={{ marginBottom: 24 }}><Mark /><div>McCRAY MADE<small>REAL TECH HELP FROM A REAL PERSON</small></div></div>
          <h2>Text me. <em>Let's figure it out.</em></h2>
          <Contact />
          <p className="fineprint">Made with care by Isaiah McCray · Electrical Engineering, NC A&amp;T · North Carolina<br />© {new Date().getFullYear()} McCray Made. Prices are starting rates and may change based on project scope. Quotes valid 30 days.</p>
        </div>
      </footer>
    </>
  );
}
