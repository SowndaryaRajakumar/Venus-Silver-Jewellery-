"use client";

import { useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";

type PageStatus = "Draft" | "Published";

type VersionSnapshot = {
  id: string;
  at: string;
  by: string;
  status: PageStatus;
  html: string;
};

const initialHtml = `
<h2>Shipping Policy</h2>
<p>
At Venus Silver, we strive to deliver your jewellery safely and on time.
This Shipping Policy outlines our shipping coverage, delivery timelines, charges,
tracking information, international shipping, and customer support.
</p>

<h3>Shipping Coverage</h3>
<p>We ship across India and selected international destinations.</p>

<h3>Delivery Timelines</h3>
<ul>
  <li>Standard Orders: 3–7 business days</li>
  <li>Custom Orders: 2–4 weeks (varies by design approvals)</li>
</ul>
`;

function toolbarButton(icon: string, label: string) {
  return (
    <button
      key={icon}
      type="button"
      title={label}
      style={{
        padding: "4px 8px",
        background: "none",
        border: "1px solid var(--line)",
        borderRadius: 6,
        color: "var(--muted)",
        cursor: "pointer",
        fontSize: 12,
      }}
      onClick={() => {
        // mock: no real editor command; keep UI consistent with existing CMS
      }}
    >
      <i className={`fa-solid ${icon}`} />
    </button>
  );
}

export default function ShippingPolicyPage() {
  const [pageStatus, setPageStatus] = useState<PageStatus>("Draft");
  const [metaTitle, setMetaTitle] = useState("Shipping Policy | Venus Silver");
  const [metaDescription, setMetaDescription] = useState(
    "Read our shipping policy including delivery timelines, charges, tracking, international shipping and support."
  );
  // Static mock values to prevent hydration mismatch (date/time must not be server-rendered dynamically)
  const [publishDate, setPublishDate] = useState("06 Jun 2026");

  const [lastUpdatedAt, setLastUpdatedAt] = useState("06 Jun 2026");
  const [html, setHtml] = useState(initialHtml);

  const [versions, setVersions] = useState<VersionSnapshot[]>(() => [
    {
      id: "v1",
      at: "06 Jun 2026",
      by: "Admin",
      status: "Published",
      html: initialHtml,
    },
  ]);

  const [activePreview, setActivePreview] = useState(false);

  const previewDoc = useMemo(() => {
    // For mock, render raw html via dangerouslySetInnerHTML
    return html;
  }, [html]);

  const pushVersion = (nextStatus: PageStatus) => {
    const snapshot: VersionSnapshot = {
      id: `v${versions.length + 1}`,
      at: "06 Jun 2026",
      by: "Admin",
      status: nextStatus,
      html,
    };
    setVersions((prev) => [snapshot, ...prev]);
  };

  const handleSaveDraft = () => {
    setPageStatus("Draft");
    setLastUpdatedAt("06 Jun 2026");
    pushVersion("Draft");
  };

  const handlePublish = () => {
    setPageStatus("Published");
    setPublishDate("06 Jun 2026");
    setLastUpdatedAt("06 Jun 2026");
    pushVersion("Published");
  };

  const handlePreview = () => setActivePreview((p) => !p);

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 className="font-playfair" style={{ fontSize: 26 }}>
          Shipping Policy
        </h1>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
          Edit, draft, publish, preview, and review version history
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        <div className="panel-bg" style={{ padding: 20 }}>
          {/* Header controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 900, color: "var(--gold)" }}>CMS Editor</div>
                <div className={`badge ${pageStatus === "Published" ? "b-success" : "b-pending"}`}>
                  {pageStatus}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                Last Updated: {lastUpdatedAt}

              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-ghost btn-sm" onClick={handlePreview} type="button">
                <i className="fa-solid fa-eye" /> {activePreview ? "Hide" : "Preview"}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleSaveDraft} type="button">
                <i className="fa-solid fa-file-arrow-down" /> Save Draft
              </button>
              <button className="btn btn-gold btn-sm" onClick={handlePublish} type="button">
                <i className="fa-solid fa-globe" /> Publish
              </button>
            </div>
          </div>

          {/* Rich editor toolbar UI (mock) */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 12,
              padding: "8px 12px",
              background: "#0e0e12",
              borderRadius: "8px 8px 0 0",
              border: "1px solid var(--line)",
              borderBottom: "none",
            }}
          >
            {toolbarButton("fa-bold", "Bold")}
            {toolbarButton("fa-italic", "Italic")}
            {toolbarButton("fa-underline", "Underline")}
            {toolbarButton("fa-list-ul", "List")}
            {toolbarButton("fa-quote-left", "Quote")}
            {toolbarButton("fa-link", "Link")}
          </div>

          {!activePreview ? (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={18}
              style={{
                width: "100%",
                background: "#0e0e12",
                border: "1px solid var(--line)",
                color: "var(--text)",
                padding: 16,
                fontSize: 13,
                outline: "none",
                lineHeight: 1.8,
                borderRadius: "0 0 8px 8px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          ) : (
            <div
              style={{
                border: "1px solid var(--line)",
                borderTop: "none",
                background: "#0e0e12",
                borderRadius: "0 0 8px 8px",
                padding: 16,
              }}
            >
              <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 12 }}>
                Preview rendering (mock)
              </div>
              <div
                style={{ color: "var(--text)", lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: previewDoc }}
              />
            </div>
          )}

          <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
            {html.length} characters
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div className="panel-bg" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>CMS Settings</h3>

            <div className="field">
              <label>SEO Meta Title</label>
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label>SEO Meta Description</label>
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} />
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label>Page Status</label>
              <select value={pageStatus} onChange={(e) => setPageStatus(e.target.value as PageStatus)}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label>Publish Date</label>
              <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
            </div>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/cms" className="btn btn-ghost btn-sm" style={{ textAlign: "center" }}>
                Back to CMS
              </Link>
            </div>
          </div>

          <div className="panel-bg" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Version History</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {versions.map((v) => (
                <div
                  key={v.id}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    padding: 12,
                    background: "#0e0e12",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 900 }}>{v.status}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>
                      {v.at}

                    </div>
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>
                    By: {v.by} • {v.id}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ width: "100%", marginTop: 10 }}
                    onClick={() => {
                      setHtml(v.html);
                      setPageStatus(v.status);
                      setLastUpdatedAt(v.at);
                    }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

