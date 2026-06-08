"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { COUPONS, uid, todayISO, dateOffset } from "@/lib/data";

type Coupon = typeof COUPONS[0];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([...COUPONS]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ code: "", type: "Percentage", discount: 0, minOrder: 0, maxDiscount: 0, usageLimit: 100, validFrom: todayISO(), validTo: dateOffset(30), status: "Active" });

  const openAdd = () => { setEditing(null); setForm({ code: "", type: "Percentage", discount: 0, minOrder: 0, maxDiscount: 0, usageLimit: 100, validFrom: todayISO(), validTo: dateOffset(30), status: "Active" }); setShowModal(true); };
  const openEdit = (c: Coupon) => { setEditing(c); setForm({ code: c.code, type: c.type, discount: c.discount, minOrder: c.minOrder, maxDiscount: c.maxDiscount, usageLimit: c.usageLimit, validFrom: c.validFrom, validTo: c.validTo, status: c.status }); setShowModal(true); };
  const handleSave = () => {
    if (editing) { setCoupons(coupons.map(c => c.id === editing.id ? { ...c, ...form } : c)); }
    else { setCoupons([{ id: uid("CPN"), usedCount: 0, ...form }, ...coupons]); }
    setShowModal(false);
  };
  const handleDelete = (id: string) => { if (confirm("Delete coupon?")) setCoupons(coupons.filter(c => c.id !== id)); };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Coupons</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>{coupons.filter(c => c.status === "Active").length} active coupons</div></div>
        <button className="btn btn-gold" onClick={openAdd}><i className="fa-solid fa-plus" /> Create Coupon</button>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {coupons.map(c => (
          <div key={c.id} className="panel-bg" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ background: "rgba(212,175,55,.1)", border: "1px dashed rgba(212,175,55,.3)", borderRadius: 10, padding: "8px 16px", fontSize: 18, fontWeight: 800, color: "var(--gold)", letterSpacing: 2, fontFamily: "monospace" }}>{c.code}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.type === "Percentage" ? `${c.discount}% off` : `₹${c.discount} off`}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Min order ₹{c.minOrder.toLocaleString("en-IN")} · Max discount ₹{c.maxDiscount}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Valid: {c.validFrom} → {c.validTo}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{c.usedCount}/{c.usageLimit}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Used</div>
                  <div style={{ width: 80, height: 4, background: "var(--line)", borderRadius: 4, marginTop: 4 }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%`, background: "var(--gold)", borderRadius: 4 }} />
                  </div>
                </div>
                <span className={`badge ${c.status === "Active" ? "b-active" : c.status === "Expired" ? "b-inactive" : "b-draft"}`}>{c.status}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="icon-btn" onClick={() => openEdit(c)}><i className="fa-solid fa-pen" style={{ fontSize: 11 }} /></button>
                  <button className="icon-btn danger" onClick={() => handleDelete(c.id)}><i className="fa-solid fa-trash" style={{ fontSize: 11 }} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16, overflowY: "auto" }}>
          <div style={{ width: "min(580px,100%)", background: "linear-gradient(160deg,#15151a,#0f0f13)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
              <h3 className="font-playfair" style={{ color: "var(--gold)", fontSize: 20 }}>{editing ? "Edit Coupon" : "Create Coupon"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Coupon Code</label><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="VENUS10" /></div>
                <div className="field"><label>Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Percentage</option><option>Fixed</option></select></div>
                <div className="field"><label>Discount ({form.type === "Percentage" ? "%" : "₹"})</label><input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: +e.target.value })} /></div>
                <div className="field"><label>Min Order (₹)</label><input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: +e.target.value })} /></div>
                <div className="field"><label>Max Discount (₹)</label><input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: +e.target.value })} /></div>
                <div className="field"><label>Usage Limit</label><input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: +e.target.value })} /></div>
                <div className="field"><label>Valid From</label><input type="date" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} /></div>
                <div className="field"><label>Valid To</label><input type="date" value={form.validTo} onChange={e => setForm({ ...form, validTo: e.target.value })} /></div>
                <div className="field"><label>Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></div>
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}><i className="fa-solid fa-save" /> Save Coupon</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
