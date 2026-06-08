"use client";

import React from "react";
import type { CustomDesignRequest, CustomDesignStatus } from "@/lib/custom-designs";
import { CUSTOM_DESIGN_STATUSES } from "@/lib/custom-designs";

export default function StatusTimeline({ request }: { request: Pick<CustomDesignRequest, "timeline" | "status"> }) {
  const timelineByStatus = new Map<CustomDesignStatus, { at: string; by: string; note?: string }>();
  for (const ev of request.timeline) {
    timelineByStatus.set(ev.status, { at: ev.at, by: ev.by, note: ev.note });
  }

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10 }}>
        {CUSTOM_DESIGN_STATUSES.map((s) => {
          const ev = timelineByStatus.get(s.value);
          const isDone = CUSTOM_DESIGN_STATUSES.findIndex(x => x.value === request.status) >= CUSTOM_DESIGN_STATUSES.findIndex(x => x.value === s.value);
          const active = request.status === s.value;

          return (
            <div key={s.value} style={{
              padding: 12,
              borderRadius: 14,
              border: `1px solid ${active ? "rgba(212,175,55,.45)" : "var(--line)"}`,
              background: active ? "rgba(212,175,55,.08)" : isDone ? "rgba(34,197,94,.06)" : "transparent",
              minWidth: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontSize: 12, color: active ? "var(--gold)" : "var(--muted)", fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.label}
                </div>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: 99,
                  background: active ? "var(--gold)" : isDone ? "#22c55e" : "rgba(255,255,255,.12)",
                  boxShadow: isDone ? "0 0 0 4px rgba(34,197,94,.08)" : "none",
                  flexShrink: 0,
                }} />
              </div>
              {ev ? (
                <div style={{ marginTop: 8 }}>
                  <div style={{ color: "var(--text)", fontSize: 12, fontWeight: 700 }}>
                    {new Date(ev.at).toLocaleDateString("en-IN")}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {ev.by}
                  </div>
                </div>
              ) : (
                <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 8 }}>Not yet</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 12 }}>
        Timeline is shown based on current request status and history (mock).
      </div>
    </div>
  );
}

