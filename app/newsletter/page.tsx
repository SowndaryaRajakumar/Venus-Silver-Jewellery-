"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { NEWSLETTER_SUBSCRIBERS } from "@/lib/data";

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([...NEWSLETTER_SUBSCRIBERS]);
  const [search, setSearch] = useState("");

  const filtered = subscribers.filter(s =>
    !search || s.email.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => { if (confirm("Remove subscriber?")) setSubscribers(subscribers.filter(s => s.id !== id)); };

  const exportCSV = () => {
    const h = "ID,Name,Email,Status,Subscribed Date\n";
    const r = subscribers.map(s => `${s.id},${s.name},${s.email},${s.status},${s.subscribedAt}`).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(h + r); a.download = "newsletter.csv"; a.click();
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Newsletter Subscribers</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>{subscribers.filter(s => s.status === "Active").length} active subscribers</div></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={exportCSV}><i className="fa-solid fa-download" /> Export CSV</button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total", val: subscribers.length, color: "var(--text)" },
          { label: "Active", val: subscribers.filter(s => s.status === "Active").length, color: "var(--success)" },
          { label: "Unsubscribed", val: subscribers.filter(s => s.status === "Unsubscribed").length, color: "var(--danger)" },
        ].map(s => (
          <div key={s.label} className="panel-bg" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers..." style={{ width: "100%", maxWidth: 400, background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }} />
      </div>

      <div className="panel-bg">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Subscribed On</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td style={{ color: "var(--muted)" }}>{s.email}</td>
                  <td><span className={`badge ${s.status === "Active" ? "b-active" : "b-inactive"}`}>{s.status}</span></td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{s.subscribedAt}</td>
                  <td><button className="icon-btn danger" onClick={() => handleDelete(s.id)}><i className="fa-solid fa-trash" style={{ fontSize: 11 }} /></button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No subscribers found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
