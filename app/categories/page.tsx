"use client";

import { useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminStore } from "@/lib/admin-store";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = useMemo(() => categories.find((c) => c.id === editingId) || null, [categories, editingId]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    status: "Active" as "Active" | "Inactive",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [categories, search]);

  const slugify = (s: string) =>
    String(s)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", image: "", status: "Active" });
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const c = categories.find((x) => x.id === id);
    if (!c) return;
    setEditingId(id);
    setForm({ name: c.name, slug: c.slug, description: c.description, image: c.image, status: c.status });
    setShowModal(true);
  };

  const handleSave = () => {
    const name = form.name.trim();
    const slug = (form.slug.trim() || slugify(name)).trim();
    if (!name || !slug) return;

    if (editingId) {
      updateCategory(editingId, {
        name,
        slug,
        description: form.description,
        image: form.image,
        status: form.status,
      });
    } else {
      addCategory({
        name,
        slug,
        description: form.description,
        image: form.image,
        status: form.status,
      });
    }

    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    const c = categories.find((x) => x.id === id);
    if (!c) return;
    updateCategory(id, { status: c.status === "Active" ? "Inactive" : "Active" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this category?")) return;
    deleteCategory(id);
  };

  const openView = (id: string) => {
    // For now, use the edit modal for view-only by disabling fields.
    // Keep architecture simple without changing theme.
    openEdit(id);
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="font-playfair" style={{ fontSize: 26 }}>Categories</h1>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{categories.length} categories</div>
        </div>
        <button className="btn btn-gold" onClick={openAdd}><i className="fa-solid fa-plus" /> Add Category</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          style={{
            width: "100%",
            maxWidth: 360,
            background: "#0e0e12",
            border: "1px solid var(--line)",
            color: "var(--text)",
            padding: "9px 12px",
            borderRadius: 9,
            fontSize: 13,
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {filtered.map((c) => (
          <div key={c.id} className="panel-bg" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,rgba(212,175,55,.2),rgba(212,175,55,.05))",
                  border: "1px solid rgba(212,175,55,.2)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <i className="fa-solid fa-layer-group" style={{ color: "var(--gold)", fontSize: 20 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{c.productCount} products</div>
              </div>
              <span className={`badge ${c.status === "Active" ? "b-active" : "b-inactive"}`}>{c.status}</span>
            </div>

            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, minHeight: 36 }}>{c.description}</div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => openView(c.id)}><i className="fa-solid fa-eye" /> View</button>
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(c.id)}><i className="fa-solid fa-pen" /></button>
              <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(c.id)}><i className={`fa-solid ${c.status === "Active" ? "fa-toggle-off" : "fa-toggle-on"}`} /></button>
              <button
                className="btn btn-sm"
                style={{ background: "rgba(239,68,68,.15)", color: "var(--danger)", border: "1px solid rgba(239,68,68,.2)" }}
                onClick={() => handleDelete(c.id)}
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && editing && editingId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ width: "min(560px,100%)", background: "linear-gradient(160deg,#15151a,#0f0f13)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
              <h3 className="font-playfair" style={{ color: "var(--gold)", fontSize: 20 }}>{editingId ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Category Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: p.slug ? p.slug : slugify(e.target.value) }))}
                  placeholder="e.g. Silver Rings"
                />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Category Slug</label>
                <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="e.g. silver-rings" />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div style={{ border: "1px dashed var(--line)", borderRadius: 10, padding: 16, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                <i className="fa-solid fa-cloud-upload-alt" style={{ fontSize: 24, marginBottom: 8, display: "block" }} />
                Category Image URL (mock)
                <div style={{ marginTop: 10 }}>
                  <input
                    value={form.image}
                    onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                    placeholder="https://..."
                    style={{ width: "100%", background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }}
                  />
                </div>
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}><i className="fa-solid fa-save" /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add modal (no editing object) */}
      {showModal && !editing && !editingId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ width: "min(560px,100%)", background: "linear-gradient(160deg,#15151a,#0f0f13)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
              <h3 className="font-playfair" style={{ color: "var(--gold)", fontSize: 20 }}>Add Category</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Category Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: p.slug ? p.slug : slugify(e.target.value) }))}
                  placeholder="e.g. Silver Rings"
                />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Category Slug</label>
                <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="e.g. silver-rings" />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div style={{ border: "1px dashed var(--line)", borderRadius: 10, padding: 16, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                <i className="fa-solid fa-cloud-upload-alt" style={{ fontSize: 24, marginBottom: 8, display: "block" }} />
                Category Image URL (mock)
                <div style={{ marginTop: 10 }}>
                  <input
                    value={form.image}
                    onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                    placeholder="https://..."
                    style={{ width: "100%", background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }}
                  />
                </div>
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}><i className="fa-solid fa-save" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

