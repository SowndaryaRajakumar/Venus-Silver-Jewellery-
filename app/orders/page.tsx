"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { ORDERS, fmt } from "@/lib/data";

const STATUSES = ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"];
type Order = typeof ORDERS[0];

export default function OrdersPage() {
  const [orders, setOrders] = useState([...ORDERS]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = orders.filter(o =>
    (!search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || o.status === filterStatus)
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const updateStatus = (id: string, status: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    if (viewOrder?.id === id) setViewOrder({ ...viewOrder, status });
  };

  const exportCSV = () => {
    const h = "Order ID,Customer,Phone,Product,Qty,Total,Payment,Delivery,Status,Date\n";
    const r = orders.map(o => `${o.id},${o.customerName},${o.phone},${o.productName},${o.qty},${o.total},${o.payment},${o.delivery},${o.status},${o.orderDate}`).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(h + r); a.download = "orders.csv"; a.click();
  };

  const printOrder = (o: Order) => {
    const w = window.open("", "_blank")!;
    w.document.write(`<html><head><title>Order ${o.id}</title><style>body{font-family:sans-serif;padding:20px;}</style></head><body>
      <h2>Venus Silver Jewellery - Order Receipt</h2>
      <p>Order ID: <b>${o.id}</b> | Date: ${o.orderDate}</p>
      <p>Customer: ${o.customerName} | Phone: ${o.phone}</p>
      <p>Product: ${o.productName} | Qty: ${o.qty}</p>
      <p>Amount: ₹${o.amount.toFixed(2)} | GST: ₹${o.gst.toFixed(2)} | <b>Total: ₹${o.total.toFixed(2)}</b></p>
      <p>Payment: ${o.payment} | Delivery: ${o.delivery} | Status: ${o.status}</p>
    </body></html>`);
    w.print();
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="font-playfair" style={{ fontSize: 26 }}>Orders</h1>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{orders.length} total orders</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={exportCSV}><i className="fa-solid fa-download" /> Export CSV</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total", count: orders.length, color: "var(--text)" },
          { label: "Pending", count: orders.filter(o => o.status === "Pending").length, color: "var(--warn)" },
          { label: "Processing", count: orders.filter(o => o.status === "Processing").length, color: "#c084fc" },
          { label: "Delivered", count: orders.filter(o => o.status === "Delivered").length, color: "var(--success)" },
          { label: "Cancelled", count: orders.filter(o => o.status === "Cancelled").length, color: "var(--danger)" },
        ].map(s => (
          <div key={s.label} className="panel-bg" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..." style={{ flex: 1, minWidth: 200, background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 11px", borderRadius: 9, fontSize: 13, outline: "none" }}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="panel-bg">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Payment</th><th>Delivery</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {paginated.map(o => (
                <tr key={o.id}>
                  <td style={{ color: "var(--gold)", fontWeight: 600 }}>{o.id}</td>
                  <td><div style={{ fontWeight: 500 }}>{o.customerName}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{o.phone}</div></td>
                  <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.productName} × {o.qty}</td>
                  <td style={{ color: "var(--gold)" }}>{fmt(o.total)}</td>
                  <td><span className="badge b-gold">{o.payment}</span></td>
                  <td style={{ fontSize: 12 }}>{o.delivery}</td>
                  <td><span className={`badge b-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{o.orderDate}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="icon-btn" onClick={() => setViewOrder(o)} title="View"><i className="fa-solid fa-eye" style={{ fontSize: 11 }} /></button>
                      <button className="icon-btn" onClick={() => printOrder(o)} title="Print"><i className="fa-solid fa-print" style={{ fontSize: 11 }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={9} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No orders found</td></tr>}
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

      {/* View Order Modal */}
      {viewOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: "30px 16px", overflowY: "auto" }}>
          <div style={{ width: "min(700px,100%)", background: "linear-gradient(160deg,#15151a,#0f0f13)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
              <h3 className="font-playfair" style={{ color: "var(--gold)", fontSize: 20 }}>Order: {viewOrder.id}</h3>
              <button onClick={() => setViewOrder(null)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#0e0e12", borderRadius: 10, padding: 14 }}>
                  <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Customer Details</div>
                  <div style={{ fontWeight: 600 }}>{viewOrder.customerName}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{viewOrder.phone}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{viewOrder.address}</div>
                </div>
                <div style={{ background: "#0e0e12", borderRadius: 10, padding: 14 }}>
                  <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Order Details</div>
                  <div style={{ fontSize: 13 }}><span style={{ color: "var(--muted)" }}>Date: </span>{viewOrder.orderDate}</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}><span style={{ color: "var(--muted)" }}>Payment: </span>{viewOrder.payment}</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}><span style={{ color: "var(--muted)" }}>Delivery: </span>{viewOrder.delivery}</div>
                </div>
              </div>

              <div style={{ background: "#0e0e12", borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Product</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{viewOrder.productName} × {viewOrder.qty}</span>
                  <span>{fmt(viewOrder.amount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4, color: "var(--muted)" }}>
                  <span>GST (3%)</span><span>{fmt(viewOrder.gst)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--line)", color: "var(--gold)" }}>
                  <span>Total</span><span>{fmt(viewOrder.total)}</span>
                </div>
              </div>

              {/* Order Timeline */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Order Timeline</div>
                <div style={{ display: "flex", gap: 0 }}>
                  {STATUSES.filter(s => s !== "Cancelled").map((s, i) => {
                    const statusIndex = STATUSES.filter(x => x !== "Cancelled").indexOf(viewOrder.status);
                    const isActive = i <= statusIndex && viewOrder.status !== "Cancelled";
                    return (
                      <div key={s} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: isActive ? "var(--gold)" : "#1a1a22", border: "2px solid " + (isActive ? "var(--gold)" : "var(--line)"), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", color: isActive ? "#1a1300" : "var(--muted)", fontSize: 11, fontWeight: 700 }}>
                          {isActive ? <i className="fa-solid fa-check" style={{ fontSize: 10 }} /> : i + 1}
                        </div>
                        <div style={{ fontSize: 10, marginTop: 4, color: isActive ? "var(--gold)" : "var(--muted)" }}>{s}</div>
                        {i < 5 && <div style={{ position: "absolute", top: 14, left: "50%", right: "-50%", height: 2, background: isActive && i < statusIndex ? "var(--gold)" : "var(--line)", zIndex: -1 }} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Update Status */}
              <div>
                <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Update Status</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(viewOrder.id, s)} className="btn btn-sm" style={{ background: viewOrder.status === s ? "var(--gold)" : "#1a1a22", color: viewOrder.status === s ? "#1a1300" : "var(--muted)", border: "1px solid var(--line)" }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => printOrder(viewOrder)}><i className="fa-solid fa-print" /> Print</button>
              <button className="btn btn-gold btn-sm" onClick={() => setViewOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
