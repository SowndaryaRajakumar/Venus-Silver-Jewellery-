"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { METAL_RATES, METAL_RATE_HISTORY, todayISO } from "@/lib/data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Rate = typeof METAL_RATES[0];

export default function MetalRatesPage() {
  const [rates, setRates] = useState([...METAL_RATES]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Rate | null>(null);
  const [form, setForm] = useState({ rate: 0, effectiveDate: todayISO() });

  // Live calc
  const [calcWeight, setCalcWeight] = useState(10);
  const [calcMetal, setCalcMetal] = useState("Silver 999");
  const selectedRate = rates.find(r => r.metal === calcMetal);
  const calcValue = calcWeight * (selectedRate?.rate || 0);

  const openEdit = (r: Rate) => { setEditing(r); setForm({ rate: r.rate, effectiveDate: todayISO() }); setShowModal(true); };
  const handleSave = () => {
    setRates(rates.map(r => r.id === editing?.id ? { ...r, rate: form.rate, effectiveDate: form.effectiveDate } : r));
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Metal Rates</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>Manage live metal rates for auto price calculation</div></div>
      </div>

      {/* Rate Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {rates.map(r => (
          <div key={r.id} className="panel-bg" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{r.metal}</div>
              <button className="btn btn-gold btn-sm" onClick={() => openEdit(r)}><i className="fa-solid fa-pen" /></button>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: r.metal.includes("Gold") ? "var(--gold)" : r.metal.includes("Platinum") ? "#e5e7eb" : "#d6d6d6" }}>₹{r.rate}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{r.unit}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, borderTop: "1px solid var(--line)", paddingTop: 8 }}>
              <i className="fa-solid fa-calendar" style={{ marginRight: 6 }} />Effective: {r.effectiveDate}
            </div>
          </div>
        ))}
      </div>

      {/* Live Calculation Preview */}
      <div className="panel-bg" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, marginBottom: 16 }}>Live Calculation Preview</h3>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label>Metal Type</label>
            <select value={calcMetal} onChange={e => setCalcMetal(e.target.value)}>
              {rates.map(r => <option key={r.id}>{r.metal}</option>)}
            </select>
          </div>
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label>Weight (grams)</label>
            <input type="number" value={calcWeight} onChange={e => setCalcWeight(+e.target.value)} min={0} />
          </div>
          <div style={{ flex: 1, minWidth: 200, background: "rgba(212,175,55,.08)", border: "1px solid rgba(212,175,55,.3)", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Calculated Value</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gold)" }}>₹{calcValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{calcWeight}g × ₹{selectedRate?.rate}/g</div>
          </div>
        </div>
      </div>

      {/* Rate Trend Chart */}
      <div className="panel-bg" style={{ padding: 18, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, marginBottom: 16 }}>Rate Trend — Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={METAL_RATE_HISTORY}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a33" />
            <XAxis dataKey="date" tick={{ fill: "#9a9aa6", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9a9aa6", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#15151a", border: "1px solid var(--line)", borderRadius: 10, fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted)" }} />
            <Line type="monotone" dataKey="silver999" name="Silver 999" stroke="#d6d6d6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="gold22k" name="Gold 22K" stroke="#d4af37" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* History Table */}
      <div className="panel-bg" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Rate History</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Silver 999 (₹/g)</th><th>Silver 925 (₹/g)</th><th>Gold 22K (₹/g)</th><th>Gold 24K (₹/g)</th></tr></thead>
            <tbody>
              {[...METAL_RATE_HISTORY].reverse().map((h, i) => (
                <tr key={i}>
                  <td>{h.date}</td>
                  <td style={{ color: "#d6d6d6" }}>₹{h.silver999}</td>
                  <td style={{ color: "#c0c0c0" }}>₹{h.silver925}</td>
                  <td style={{ color: "var(--gold)" }}>₹{h.gold22k}</td>
                  <td style={{ color: "var(--gold-2)" }}>₹{h.gold24k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ width: "min(440px,100%)", background: "linear-gradient(160deg,#15151a,#0f0f13)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
              <h3 className="font-playfair" style={{ color: "var(--gold)", fontSize: 20 }}>Update {editing.metal} Rate</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 14, padding: 12, background: "#0e0e12", borderRadius: 10, fontSize: 13, color: "var(--muted)" }}>
                Current Rate: <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: 16 }}>₹{editing.rate}/gram</span>
              </div>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>New Rate (₹ per gram)</label>
                <input type="number" value={form.rate} onChange={e => setForm({ ...form, rate: +e.target.value })} />
              </div>
              <div className="field">
                <label>Effective Date</label>
                <input type="date" value={form.effectiveDate} onChange={e => setForm({ ...form, effectiveDate: e.target.value })} />
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}><i className="fa-solid fa-save" /> Update Rate</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
