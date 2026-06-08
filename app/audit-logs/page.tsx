"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { AUDIT_LOGS } from "@/lib/data";

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "b-confirmed",
  CREATE: "b-approved",
  UPDATE: "b-pending",
  DELETE: "b-cancelled",
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("");

  const filtered = AUDIT_LOGS.filter(l =>
    (!search || l.user.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase()) || l.module.toLowerCase().includes(search.toLowerCase())) &&
    (!filterAction || l.action === filterAction)
  );

  const exportCSV = () => {
    const h = "ID,User,Action,Module,Details,IP,Timestamp\n";
    const r = AUDIT_LOGS.map(l => `${l.id},${l.user},${l.action},${l.module},"${l.details}",${l.ip},${l.timestamp}`).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(h + r); a.download = "audit-logs.csv"; a.click();
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Audit Logs</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>Track all admin actions and system events</div></div>
        <button className="btn btn-ghost btn-sm" onClick={exportCSV}><i className="fa-solid fa-download" /> Export</button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." style={{ flex: 1, minWidth: 200, background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 12px", borderRadius: 9, fontSize: 13, outline: "none" }} />
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)} style={{ background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: "9px 11px", borderRadius: 9, fontSize: 13, outline: "none" }}>
          <option value="">All Actions</option>
          <option>LOGIN</option><option>CREATE</option><option>UPDATE</option><option>DELETE</option>
        </select>
      </div>

      <div className="panel-bg">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Module</th><th>Details</th><th>IP Address</th></tr></thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td style={{ color: "var(--muted)", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(l.timestamp).toLocaleString("en-IN")}</td>
                  <td style={{ fontWeight: 500 }}>{l.user}</td>
                  <td><span className={`badge ${ACTION_COLORS[l.action] || "b-draft"}`}>{l.action}</span></td>
                  <td style={{ color: "var(--gold)" }}>{l.module}</td>
                  <td style={{ fontSize: 13, color: "var(--muted)" }}>{l.details}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{l.ip}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No logs found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
