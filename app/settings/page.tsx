"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";

const SECTIONS = ["Store Settings", "SEO Settings", "Theme Settings", "Tax Settings", "Invoice Settings", "Email Templates", "Notification Settings", "Security Settings", "API Settings", "Maintenance Mode", "System Information"];

export default function SettingsPage() {
  const [active, setActive] = useState("Store Settings");
  const [saved, setSaved] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  const [store, setStore] = useState({
    name: "Venus Silver Jewellery",
    tagline: "Crafting Precious Moments",
    address: "59E, Ramalinga Nagar, Anaiyar, Madurai – 625017",
    phone: "7338834666",
    email: "admin@venussilver.in",
    email2: "Venus999silver@gmail.com",
    gst: "33AABCV1234K1Z5",
    currency: "INR",
    language: "English",
    timezone: "Asia/Kolkata",
    facebook: "https://facebook.com/venussilver",
    instagram: "https://instagram.com/venussilver",
    whatsapp: "7338834666",
  });

  const [tax, setTax] = useState({ goldGst: 3, silverGst: 3, makingGst: 5, enableGst: true });
  const [security, setSecurity] = useState({ minPassword: 8, sessionTimeout: 60, twoFactor: false, loginAttempts: 5 });
  const [invoice, setInvoice] = useState({ prefix: "INV", nextNumber: 1001, termsLine1: "All jewellery is BIS Hallmarked.", showQR: true, showSignature: true });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const renderSection = () => {
    switch (active) {
      case "Store Settings": return (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[["Store Name", "name", "text"], ["Tagline", "tagline", "text"], ["Phone", "phone", "text"], ["Primary Email", "email", "email"], ["Secondary Email", "email2", "email"], ["GST Number", "gst", "text"], ["Currency", "currency", "text"], ["Language", "language", "text"], ["Timezone", "timezone", "text"]].map(([l, k, t]) => (
              <div className="field" key={k}><label>{l}</label><input type={t} value={(store as any)[k]} onChange={e => setStore({ ...store, [k]: e.target.value })} /></div>
            ))}
            <div className="field" style={{ gridColumn: "1 / -1" }}><label>Business Address</label><textarea value={store.address} onChange={e => setStore({ ...store, address: e.target.value })} rows={2} /></div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
            <h4 style={{ color: "var(--gold)", fontSize: 13, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Social Media Links</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
              {[["Facebook", "facebook", "fa-facebook"], ["Instagram", "instagram", "fa-instagram"], ["WhatsApp", "whatsapp", "fa-whatsapp"]].map(([l, k, icon]) => (
                <div className="field" key={k}>
                  <label><i className={`fa-brands ${icon}`} style={{ marginRight: 6, color: "var(--gold)" }} />{l}</label>
                  <input value={(store as any)[k]} onChange={e => setStore({ ...store, [k]: e.target.value })} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
            <h4 style={{ color: "var(--gold)", fontSize: 13, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Logo & Favicon</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {["Store Logo", "Favicon (32×32)"].map(label => (
                <div key={label} style={{ border: "1px dashed var(--line)", borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer", color: "var(--muted)" }}>
                  <i className="fa-solid fa-cloud-upload-alt" style={{ fontSize: 24, display: "block", marginBottom: 8 }} />
                  <div style={{ fontSize: 13 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      case "Tax Settings": return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div className="field"><label>Gold Jewellery GST (%)</label><input type="number" value={tax.goldGst} onChange={e => setTax({ ...tax, goldGst: +e.target.value })} /></div>
          <div className="field"><label>Silver Jewellery GST (%)</label><input type="number" value={tax.silverGst} onChange={e => setTax({ ...tax, silverGst: +e.target.value })} /></div>
          <div className="field"><label>Making Charge GST (%)</label><input type="number" value={tax.makingGst} onChange={e => setTax({ ...tax, makingGst: +e.target.value })} /></div>
          <div className="field"><label>GST Enabled</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <input type="checkbox" checked={tax.enableGst} onChange={e => setTax({ ...tax, enableGst: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--gold)", cursor: "pointer" }} />
              <span style={{ fontSize: 13 }}>Apply GST on all orders</span>
            </div>
          </div>
        </div>
      );

      case "Security Settings": return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div className="field"><label>Min Password Length</label><input type="number" value={security.minPassword} onChange={e => setSecurity({ ...security, minPassword: +e.target.value })} /></div>
          <div className="field"><label>Session Timeout (min)</label><input type="number" value={security.sessionTimeout} onChange={e => setSecurity({ ...security, sessionTimeout: +e.target.value })} /></div>
          <div className="field"><label>Max Login Attempts</label><input type="number" value={security.loginAttempts} onChange={e => setSecurity({ ...security, loginAttempts: +e.target.value })} /></div>
          <div className="field"><label>Two-Factor Auth</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <input type="checkbox" checked={security.twoFactor} onChange={e => setSecurity({ ...security, twoFactor: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--gold)", cursor: "pointer" }} />
              <span style={{ fontSize: 13 }}>Enable 2FA for admin accounts</span>
            </div>
          </div>
        </div>
      );

      case "Invoice Settings": return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div className="field"><label>Invoice Prefix</label><input value={invoice.prefix} onChange={e => setInvoice({ ...invoice, prefix: e.target.value })} /></div>
          <div className="field"><label>Next Invoice Number</label><input type="number" value={invoice.nextNumber} onChange={e => setInvoice({ ...invoice, nextNumber: +e.target.value })} /></div>
          <div className="field" style={{ gridColumn: "1/-1" }}><label>Default Terms</label><textarea value={invoice.termsLine1} onChange={e => setInvoice({ ...invoice, termsLine1: e.target.value })} rows={3} /></div>
          <div className="field">
            <label>Show QR Code</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <input type="checkbox" checked={invoice.showQR} onChange={e => setInvoice({ ...invoice, showQR: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--gold)", cursor: "pointer" }} />
              <span style={{ fontSize: 13 }}>Include QR code on invoices</span>
            </div>
          </div>
          <div className="field">
            <label>Show Signature</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <input type="checkbox" checked={invoice.showSignature} onChange={e => setInvoice({ ...invoice, showSignature: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--gold)", cursor: "pointer" }} />
              <span style={{ fontSize: 13 }}>Include authorized signature</span>
            </div>
          </div>
        </div>
      );

      case "Maintenance Mode": return (
        <div>
          <div style={{ background: maintenance ? "rgba(239,68,68,.08)" : "rgba(34,197,94,.08)", border: `1px solid ${maintenance ? "rgba(239,68,68,.3)" : "rgba(34,197,94,.3)"}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <i className={`fa-solid ${maintenance ? "fa-triangle-exclamation" : "fa-circle-check"}`} style={{ fontSize: 24, color: maintenance ? "var(--danger)" : "var(--success)" }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{maintenance ? "Maintenance Mode: ON" : "Store is Live"}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{maintenance ? "The store is currently offline for visitors." : "Your store is online and accepting orders."}</div>
              </div>
            </div>
          </div>
          <button className={`btn ${maintenance ? "btn-gold" : "btn-danger"}`} onClick={() => setMaintenance(!maintenance)}>
            <i className={`fa-solid ${maintenance ? "fa-power-off" : "fa-wrench"}`} />
            {maintenance ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
          </button>
        </div>
      );

      case "System Information": return (
        <div className="table-wrap">
          <table>
            <tbody>
              {[
                ["Application", "Venus Silver Jewellery Admin Panel"],
                ["Version", "1.0.0"],
                ["Framework", "Next.js 15 (App Router)"],
                ["Language", "TypeScript"],
                ["UI Library", "Tailwind CSS + ShadCN"],
                ["Node Version", "18.x"],
                ["Environment", "Production"],
                ["Database", "PostgreSQL (Configured)"],
                ["Server", "Vercel / Node.js"],
                ["Last Updated", new Date().toLocaleDateString("en-IN")],
              ].map(([k, v]) => (
                <tr key={k}><td style={{ color: "var(--muted)", width: 200 }}>{k}</td><td style={{ fontWeight: 500 }}>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      default: return (
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          <i className="fa-solid fa-gear" style={{ fontSize: 40, display: "block", marginBottom: 12, opacity: 0.3 }} />
          {active} settings coming soon
        </div>
      );
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div><h1 className="font-playfair" style={{ fontSize: 26 }}>Settings</h1><div style={{ color: "var(--muted)", fontSize: 13 }}>Manage store configuration</div></div>
        {active !== "System Information" && active !== "Maintenance Mode" && (
          <button className="btn btn-gold" onClick={save}>{saved ? <><i className="fa-solid fa-check" /> Saved!</> : <><i className="fa-solid fa-save" /> Save Changes</>}</button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>
        <div className="panel-bg" style={{ padding: 12 }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActive(s)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, background: active === s ? "rgba(212,175,55,.15)" : "none", border: active === s ? "1px solid rgba(212,175,55,.3)" : "1px solid transparent", color: active === s ? "var(--gold)" : "var(--muted)", cursor: "pointer", fontSize: 13, textAlign: "left", marginBottom: 2, transition: "all 0.15s" }}>
              {s}
            </button>
          ))}
        </div>

        <div className="panel-bg" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>{active}</h3>
          {renderSection()}
        </div>
      </div>
    </AdminLayout>
  );
}
