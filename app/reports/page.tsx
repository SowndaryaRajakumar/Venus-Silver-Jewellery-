"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { ORDERS, PRODUCTS, CUSTOMERS, MONTHLY_REVENUE, fmt } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const REPORT_TYPES = ["Sales Report", "Revenue Report", "Customer Report", "Product Report", "Stock Report", "Order Report"];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState("Sales Report");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const totalRevenue = ORDERS.filter(o => o.status !== "Cancelled").reduce((a, b) => a + b.total, 0);
  const totalOrders = ORDERS.length;
  const avgOrderValue = totalRevenue / totalOrders;
  const deliveredOrders = ORDERS.filter(o => o.status === "Delivered").length;
  const deliveryRate = ((deliveredOrders / totalOrders) * 100).toFixed(1);

  const topProducts = PRODUCTS.slice().sort((a, b) => b.stockQty - a.stockQty).slice(0, 5);
  const lowStockProducts = PRODUCTS.filter(p => p.stockQty <= 3);

  const exportCSV = (data: any[], filename: string) => {
    const keys = Object.keys(data[0]);
    const h = keys.join(",") + "\n";
    const r = data.map(d => keys.map(k => d[k]).join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(h + r); a.download = filename; a.click();
  };

  const printReport = () => {
    window.print();
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Reports</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>Comprehensive business analytics</div></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={printReport}><i className="fa-solid fa-print" /> Print</button>
          <button className="btn btn-ghost btn-sm" onClick={() => exportCSV(ORDERS, "report.csv")}><i className="fa-solid fa-download" /> Export CSV</button>
        </div>
      </div>

      {/* Report Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {REPORT_TYPES.map(r => (
          <button key={r} onClick={() => setActiveReport(r)} className="btn btn-sm" style={{ background: activeReport === r ? "var(--gold)" : "#1a1a22", color: activeReport === r ? "#1a1300" : "var(--muted)", border: "1px solid var(--line)" }}>{r}</button>
        ))}
      </div>

      {/* Date Filter */}
      <div className="panel-bg" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="field" style={{ margin: 0 }}><label>From Date</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
          <div className="field" style={{ margin: 0 }}><label>To Date</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
          <button className="btn btn-gold btn-sm"><i className="fa-solid fa-filter" /> Apply Filter</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setDateFrom(""); setDateTo(""); }}>Clear</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Revenue", value: fmt(totalRevenue), icon: "fa-indian-rupee-sign", color: "var(--gold)" },
          { label: "Total Orders", value: totalOrders, icon: "fa-bag-shopping", color: "var(--info)" },
          { label: "Avg Order Value", value: fmt(avgOrderValue), icon: "fa-chart-line", color: "var(--success)" },
          { label: "Delivery Rate", value: `${deliveryRate}%`, icon: "fa-truck", color: "#c084fc" },
          { label: "Total Customers", value: CUSTOMERS.length, icon: "fa-users", color: "var(--warn)" },
          { label: "Total Products", value: PRODUCTS.length, icon: "fa-gem", color: "var(--gold)" },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6, color: "#fff" }}>{s.value}</div>
            <div style={{ position: "absolute", right: 12, bottom: 12, width: 32, height: 32, borderRadius: 8, background: `rgba(212,175,55,.12)`, color: s.color, display: "grid", placeItems: "center" }}>
              <i className={`fa-solid ${s.icon}`} style={{ fontSize: 13 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a33" />
              <XAxis dataKey="month" tick={{ fill: "#9a9aa6", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9a9aa6", fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#15151a", border: "1px solid var(--line)", borderRadius: 10, fontSize: 13 }} formatter={(v: any) => [fmt(v), "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} fill="url(#rev2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a33" />
              <XAxis dataKey="month" tick={{ fill: "#9a9aa6", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9a9aa6", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#15151a", border: "1px solid var(--line)", borderRadius: 10, fontSize: 13 }} />
              <Bar dataKey="orders" fill="#d4af37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Report */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Top Products by Stock</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>Stock</th></tr></thead>
              <tbody>
                {topProducts.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td style={{ color: "var(--success)", fontWeight: 600 }}>{p.stockQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Low / Out of Stock Alert</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Stock</th><th>Status</th></tr></thead>
              <tbody>
                {lowStockProducts.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{p.stockQty}</td>
                    <td><span className={`badge ${p.stockQty === 0 ? "b-out" : "b-low"}`}>{p.stockQty === 0 ? "Out of Stock" : "Low Stock"}</span></td>
                  </tr>
                ))}
                {lowStockProducts.length === 0 && <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--success)", padding: 20 }}>All products adequately stocked ✓</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
