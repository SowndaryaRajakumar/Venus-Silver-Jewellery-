"use client";

import AdminLayout from "@/components/AdminLayout";
import StatusBadge from "@/components/custom-designs/StatusBadge";
import StatusTimeline from "@/components/custom-designs/StatusTimeline";
import { CUSTOM_DESIGN_REQUESTS } from "@/lib/data";
import type { CustomDesignStatus } from "@/lib/custom-designs";
import Link from "next/link";
import { useMemo, useState } from "react";

const FILTERS: { label: string; value: "ALL" | CustomDesignStatus }[] = [
  { label: "Pending", value: "Pending" },
  { label: "Reviewing", value: "Reviewing" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Production", value: "Production Started" },
  { label: "Delivered", value: "Delivered" },
];

function TableCell({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px 10px", borderBottom: "1px solid var(--line)" }}>{children}</td>;
}

export default function CustomDesignsListPage() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | CustomDesignStatus>("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CUSTOM_DESIGN_REQUESTS.filter((r) => {
      const statusOk = statusFilter === "ALL" ? true : r.status === statusFilter;

      const searchOk =
        !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.requestId.toLowerCase().includes(q) ||
        r.mobileNumber.includes(q);

      return statusOk && searchOk;
    });
  }, [search, statusFilter]);

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 className="font-playfair" style={{ fontSize: 26 }}>Custom Designs</h1>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
          Manage custom jewellery design requests
        </div>
      </div>

      <div className="panel-bg" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setStatusFilter("ALL")}
              style={{ borderColor: statusFilter === "ALL" ? "rgba(212,175,55,.55)" : undefined }}
            >
              All
            </button>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className="btn btn-ghost btn-sm"
                onClick={() => setStatusFilter(f.value)}
                style={{ borderColor: statusFilter === f.value ? "rgba(212,175,55,.55)" : undefined }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--line)", background: "#0e0e12", borderRadius: 12, padding: "8px 12px" }}>
              <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--muted)", fontSize: 13 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name, request ID, mobile"
                style={{ background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 13, width: 280 }}
              />
            </div>
            <Link href="/custom-designs/create" className="btn btn-gold btn-sm">
              <i className="fa-solid fa-plus" /> New Request
            </Link>
          </div>
        </div>
      </div>

      <div className="panel-bg" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Request ID</th>
                <th style={{ textAlign: "left" }}>Customer Name</th>
                <th style={{ textAlign: "left" }}>Mobile Number</th>
                <th style={{ textAlign: "left" }}>Design Type</th>
                <th style={{ textAlign: "left" }}>Budget</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Created Date</th>
                <th style={{ textAlign: "left" }}>Assigned Staff</th>
                <th style={{ textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <TableCell>
                    <Link href={`/custom-designs/${r.id}`} style={{ color: "var(--gold)", fontWeight: 800 }}>
                      {r.requestId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div style={{ fontWeight: 800 }}>{r.customerName}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{r.email}</div>
                  </TableCell>
                  <TableCell>{r.mobileNumber}</TableCell>
                  <TableCell>{r.designType}</TableCell>
                  <TableCell>
                    <div style={{ fontWeight: 900 }}>{r.budget.toLocaleString("en-IN")}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{r.budgetRange}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleDateString("en-IN")}</TableCell>
                  <TableCell>
                    <div style={{ fontWeight: 800 }}>{r.assignedStaff}</div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Link href={`/custom-designs/${r.id}`} className="btn btn-ghost btn-sm">
                        <i className="fa-solid fa-eye" /> View
                      </Link>
                    </div>
                  </TableCell>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 18, color: "var(--muted)", textAlign: "center" }}>
                    No custom design requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

