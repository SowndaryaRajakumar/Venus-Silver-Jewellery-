"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { ENQUIRIES } from "@/lib/data";

type Enquiry = typeof ENQUIRIES[0];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([...ENQUIRIES]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [replyModal, setReplyModal] = useState<Enquiry | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = enquiries.filter(e =>
    (!search || e.name.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search)) &&
    (!filterStatus || e.status === filterStatus)
  );

  const handleReply = () => {
    if (!replyModal) return;
    setEnquiries(enquiries.map(e => e.id === replyModal.id ? { ...e, status: "Replied", reply: replyText } : e));
    setReplyModal(null);
    setReplyText("");
  };

  const exportCSV = () => {
    const h = "ID,Name,Phone,Email,Message,Status,Date\n";
    const r = enquiries.map(e => `${e.id},${e.name},${e.phone},${e.email},"${e.message}",${e.status},${e.date}`).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(h + r); a.download = "enquiries.csv"; a.click();
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Enquiries</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>{enquiries.filter(e => e.status === "Open").length} open enquiries</div></div>
        <button className="btn btn-ghost btn-sm" onClick={exportCSV}><i className="fa-solid fa-download" /> Export CSV</button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..." style={{ flex: 1, minWidth: 200, background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 11px", borderRadius: 9, fontSize: 13, outline: "none" }}>
          <option value="">All</option><option>Open</option><option>Replied</option>
        </select>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {filtered.map(e => (
          <div key={e.id} className="panel-bg" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#f4d57a,#b8860b)", display: "grid", placeItems: "center", color: "#1a1300", fontWeight: 700, flexShrink: 0 }}>{e.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{e.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      <i className="fa-solid fa-phone" style={{ marginRight: 4 }} />{e.phone}
                      <span style={{ margin: "0 8px" }}>·</span>
                      <i className="fa-solid fa-envelope" style={{ marginRight: 4 }} />{e.email}
                    </div>
                  </div>
                  <span className={`badge ${e.status === "Open" ? "b-pending" : "b-approved"}`}>{e.status}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{e.date}</span>
                </div>
                <div style={{ background: "#0e0e12", borderRadius: 10, padding: 12, fontSize: 14, lineHeight: 1.6, marginBottom: e.reply ? 10 : 0 }}>
                  <i className="fa-solid fa-quote-left" style={{ color: "var(--gold)", marginRight: 6, opacity: 0.5 }} />
                  {e.message}
                </div>
                {e.reply && (
                  <div style={{ background: "rgba(34,197,94,.05)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 10, padding: 12, fontSize: 13, lineHeight: 1.6 }}>
                    <div style={{ fontSize: 11, color: "var(--success)", marginBottom: 4, letterSpacing: 1 }}>YOUR REPLY</div>
                    {e.reply}
                  </div>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                <button className="btn btn-gold btn-sm" onClick={() => { setReplyModal(e); setReplyText(e.reply || ""); }}>
                  <i className="fa-solid fa-reply" /> {e.reply ? "Edit Reply" : "Reply"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="panel-bg" style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
            <i className="fa-solid fa-message" style={{ fontSize: 40, display: "block", marginBottom: 12, opacity: 0.3 }} />
            No enquiries found
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ width: "min(580px,100%)", background: "linear-gradient(160deg,#15151a,#0f0f13)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
              <h3 className="font-playfair" style={{ color: "var(--gold)", fontSize: 20 }}>Reply to {replyModal.name}</h3>
              <button onClick={() => setReplyModal(null)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ background: "#0e0e12", borderRadius: 10, padding: 12, fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Customer's message:</div>
                {replyModal.message}
              </div>
              <div className="field">
                <label>Your Reply</label>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={6} placeholder="Type your reply here..." />
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setReplyModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleReply}><i className="fa-solid fa-paper-plane" /> Send Reply</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
