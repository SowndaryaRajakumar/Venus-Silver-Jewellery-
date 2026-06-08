"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { HERO_BANNERS, uid, todayISO } from "@/lib/data";

type Banner = typeof HERO_BANNERS[0];

export default function HeroBannersPage() {
  const [banners, setBanners] = useState([...HERO_BANNERS]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", link: "", order: 1, status: "Active" });

  const openAdd = () => { setEditing(null); setForm({ title: "", subtitle: "", link: "", order: banners.length + 1, status: "Active" }); setShowModal(true); };
  const openEdit = (b: Banner) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle, link: b.link, order: b.order, status: b.status }); setShowModal(true); };
  const handleSave = () => {
    if (editing) { setBanners(banners.map(b => b.id === editing.id ? { ...b, ...form } : b)); }
    else { setBanners([...banners, { id: uid("BNR"), image: "", createdAt: todayISO(), ...form }]); }
    setShowModal(false);
  };
  const handleDelete = (id: string) => { if (confirm("Delete banner?")) setBanners(banners.filter(b => b.id !== id)); };
  const toggleStatus = (id: string) => setBanners(banners.map(b => b.id === id ? { ...b, status: b.status === "Active" ? "Inactive" : "Active" } : b));

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Hero Banners</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>{banners.length} banners configured</div></div>
        <button className="btn btn-gold" onClick={openAdd}><i className="fa-solid fa-plus" /> Add Banner</button>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {banners.map(b => (
          <div key={b.id} className="panel-bg" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 0 }}>
              {/* Preview */}
              <div style={{ width: 280, minHeight: 120, background: "linear-gradient(135deg,rgba(212,175,55,.15),rgba(212,175,55,.05))", borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, flexShrink: 0 }}>
                <i className="fa-solid fa-image" style={{ fontSize: 32, color: "var(--gold)", opacity: 0.5, marginBottom: 8 }} />
                <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>Banner Preview</div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>1920 × 600 px</div>
              </div>
              {/* Info */}
              <div style={{ flex: 1, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{b.title}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>{b.subtitle}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}><i className="fa-solid fa-link" style={{ marginRight: 6 }} />{b.link}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span className={`badge ${b.status === "Active" ? "b-active" : "b-inactive"}`}>{b.status}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>Order #{b.order}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(b)}><i className="fa-solid fa-pen" /> Edit</button>
                  <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(b.id)}><i className={`fa-solid ${b.status === "Active" ? "fa-eye-slash" : "fa-eye"}`} /> {b.status === "Active" ? "Disable" : "Enable"}</button>
                  <button className="btn btn-sm" style={{ background: "rgba(239,68,68,.15)", color: "var(--danger)", border: "1px solid rgba(239,68,68,.2)" }} onClick={() => handleDelete(b.id)}><i className="fa-solid fa-trash" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ width: "min(560px,100%)", background: "linear-gradient(160deg,#15151a,#0f0f13)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
              <h3 className="font-playfair" style={{ color: "var(--gold)", fontSize: 20 }}>{editing ? "Edit Banner" : "Add Banner"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gap: 14 }}>
                <div className="field"><label>Banner Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Exclusive Bridal Collection" /></div>
                <div className="field"><label>Subtitle</label><input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Short description" /></div>
                <div className="field"><label>Link URL</label><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="/collections/bridal" /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field"><label>Display Order</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })} /></div>
                  <div className="field"><label>Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></div>
                </div>
                <div style={{ border: "1px dashed var(--line)", borderRadius: 10, padding: 20, textAlign: "center", color: "var(--muted)", cursor: "pointer" }}>
                  <i className="fa-solid fa-cloud-upload-alt" style={{ fontSize: 28, marginBottom: 8, display: "block" }} />
                  <div style={{ fontSize: 13 }}>Click to upload banner image</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>Recommended: 1920 × 600px, JPG/PNG</div>
                </div>
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}><i className="fa-solid fa-save" /> Save Banner</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
