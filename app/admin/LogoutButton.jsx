"use client";
export default function LogoutButton() {
  return (
    <button className="btn" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }}>
      Log out
    </button>
  );
}
