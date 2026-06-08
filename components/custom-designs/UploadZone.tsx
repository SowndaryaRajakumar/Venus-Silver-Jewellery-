"use client";

import React, { useRef, useState } from "react";
import type { UploadItem, CustomDesignFileType } from "@/lib/custom-designs";

const SUPPORTED_MIMES: Partial<Record<CustomDesignFileType, string[]>> = {};

const ACCEPT: string[] = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

function getFileSizeLabel(bytes: number) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function validateFile(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  const maxBytes = 8 * 1024 * 1024; // 8MB
  const okType = allowedTypes.includes(file.type);
  const okSize = file.size <= maxBytes;
  return {
    ok: okType && okSize,
    okType,
    okSize,
    maxBytes,
  };
}

export default function UploadZone({
  title,
  kind,
  limit,
  onAdd,
  onRemove,
  items,
}: {
  title: string;
  kind: CustomDesignFileType;
  limit: number;
  items: UploadItem[];
  onAdd: (newItems: UploadItem[]) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const openPicker = () => inputRef.current?.click();

  const pushError = (msg: string) => {
    setLocalError(msg);
    window.setTimeout(() => setLocalError(null), 2500);
  };

  const addFiles = (files: File[]) => {
    setLocalError(null);

    const remaining = Math.max(0, limit - items.length);
    if (remaining === 0) {
      pushError(`Upload limit reached (${limit}).`);
      return;
    }

    const sliced = files.slice(0, remaining);
    const mapped: UploadItem[] = [];

    for (const f of sliced) {
      const v = validateFile(f);
      if (!v.ok) {
        const why = !v.okType
          ? `Unsupported type. Allowed: JPG/JPEG/PNG/WEBP/PDF.`
          : `File too large (max ${getFileSizeLabel(v.maxBytes)}).`;
        pushError(`${f.name}: ${why}`);
        continue;
      }

      const url = URL.createObjectURL(f);
      mapped.push({
        id: `${kind}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        kind,
        name: f.name,
        url,
        sizeBytes: f.size,
        mimeType: f.type,
      });
    }

    if (mapped.length) onAdd(mapped);
  };

  return (
    <div>
      <div
        onClick={openPicker}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const files = Array.from(e.dataTransfer.files || []);
          if (files.length) addFiles(files);
        }}
        style={{
          border: `1px dashed ${dragOver ? "rgba(212,175,55,.7)" : "var(--line)"}`,
          borderRadius: 12,
          padding: 14,
          textAlign: "center",
          color: "var(--muted)",
          fontSize: 13,
          cursor: "pointer",
          background: dragOver ? "rgba(212,175,55,.08)" : "transparent",
        }}
      >
        <i className="fa-solid fa-cloud-upload-alt" style={{ fontSize: 24, marginBottom: 8, display: "block", color: "var(--gold)" }} />
        {title}
        <div style={{ marginTop: 6, fontSize: 12 }}>
          Drag & drop or click. Allowed: JPG/JPEG/PNG/WEBP/PDF • Max 8MB each • Limit {limit}
        </div>
      </div>

      {localError && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#ef4444", fontWeight: 700 }}>{localError}</div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(",")}
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) addFiles(files);
          // reset so selecting same file again triggers change
          e.currentTarget.value = "";
        }}
      />

      {items.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ color: "var(--muted)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Selected uploads
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#0e0e12",
                }}
              >
                <div style={{ height: 110, position: "relative" }}>
                  {it.mimeType === "application/pdf" ? (
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                      <i className="fa-solid fa-file-pdf" style={{ fontSize: 28, color: "#ef4444" }} />
                    </div>
                  ) : (
                    <img src={it.url} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onRemove(it.id);
                    }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      borderRadius: 10,
                      background: "rgba(0,0,0,.6)",
                      border: "1px solid var(--line)",
                      cursor: "pointer",
                      color: "#fff",
                      fontWeight: 900,
                    }}
                    aria-label="Remove upload"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {it.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{getFileSizeLabel(it.sizeBytes)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
        Preview and validation are client-side (mock upload URLs).
      </div>
    </div>
  );
}

