"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { REVIEWS } from "@/lib/data";

type Review = typeof REVIEWS[0];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([...REVIEWS]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = reviews.filter(r =>
    (!search || r.customerName.toLowerCase().includes(search.toLowerCase()) || r.productName.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || r.status === filterStatus)
  );

  const updateStatus = (id: string, status: string) => setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
  const handleDelete = (id: string) => { if (confirm("Delete this review?")) setReviews(reviews.filter(r => r.id !== id)); };

  const stars = (n: number) => Array.from({ length: 5 }, (_, i) => (
    <i key={i} className={`fa-${i < n ? "solid" : "regular"} fa-star`} style={{ color: i < n ? "var(--gold)" : "var(--line)", fontSize: 12 }} />
  ));

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Reviews</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>{reviews.length} total reviews</div></div>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--success)" }}>{reviews.filter(r => r.status === "Approved").length} Approved</span>
          <span style={{ fontSize: 13, color: "var(--warn)" }}>{reviews.filter(r => r.status === "Pending").length} Pending</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..." style={{ flex: 1, minWidth: 200, background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 11px", borderRadius: 9, fontSize: 13, outline: "none" }}>
          <option value="">All Status</option><option>Pending</option><option>Approved</option><option>Rejected</option>
        </select>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {filtered.map(r => (
          <div key={r.id} className="panel-bg" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#f4d57a,#b8860b)", display: "grid", placeItems: "center", color: "#1a1300", fontWeight: 700, flexShrink: 0 }}>{r.customerName[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.customerName}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.date}</div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>{stars(r.rating)}</div>
                  <span className={`badge ${r.status === "Approved" ? "b-approved" : r.status === "Rejected" ? "b-rejected" : "b-pending"}`}>{r.status}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>Product: <span style={{ color: "var(--gold)" }}>{r.productName}</span></div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{r.review}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {r.status !== "Approved" && <button className="btn btn-sm" style={{ background: "rgba(34,197,94,.15)", color: "var(--success)", border: "1px solid rgba(34,197,94,.2)" }} onClick={() => updateStatus(r.id, "Approved")}><i className="fa-solid fa-check" /> Approve</button>}
                {r.status !== "Rejected" && <button className="btn btn-sm" style={{ background: "rgba(239,68,68,.15)", color: "var(--danger)", border: "1px solid rgba(239,68,68,.2)" }} onClick={() => updateStatus(r.id, "Rejected")}><i className="fa-solid fa-xmark" /> Reject</button>}
                <button className="icon-btn danger" onClick={() => handleDelete(r.id)}><i className="fa-solid fa-trash" style={{ fontSize: 11 }} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="panel-bg" style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
            <i className="fa-solid fa-star" style={{ fontSize: 40, marginBottom: 12, display: "block", opacity: 0.3 }} />
            No reviews found
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
