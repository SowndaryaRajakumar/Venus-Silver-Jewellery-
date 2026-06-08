"use client";
import { useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminStore, getSubcategoriesByCategoryId } from "@/lib/admin-store";

const slugify = (s: string) =>
  String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function SubCategoriesPage() {
  const { categories, subcategories, addSubCategory, updateSubCategory, deleteSubCategory } = useAdminStore();

  const [search, setSearch] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    image: "",
    status: "Active" as "Active" | "Inactive",
  });

  const editingSub = useMemo(() => subcategories.find((s) => s.id === editingId) || null, [subcategories, editingId]);

  const filtered = useMemo(() => {
    let list = subcategories;
    if (filterCategoryId) {
      list = getSubcategoriesByCategoryId(list, filterCategoryId);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q)
      );
    }
    return list;
  }, [subcategories, search, filterCategoryId]);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ categoryId: "", name: "", slug: "", description: "", image: "", status: "Active" });
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const s = subcategories.find((x) => x.id === id);
    if (!s) return;
    setEditingId(id);
    setForm({ categoryId: s.categoryId, name: s.name, slug: s.slug, description: s.description, image: s.image, status: s.status });
    setShowModal(true);
  };

  const handleSave = () => {
    const name = form.name.trim();
    const slug = (form.slug.trim() || slugify(name));
    if (!name || !slug || !form.categoryId) return;

    if (editingId) {
      updateSubCategory(editingId, {
        categoryId: form.categoryId,
        name,
        slug,
        description: form.description,
        image: form.image,
        status: form.status,
      });
    } else {
      addSubCategory({
        categoryId: form.categoryId,
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
    const s = subcategories.find((x) => x.id === id);
    if (!s) return;
    updateSubCategory(id, { status: s.status === "Active" ? "Inactive" : "Active" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this sub category?")) return;
    deleteSubCategory(id);
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="font-playfair" style={{ fontSize: 26 }}>Sub Categories</h1>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{subcategories.length} sub categories</div>
        </div>
        <button className="btn btn-gold" onClick={openAdd}>
          <i className="fa-solid fa-plus" /> Add Sub Category
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sub categories..."
          style={{
            flex: 1,
            minWidth: 200,
            background: "#0e0e12",
            border: "1px solid var(--line)",
            color: "var(--text)",
            padding: "9px 12px",
            borderRadius: 9,
            fontSize: 13,
            outline: "none",
          }}
        />
        <select
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
          style={{
            background: "#0e0e12",
            border: "1px solid var(--line)",
            color: "var(--text)",
            padding: "9px 11px",
            borderRadius: 9,
            fontSize: 13,
            outline: "none",
            minWidth: 180,
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="panel-bg">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sub Category</th>
                <th>Category</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>
                    <span className="badge b-gold">{getCategoryName(s.categoryId)}</span>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{s.slug}</td>
                  <td>{s.productCount}</td>
                  <td>
                    <span className={`badge ${s.status === "Active" ? "b-active" : "b-inactive"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="icon-btn" onClick={() => openEdit(s.id)} title="Edit">
                        <i className="fa-solid fa-pen" style={{ fontSize: 11 }} />
                      </button>
                      <button className="icon-btn" onClick={() => toggleStatus(s.id)} title="Toggle Status">
                        <i
                          className={`fa-solid ${s.status === "Active" ? "fa-toggle-off" : "fa-toggle-on"}`}
                          style={{ fontSize: 11 }}
                        />
                      </button>
                      <button className="icon-btn danger" onClick={() => handleDelete(s.id)} title="Delete">
                        <i className="fa-solid fa-trash" style={{ fontSize: 11 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
                    No sub categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              width: "min(560px,100%)",
              background: "linear-gradient(160deg,#15151a,#0f0f13)",
              border: "1px solid var(--line)",
              borderRadius: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <h3 className="font-playfair" style={{ color: "var(--gold)", fontSize: 20 }}>
                {editingId ? "Edit" : "Add"} Sub Category
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: 20 }}>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Parent Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Sub Category Name</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      name: e.target.value,
                      slug: p.slug ? p.slug : slugify(e.target.value),
                    }))
                  }
                  placeholder="e.g. Bridal"
                />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="e.g. bridal"
                />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Short description"
                />
              </div>

              <div className="field" style={{ marginBottom: 14 }}>
                <label>Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="field">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-gold" onClick={handleSave}>
                <i className="fa-solid fa-save" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
