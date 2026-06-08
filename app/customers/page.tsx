"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { CUSTOMERS, ORDERS, fmt } from "@/lib/data";

type Customer = typeof CUSTOMERS[0];

export default function CustomersPage() {
  const [customers] = useState([...CUSTOMERS]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = customers.filter(c =>
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || c.status === filterStatus)
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const exportCSV = () => {
    const h = "ID,Name,Phone,Email,City,State,Orders,Total Spent,Status,Joined\n";
    const r = customers.map(c => `${c.id},${c.name},${c.phone},${c.email},${c.city},${c.state},${c.totalOrders},${c.totalSpent},${c.status},${c.joinedAt}`).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(h + r); a.download = "customers.csv"; a.click();
  };

  const customerOrders = viewCustomer ? ORDERS.filter(o => o.customerId === viewCustomer.id) : [];

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Customers</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>{customers.length} registered customers</div></div>
        <button className="btn btn-ghost btn-sm" onClick={exportCSV}><i className="fa-solid fa-download" /> Export CSV</button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, email..." style={{ flex: 1, minWidth: 200, background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 11px", borderRadius: 9, fontSize: 13, outline: "none" }}>
          <option value="">All Status</option><option>Active</option><option>Inactive</option>
        </select>
      </div>

      <div className="panel-bg">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>Phone</th><th>City</th><th>Orders</th><th>Total Spent</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#f4d57a,#b8860b)", display: "grid", placeItems: "center", color: "#1a1300", fontWeight: 700, flexShrink: 0 }}>{c.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.phone}</td>
                  <td>{c.city}, {c.state}</td>
                  <td style={{ fontWeight: 600 }}>{c.totalOrders}</td>
                  <td style={{ color: "var(--gold)", fontWeight: 600 }}>{fmt(c.totalSpent)}</td>
                  <td><span className={`badge ${c.status === "Active" ? "b-active" : "b-inactive"}`}>{c.status}</span></td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{c.joinedAt}</td>
                  <td><button className="icon-btn" onClick={() => setViewCustomer(c)}><i className="fa-solid fa-eye" style={{ fontSize: 11 }} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--line)", background: page === i + 1 ? "var(--gold)" : "#1a1a22", color: page === i + 1 ? "#1a1300" : "var(--text)", cursor: "pointer", fontWeight: 600 }}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {viewCustomer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: "30px 16px", overflowY: "auto" }}>
          <div style={{ width: "min(700px,100%)", background: "linear-gradient(160deg,#15151a,#0f0f13)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
              <h3 className="font-playfair" style={{ color: "var(--gold)", fontSize: 20 }}>{viewCustomer.name}</h3>
              <button onClick={() => setViewCustomer(null)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#0e0e12", borderRadius: 10, padding: 14 }}>
                  <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Contact</div>
                  <div style={{ fontSize: 13 }}><i className="fa-solid fa-phone" style={{ color: "var(--gold)", marginRight: 8 }} />{viewCustomer.phone}</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}><i className="fa-solid fa-envelope" style={{ color: "var(--gold)", marginRight: 8 }} />{viewCustomer.email}</div>
                </div>
                <div style={{ background: "#0e0e12", borderRadius: 10, padding: 14 }}>
                  <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Address</div>
                  <div style={{ fontSize: 13 }}>{viewCustomer.address}, {viewCustomer.city}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{viewCustomer.state} - {viewCustomer.pincode}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[["Total Orders", viewCustomer.totalOrders, "var(--text)"], ["Total Spent", fmt(viewCustomer.totalSpent), "var(--gold)"], ["Status", viewCustomer.status, viewCustomer.status === "Active" ? "var(--success)" : "var(--danger)"]].map(([l, v, c]) => (
                  <div key={String(l)} style={{ background: "#0e0e12", borderRadius: 10, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: String(c) }}>{String(v)}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{String(l)}</div>
                  </div>
                ))}
              </div>
              {customerOrders.length > 0 && (
                <div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Order History</div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Order ID</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {customerOrders.map(o => (
                          <tr key={o.id}>
                            <td style={{ color: "var(--gold)" }}>{o.id}</td>
                            <td>{o.productName}</td>
                            <td>{fmt(o.total)}</td>
                            <td><span className={`badge b-${o.status.toLowerCase()}`}>{o.status}</span></td>
                            <td style={{ color: "var(--muted)", fontSize: 12 }}>{o.orderDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-gold" onClick={() => setViewCustomer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
