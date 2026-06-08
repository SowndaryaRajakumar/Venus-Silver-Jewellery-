"use client";
import { useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminStore } from "@/lib/admin-store";
import { fmt } from "@/lib/data";
import { hasPermission } from "@/lib/permissions";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const { categories, subcategories, products, deleteProduct } = useAdminStore();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || "Unknown";

  const getSubCategoryName = (subCategoryId: string) =>
    subcategories.find((s) => s.id === subCategoryId)?.name || "Unknown";

  const filtered = products.filter(
    (p) =>
      (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())) &&
      (!filterCat || p.categoryId === filterCat) &&
      (!filterStatus || p.status === filterStatus)
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id: string) => {
    if (!hasPermission("PRODUCT_DELETE")) return;
    if (confirm("Delete this product?")) deleteProduct(id);
  };

  const handleBulkDelete = () => {
    if (!hasPermission("PRODUCT_DELETE")) return;
    if (confirm(`Delete ${selected.length} products?`)) {
      selected.forEach((id) => deleteProduct(id));
      setSelected([]);
    }
  };
  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const exportCSV = () => {
    const headers = "ID,Name,SKU,Category,Sub Category,Status\n";
    const rows = products
      .map(
        (p) =>
          `${p.id},${p.name},${p.sku},${getCategoryName(p.categoryId)},${getSubCategoryName(p.subCategoryId)},${p.status}`
      )
      .join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(headers + rows);
    a.download = "products.csv";
    a.click();
  };

  return (
    <AdminLayout>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 className="font-playfair" style={{ fontSize: 26 }}>
            Products
          </h1>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{products.length} total products</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {selected.length > 0 && hasPermission("PRODUCT_DELETE") && (
            <button className="btn btn-danger btn-sm" onClick={handleBulkDelete}>
              <i className="fa-solid fa-trash" /> Delete ({selected.length})
            </button>
          )}

          <button className="btn btn-ghost btn-sm" onClick={exportCSV}>
            <i className="fa-solid fa-download" /> Export CSV
          </button>
          <button
            className="btn btn-gold"
            onClick={() => {
              if (!hasPermission("PRODUCT_CREATE")) return;
              router.push("/products/create");
            }}
          >
            <i className="fa-solid fa-plus" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
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
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          style={{
            background: "#0e0e12",
            border: "1px solid var(--line)",
            color: "var(--text)",
            padding: "9px 11px",
            borderRadius: 9,
            fontSize: 13,
            outline: "none",
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            background: "#0e0e12",
            border: "1px solid var(--line)",
            color: "var(--text)",
            padding: "9px 11px",
            borderRadius: 9,
            fontSize: 13,
            outline: "none",
          }}
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Draft</option>
        </select>
      </div>

      <div className="panel-bg">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelected(e.target.checked ? paginated.map((p) => p.id) : [])
                    }
                  />
                </th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          background:
                            "linear-gradient(135deg,rgba(212,175,55,.2),rgba(212,175,55,.05))",
                          border: "1px solid rgba(212,175,55,.2)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <i className="fa-solid fa-gem" style={{ color: "var(--gold)", fontSize: 14 }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>
                          {p.productCode}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--muted)", fontFamily: "monospace" }}>{p.sku}</td>
                  <td>
                    <span className="badge b-gold">{getCategoryName(p.categoryId)}</span>
                  </td>
                  <td>{getSubCategoryName(p.subCategoryId)}</td>
                  <td style={{ color: "var(--gold)", fontWeight: 600 }}>
                    {fmt(p.basePrice)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.status === "Active"
                          ? "b-active"
                          : p.status === "Draft"
                            ? "b-draft"
                            : "b-inactive"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {hasPermission("PRODUCT_EDIT") && (
                        <button
                          className="icon-btn"
                          onClick={() => alert("Edit Product is not implemented yet.")}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen" style={{ fontSize: 11 }} />
                        </button>
                      )}

                      {hasPermission("PRODUCT_DELETE") && (
                        <button
                          className="icon-btn danger"
                          onClick={() => handleDelete(p.id)}
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash" style={{ fontSize: 11 }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid var(--line)",
                  background: page === i + 1 ? "var(--gold)" : "#1a1a22",
                  color: page === i + 1 ? "#1a1300" : "var(--text)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
