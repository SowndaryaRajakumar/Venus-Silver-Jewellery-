"use client";
import AdminLayout from "@/components/AdminLayout";
import { PRODUCTS, ORDERS, CUSTOMERS, METAL_RATES, MONTHLY_REVENUE, ORDER_STATUS_DIST, ENQUIRIES, NEWSLETTER_SUBSCRIBERS, fmt, CUSTOM_DESIGN_REQUESTS } from "@/lib/data";


import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

import Link from "next/link";

function StatCard({ label, value, icon, delta, color = "var(--gold)" }: any) {
  return (
    <div className="stat-card" style={{ padding: 18 }}>
      <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8, color: "#fff" }}>{value}</div>
      {delta && <div style={{ fontSize: 12, marginTop: 4, color: "var(--success)" }}>{delta}</div>}
      <div style={{ position: "absolute", right: 14, bottom: 14, width: 38, height: 38, borderRadius: 10, background: `rgba(212,175,55,.12)`, color, display: "grid", placeItems: "center" }}>
        <i className={`fa-solid ${icon}`} style={{ fontSize: 16 }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const totalRevenue = ORDERS.filter(o => o.status !== "Cancelled").reduce((a, b) => a + b.total, 0);
  const pendingOrders = ORDERS.filter(o => o.status === "Pending").length;
  const deliveredOrders = ORDERS.filter(o => o.status === "Delivered").length;
  const lowStock = PRODUCTS.filter(p => p.stockQty <= 3 && p.stockQty > 0);
  const outOfStock = PRODUCTS.filter(p => p.stockQty === 0);
  const silverRate = METAL_RATES.find(r => r.metal === "Silver 999")!;
  const goldRate = METAL_RATES.find(r => r.metal === "Gold 22K")!;

  return (
    <AdminLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>

        <div>
          <h1 className="font-playfair" style={{ fontSize: 26 }}>Dashboard</h1>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Overview of Venus Silver Jewellery</div>
        </div>
        <Link href="/products/create" className="btn btn-gold"><i className="fa-solid fa-plus" /> Add Product</Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        <StatCard label="Total Products" value={PRODUCTS.length} icon="fa-gem" delta="+2 this week" />
        <StatCard label="Total Orders" value={ORDERS.length} icon="fa-bag-shopping" delta="+5 this week" />
        <StatCard label="Total Customers" value={CUSTOMERS.length} icon="fa-users" delta="+1 this week" />
        <StatCard label="Total Revenue" value={fmt(totalRevenue)} icon="fa-indian-rupee-sign" delta="+12% this month" />
        <StatCard label="Pending Orders" value={pendingOrders} icon="fa-clock" color="var(--warn)" />
        <StatCard label="Delivered Orders" value={deliveredOrders} icon="fa-circle-check" color="var(--success)" />
        {/* Custom Designs Widgets */}
        <StatCard label="Total Design Requests" value={CUSTOM_DESIGN_REQUESTS.length} icon="fa-ruler-combined" />
        <StatCard
          label="Pending Requests"
          value={CUSTOM_DESIGN_REQUESTS.filter(r => ["Pending", "Quotation Sent", "Reviewing"].includes(r.status)).length}
          icon="fa-clock"
          color="var(--warn)"
        />
        <StatCard
          label="Approved Requests"
          value={CUSTOM_DESIGN_REQUESTS.filter(r => r.status === "Approved").length}
          icon="fa-circle-check"
          color="var(--success)"
        />
        <StatCard
          label="Production Requests"
          value={CUSTOM_DESIGN_REQUESTS.filter(r => ["Production Started", "Production Completed"].includes(r.status)).length}
          icon="fa-industry"
        />

        <StatCard
          label="Completed Requests"
          value={CUSTOM_DESIGN_REQUESTS.filter(r => r.status === "Delivered").length}
          icon="fa-circle-nodes"
          color="var(--success)"
        />


        <StatCard label="Subscribers" value={NEWSLETTER_SUBSCRIBERS.length} icon="fa-envelope" />
        <StatCard label="Enquiries" value={ENQUIRIES.filter(e => e.status === "Open").length} icon="fa-message" color="var(--info)" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 16, marginBottom: 16 }}>
        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>Revenue Trend <small style={{ color: "var(--muted)", fontWeight: 400 }}>Last 12 months</small></h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a33" />
              <XAxis dataKey="month" tick={{ fill: "#9a9aa6", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9a9aa6", fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#15151a", border: "1px solid var(--line)", borderRadius: 10, fontSize: 13 }} formatter={(v: any) => [fmt(v), "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>Order Status <small style={{ color: "var(--muted)", fontWeight: 400 }}>Distribution</small></h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={ORDER_STATUS_DIST} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                {ORDER_STATUS_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#15151a", border: "1px solid var(--line)", borderRadius: 10, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metal Rates + Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, marginBottom: 16 }}>
        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Today's Metal Rates</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div className="rate-widget">
              <div>
                <div style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Silver 999</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>₹{silverRate.rate}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>per gram</div>
              </div>
              <i className="fa-solid fa-medal" style={{ fontSize: 30, color: "#d6d6d6" }} />
            </div>
            <div className="rate-widget">
              <div>
                <div style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Gold 22K</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>₹{goldRate.rate}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>per gram</div>
              </div>
              <i className="fa-solid fa-coins" style={{ fontSize: 30, color: "var(--gold)" }} />
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--muted)" }}>INVENTORY ALERTS</div>
            {[...lowStock, ...outOfStock].slice(0, 5).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                <span>{p.name}</span>
                <span className={`badge ${p.stockQty === 0 ? "b-out" : "b-low"}`}>{p.stockQty === 0 ? "Out of Stock" : `${p.stockQty} left`}</span>
              </div>
            ))}
            {lowStock.length === 0 && outOfStock.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>All products adequately stocked ✓</div>}
          </div>
        </div>

        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Recent Orders</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {ORDERS.slice(0, 6).map(o => (
                  <tr key={o.id}>
                    <td style={{ color: "var(--gold)", fontWeight: 600 }}>{o.id}</td>
                    <td>{o.customerName}</td>
                    <td>{fmt(o.total)}</td>
                    <td><span className={`badge b-${o.status.toLowerCase()}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Customers + Enquiries */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Recent Customers</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>City</th><th>Orders</th><th>Spent</th></tr></thead>
              <tbody>
                {CUSTOMERS.slice(0, 5).map(c => (
                  <tr key={c.id}>
                    <td><div style={{ fontWeight: 500 }}>{c.name}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{c.phone}</div></td>
                    <td>{c.city}</td>
                    <td>{c.totalOrders}</td>
                    <td style={{ color: "var(--gold)" }}>{fmt(c.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-bg" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Recent Enquiries</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Message</th><th>Status</th></tr></thead>
              <tbody>
                {ENQUIRIES.slice(0, 5).map(e => (
                  <tr key={e.id}>
                    <td><div style={{ fontWeight: 500 }}>{e.name}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>{e.phone}</div></td>
                    <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.message}</td>
                    <td><span className={`badge ${e.status === "Open" ? "b-pending" : "b-delivered"}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
