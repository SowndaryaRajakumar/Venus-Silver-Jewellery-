"use client";

import React from "react";
import type { CustomDesignStatus } from "@/lib/custom-designs";

const STATUS_STYLE: Record<CustomDesignStatus, { bg: string; fg: string; border: string }> = {
  Pending: { bg: "rgba(245,158,11,.12)", fg: "#fbbf24", border: "rgba(245,158,11,.35)" },
  Reviewing: { bg: "rgba(96,165,250,.12)", fg: "#60a5fa", border: "rgba(96,165,250,.35)" },
  "Quotation Sent": { bg: "rgba(167,139,250,.12)", fg: "#a78bfa", border: "rgba(167,139,250,.35)" },
  Approved: { bg: "rgba(34,197,94,.12)", fg: "#22c55e", border: "rgba(34,197,94,.35)" },
  Rejected: { bg: "rgba(239,68,68,.12)", fg: "#ef4444", border: "rgba(239,68,68,.35)" },
  "Production Started": { bg: "rgba(20,184,166,.12)", fg: "#14b8a6", border: "rgba(20,184,166,.35)" },
  "Production Completed": { bg: "rgba(94,234,212,.12)", fg: "#5eead4", border: "rgba(94,234,212,.35)" },
  Delivered: { bg: "rgba(34,197,94,.12)", fg: "#22c55e", border: "rgba(34,197,94,.35)" },
};

export default function StatusBadge({ status }: { status: CustomDesignStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.fg,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          background: s.fg,
          boxShadow: `0 0 0 3px rgba(255,255,255,.03)`,
        }}
      />
      {status}
    </span>
  );
}

