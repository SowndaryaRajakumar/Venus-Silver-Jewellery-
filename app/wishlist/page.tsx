"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { WISHLISTS, fmt } from "@/lib/data";

export default function WishlistPage() {
  const [wishlists] = useState([...WISHLISTS]);
  const [search, setSearch] = useState("");

  const filtered = wishlists.filter(w =>
    !search || w.customerName.toLowerCase().includes(search.toLowerCase()) || w.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Wishlist</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>{wishlists.length} items in customer wishlists</div></div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer or product..." style={{ width: "100%", maxWidth: 400, background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }} />
      </div>

      <div className="panel-bg">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>Product</th><th>Price</th><th>Added On</th></tr></thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f4d57a,#b8860b)", display: "grid", placeItems: "center", color: "#1a1300", fontWeight: 700, fontSize: 13 }}>{w.customerName[0]}</div>
                      <span style={{ fontWeight: 500 }}>{w.customerName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(212,175,55,.1)", display: "grid", placeItems: "center" }}>
                        <i className="fa-solid fa-gem" style={{ color: "var(--gold)", fontSize: 12 }} />
                      </div>
                      {w.productName}
                    </div>
                  </td>
                  <td style={{ color: "var(--gold)", fontWeight: 600 }}>{fmt(w.price)}</td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{w.addedAt}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No wishlist items found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
