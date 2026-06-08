"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";

const PAGES = [
  { id: "about", label: "About Us", icon: "fa-building" },
  { id: "contact", label: "Contact Information", icon: "fa-address-card" },
  { id: "terms", label: "Terms & Conditions", icon: "fa-file-contract" },
  { id: "privacy", label: "Privacy Policy", icon: "fa-shield" },
  { id: "refund", label: "Return Policy", icon: "fa-rotate-left" },
  { id: "shipping", label: "Shipping Policy", icon: "fa-truck-fast" },
  { id: "faq", label: "FAQ", icon: "fa-circle-question" },
  { id: "homepage", label: "Homepage Content", icon: "fa-home" },
];


const DEFAULT_CONTENT: Record<string, string> = {
  about: `Venus Silver Jewellery was founded with a passion for crafting exquisite silver jewellery that celebrates tradition while embracing contemporary design. Located in the heart of Madurai, we bring you the finest quality silver jewellery — from traditional temple designs to modern minimalist pieces.

Our craftsmen, with decades of experience, handcraft each piece with precision and care. We use only 925 and 999 purity silver, all BIS Hallmarked for your assurance.

At Venus Silver, we believe jewellery is not just an accessory — it's a story, a memory, a legacy.`,
  contact: `Venus Silver Jewellery
59E, Ramalinga Nagar, Anaiyar,
Madurai – 625017, Tamil Nadu

Phone: +91 7338834666
Email: admin@venussilver.in | Venus999silver@gmail.com

Store Hours:
Monday – Saturday: 9:00 AM – 8:00 PM
Sunday: 10:00 AM – 6:00 PM

For bulk orders and custom designs, please call or email us.`,
  terms: `1. All products are sold subject to availability.
2. Prices are inclusive of applicable taxes.
3. All jewellery is BIS Hallmarked unless stated otherwise.
4. Custom orders once placed cannot be cancelled.
5. Venus Silver reserves the right to modify these terms at any time.`,
  privacy: `We at Venus Silver Jewellery respect your privacy. Personal information collected is used only for order processing and customer communication. We do not sell or share your data with third parties. All transactions are encrypted and secure.`,
  refund: `Returns: Accepted within 7 days of delivery for manufacturing defects.
Exchange: Available within 30 days for unused items with original packaging.
Refund: Processed within 7-10 business days to the original payment method.
Custom orders: Non-refundable once production begins.`,
  faq: `Q: What is the purity of your silver?
A: We use 925 Sterling Silver and 999 Pure Silver, all BIS Hallmarked.

Q: Do you offer custom designs?
A: Yes! Contact us for custom jewellery orders.

Q: How long does delivery take?
A: 3-7 business days for standard orders, 2-4 weeks for custom.

Q: Do you buy old silver?
A: Yes, we offer exchange for old silver jewellery.`,
  homepage: `Welcome to Venus Silver Jewellery — Madurai's premier destination for premium silver jewellery. Explore our exquisite collections of temple jewellery, bridal sets, daily wear, and investment coins.`,
};

export default function CMSPage() {
  const [activePage, setActivePage] = useState("about");
  const [contents, setContents] = useState({ ...DEFAULT_CONTENT });
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const handleSave = (id: string) => {
    setSaved({ ...saved, [id]: true });
    setTimeout(() => setSaved(s => ({ ...s, [id]: false })), 2000);
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 className="font-playfair" style={{ fontSize: 26 }}>CMS Management</h1>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>Manage website content pages</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>
        {/* Page List */}
        <div className="panel-bg" style={{ padding: 12 }}>
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => {
                if (p.id === "shipping") {
                  window.location.href = "/cms/shipping-policy";
                  return;
                }
                setActivePage(p.id);
              }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: activePage === p.id ? "rgba(212,175,55,.15)" : "none", border: activePage === p.id ? "1px solid rgba(212,175,55,.3)" : "1px solid transparent", color: activePage === p.id ? "var(--gold)" : "var(--muted)", cursor: "pointer", fontSize: 13, textAlign: "left", marginBottom: 4, transition: "all 0.15s" }}>
              <i className={`fa-solid ${p.icon}`} style={{ width: 16 }} />
              {p.label}
            </button>
          ))}

        </div>

        {/* Editor */}
        <div className="panel-bg" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 16 }}>{PAGES.find(p => p.id === activePage)?.label}</h3>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Edit and publish page content</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-eye" /> Preview</button>
              <button className="btn btn-gold btn-sm" onClick={() => handleSave(activePage)}>
                {saved[activePage] ? <><i className="fa-solid fa-check" /> Saved!</> : <><i className="fa-solid fa-cloud-upload-alt" /> Publish</>}
              </button>
            </div>
          </div>

          {/* Rich text toolbar */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, padding: "8px 12px", background: "#0e0e12", borderRadius: "8px 8px 0 0", border: "1px solid var(--line)", borderBottom: "none" }}>
            {[["fa-bold", "Bold"], ["fa-italic", "Italic"], ["fa-underline", "Underline"], ["fa-list-ul", "List"], ["fa-list-ol", "Ordered"], ["fa-quote-left", "Quote"], ["fa-link", "Link"]].map(([icon, label]) => (
              <button key={icon} title={label} style={{ padding: "4px 8px", background: "none", border: "1px solid var(--line)", borderRadius: 6, color: "var(--muted)", cursor: "pointer", fontSize: 12 }}>
                <i className={`fa-solid ${icon}`} />
              </button>
            ))}
          </div>

          <textarea
            value={contents[activePage] || ""}
            onChange={e => setContents({ ...contents, [activePage]: e.target.value })}
            rows={18}
            style={{ width: "100%", background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", padding: 16, fontSize: 14, outline: "none", lineHeight: 1.8, borderRadius: "0 0 8px 8px", fontFamily: "inherit", resize: "vertical" }}
          />

          <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
            {contents[activePage]?.length || 0} characters · Last updated: Today
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
