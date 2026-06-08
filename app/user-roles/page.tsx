"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { ROLES } from "@/lib/data";

const ALL_MODULES = ["Dashboard", "Products", "Categories", "Sub Categories", "Orders", "Customers", "Wishlist", "Reviews", "Metal Rates", "Hero Banners", "Newsletter", "Coupons", "Reports", "Invoice Center", "CMS", "Enquiries", "Settings", "Audit Logs", "User Roles"];
const ACTIONS = ["View", "Create", "Edit", "Delete"];

const DEFAULT_PERMS: Record<string, Record<string, boolean>> = {
  "ROL001": Object.fromEntries(ALL_MODULES.flatMap(m => ACTIONS.map(a => [`${m}:${a}`, true]))),
  "ROL002": Object.fromEntries(ALL_MODULES.flatMap(m => ACTIONS.map(a => [`${m}:${a}`, !["Settings", "Audit Logs", "User Roles"].includes(m)]))),
  "ROL003": Object.fromEntries(ALL_MODULES.flatMap(m => ACTIONS.map(a => [`${m}:${a}`, ["Dashboard", "Orders", "Customers"].includes(m) && a === "View"]))),
};

export default function UserRolesPage() {
  const [roles] = useState([...ROLES]);
  const [activeRole, setActiveRole] = useState("ROL001");
  const [perms, setPerms] = useState({ ...DEFAULT_PERMS });
  const [saved, setSaved] = useState(false);

  const togglePerm = (key: string) => {
    setPerms(p => ({ ...p, [activeRole]: { ...p[activeRole], [key]: !p[activeRole][key] } }));
  };

  const toggleModule = (module: string) => {
    const allOn = ACTIONS.every(a => perms[activeRole][`${module}:${a}`]);
    setPerms(p => ({
      ...p,
      [activeRole]: {
        ...p[activeRole],
        ...Object.fromEntries(ACTIONS.map(a => [`${module}:${a}`, !allOn]))
      }
    }));
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const activeRoleData = roles.find(r => r.id === activeRole);

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>User Roles & Permissions</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>Manage access control for admin users</div></div>
        <button className="btn btn-gold" onClick={handleSave}>{saved ? <><i className="fa-solid fa-check" /> Saved!</> : <><i className="fa-solid fa-save" /> Save Permissions</>}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, alignItems: "start" }}>
        {/* Roles List */}
        <div className="panel-bg" style={{ padding: 14 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Roles</div>
          {roles.map(r => (
            <button key={r.id} onClick={() => setActiveRole(r.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 12px", borderRadius: 8, background: activeRole === r.id ? "rgba(212,175,55,.15)" : "none", border: activeRole === r.id ? "1px solid rgba(212,175,55,.3)" : "1px solid transparent", color: activeRole === r.id ? "var(--gold)" : "var(--text)", cursor: "pointer", marginBottom: 6, textAlign: "left", transition: "all 0.15s" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{r.userCount} users</div>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: 11, opacity: 0.5 }} />
            </button>
          ))}
          <button className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: 8 }}><i className="fa-solid fa-plus" /> New Role</button>
        </div>

        {/* Permission Matrix */}
        <div className="panel-bg" style={{ padding: 18 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>{activeRoleData?.name}</h3>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{activeRoleData?.description}</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ minWidth: 160 }}>Module</th>
                  {ACTIONS.map(a => <th key={a} style={{ textAlign: "center", width: 80 }}>{a}</th>)}
                  <th style={{ textAlign: "center" }}>All</th>
                </tr>
              </thead>
              <tbody>
                {ALL_MODULES.map(module => {
                  const allOn = ACTIONS.every(a => perms[activeRole]?.[`${module}:${a}`]);
                  return (
                    <tr key={module}>
                      <td style={{ fontWeight: 500 }}>{module}</td>
                      {ACTIONS.map(a => (
                        <td key={a} style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={perms[activeRole]?.[`${module}:${a}`] || false}
                            onChange={() => togglePerm(`${module}:${a}`)}
                            style={{ accentColor: "var(--gold)", width: 16, height: 16, cursor: "pointer" }}
                          />
                        </td>
                      ))}
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={allOn}
                          onChange={() => toggleModule(module)}
                          style={{ accentColor: "var(--gold)", width: 16, height: 16, cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
