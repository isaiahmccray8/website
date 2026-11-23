"use client";
import { useState } from "react";
import Nav from "../../components/Nav";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  async function submit(e) {
    e.preventDefault(); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) window.location.href = "/admin"; else setErr("Wrong password");
  }
  return (
    <>
      <Nav admin />
      <main className="page"><div className="wrap" style={{ maxWidth: 420 }}>
        <form className="panel form" onSubmit={submit}>
          <h2>Dashboard login</h2>
          <label>Password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus required /></label>
          {err && <p className="error">{err}</p>}
          <button className="btn lime">Log in</button>
        </form>
      </div></main>
    </>
  );
}
