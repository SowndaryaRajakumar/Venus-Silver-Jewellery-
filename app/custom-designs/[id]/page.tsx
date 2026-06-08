"use client";

import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/custom-designs/StatusBadge";
import StatusTimeline from "@/components/custom-designs/StatusTimeline";
import UploadZone from "@/components/custom-designs/UploadZone";
import { CUSTOM_DESIGN_REQUESTS } from "@/lib/data";
import type { CustomDesignFileType, CustomDesignRequest, CustomDesignStatus } from "@/lib/custom-designs";
import { fmt, uid } from "@/lib/data";
import Link from "next/link";
import { useMemo, useState } from "react";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
      <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{value}</div>
    </div>
  );
}

function fileAcceptLabel(kind: CustomDesignFileType) {
  switch (kind) {
    case "reference":
      return "Reference Images";
    case "images":
      return "Multiple Images";
    case "sketches":
      return "Sketches";
    case "cad":
      return "CAD Images";
    case "pdf":
      return "PDF Files";
  }
}

export default function CustomDesignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id] = useState<string | null>(null);

  // This page is a client component; keep UI identical.
  // Params are treated as resolved elsewhere in this mock build.


  const request = useMemo(() => CUSTOM_DESIGN_REQUESTS.find((r) => r.id === id), [id]);
  const [localStatus, setLocalStatus] = useState<CustomDesignStatus | null>(request?.status ?? null);

  // mock internal notes and uploads are client-only
  const [internalNotes, setInternalNotes] = useState<string[]>(request?.internalNotes ?? []);

  const [newNote, setNewNote] = useState("");

  if (!request) {
    return (
      <AdminLayout>
        <div className="panel-bg" style={{ padding: 20 }}>
          <h1 className="font-playfair" style={{ fontSize: 26 }}>
            Custom Design not found
          </h1>
          <Link href="/custom-designs" className="btn btn-ghost" style={{ marginTop: 14 }}>
            Back to list
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const status = localStatus ?? request.status;
  const uploads = request.uploads;

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="font-playfair" style={{ fontSize: 26 }}>
              {request.requestId}
            </h1>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Request detail • Design status workflow</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <StatusBadge status={status} />
            <Link href="/custom-designs" className="btn btn-ghost btn-sm">
              <i className="fa-solid fa-arrow-left" /> Back
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, alignItems: "start" }}>
        <div>
          <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Customer Details</h3>
            <Field label="Customer Name" value={request.customerName} />
            <Field label="Mobile Number" value={request.mobileNumber} />
            <Field label="Email" value={request.email} />
            <Field label="Address" value={request.address} />
          </div>

          <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Design Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              <Field label="Design Title" value={request.designTitle} />
              <Field label="Design Category" value={request.designCategory} />
              <Field label="Jewellery Type" value={request.jewelleryType} />
              <Field label="Preferred Metal" value={request.preferredMetal} />
              <Field label="Purity" value={request.purity} />
              <Field label="Approx Weight (g)" value={request.approxWeight} />
              <Field label="Budget Range" value={request.budgetRange} />
              <Field label="Budget" value={fmt(request.budget)} />
              <div style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Design Description</div>
                <div style={{ marginTop: 6, fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{request.designDescription}</div>
              </div>
            </div>
          </div>

          <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Uploaded Images</h3>
            <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 10 }}>
              Showing current request uploads (mock)
            </div>
            {uploads.images.length === 0 && uploads.sketches.length === 0 && uploads.cad.length === 0 ? (
              <div style={{ color: "var(--muted)", fontSize: 13 }}>No images uploaded yet.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                {[...uploads.images, ...uploads.sketches, ...uploads.cad].map((u) => (
                  <div key={u.id} style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "#0e0e12" }}>
                    <div style={{ height: 130 }}>
                      <img src={u.url} alt={u.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Uploaded Files (PDF)</h3>
            {uploads.pdfs.length === 0 ? (
              <div style={{ color: "var(--muted)", fontSize: 13 }}>No PDF files uploaded.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {uploads.pdfs.map((f) => (
                  <div key={f.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 12, background: "#0e0e12" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <i className="fa-solid fa-file-pdf" style={{ fontSize: 22, color: "#ef4444" }} />
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 13 }}>{f.name}</div>
                        <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>{(f.sizeBytes / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Status Timeline</h3>
            <StatusTimeline request={request} />
          </div>

          <div className="panel-bg" style={{ padding: 18, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Internal Notes</h3>
            <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>Add notes and track designer comments (mock)</div>

            <div style={{ display: "grid", gap: 10 }}>
              {internalNotes.length === 0 ? (
                <div style={{ color: "var(--muted)", fontSize: 13 }}>No internal notes.</div>
              ) : (
                internalNotes.map((n, i) => (
                  <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 12, background: "#0e0e12" }}>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Note #{i + 1}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, marginTop: 6 }}>{n}</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add internal note"
                style={{ flex: 1, minWidth: 240, background: "#0e0e12", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px", color: "var(--text)" }}
              />
              <button
                className="btn btn-gold"
                onClick={() => {
                  const v = newNote.trim();
                  if (!v) return;
                  setInternalNotes((prev) => [v, ...prev]);
                  setNewNote("");
                }}
              >
                <i className="fa-solid fa-plus" /> Add
              </button>
            </div>
          </div>

          <div className="panel-bg" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Activity History</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {request.activityHistory.map((a) => (
                <div key={a.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 12, background: "#0e0e12" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 900 }}>{a.action}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>{a.at}</div>

                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>By: {a.by}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="panel-bg" style={{ padding: 18, marginBottom: 16, position: "sticky", top: 24 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Designer Controls</h3>

            <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
              Designer can upload drafts/CAD/final images and update status (mock)
            </div>

            <div className="field" style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Change Status</label>
              <select
                value={status}
                onChange={(e) => setLocalStatus(e.target.value as CustomDesignStatus)}
                style={{ width: "100%", marginTop: 6, background: "#0e0e12", border: "1px solid var(--line)", color: "var(--text)", borderRadius: 12, padding: "10px 12px" }}
              >
                {[
                  "Pending",
                  "Reviewing",
                  "Quotation Sent",
                  "Approved",
                  "Rejected",
                  "Production Started",
                  "Production Completed",
                  "Delivered",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: 14, marginTop: 10 }}>
              <div>
                <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{fileAcceptLabel("images")}</div>
                <UploadZone
                  title="Upload Multiple Images"
                  kind="images"
                  limit={6}
                  items={[]}
                  onAdd={() => {}}
                  onRemove={() => {}}
                />
              </div>

              <div>
                <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{fileAcceptLabel("cad")}</div>
                <UploadZone
                  title="Upload CAD Images"
                  kind="cad"
                  limit={6}
                  items={[]}
                  onAdd={() => {}}
                  onRemove={() => {}}
                />
              </div>

              <div>
                <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{fileAcceptLabel("pdf")}</div>
                <UploadZone
                  title="Upload PDF Files"
                  kind="pdf"
                  limit={3}
                  items={[]}
                  onAdd={() => {}}
                  onRemove={() => {}}
                />
              </div>
            </div>

            <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 12 }}>
              Note: Uploads and status changes are UI-only mock in this version.
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

