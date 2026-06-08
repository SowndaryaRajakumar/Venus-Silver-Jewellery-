"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";


const NAV = [
  { href: "/dashboard", icon: "fa-gauge-high", label: "Dashboard" },
  { sep: "Catalogue" },
  { href: "/products", icon: "fa-gem", label: "Products" },
  { href: "/categories", icon: "fa-layer-group", label: "Categories" },
  { href: "/subcategories", icon: "fa-sitemap", label: "Sub Categories" },
  { sep: "Sales" },
  { href: "/orders", icon: "fa-bag-shopping", label: "Orders" },
  { href: "/customers", icon: "fa-users", label: "Customers" },
  { href: "/wishlist", icon: "fa-heart", label: "Wishlist" },
  { href: "/reviews", icon: "fa-star", label: "Reviews" },
  { sep: "Store" },
  { href: "/metal-rates", icon: "fa-coins", label: "Metal Rates" },
  { href: "/hero-banners", icon: "fa-image", label: "Hero Banners" },
  { href: "/newsletter", icon: "fa-envelope", label: "Newsletter" },
  { href: "/coupons", icon: "fa-ticket", label: "Coupons" },
  { sep: "Analytics" },
  { href: "/reports", icon: "fa-chart-bar", label: "Reports" },
  { href: "/invoice-center", icon: "fa-file-invoice", label: "Invoice Center" },
  { sep: "Admin" },
  { href: "/cms", icon: "fa-file-lines", label: "CMS Management" },
  { sep: "Operations" },
  { href: "/custom-designs", icon: "fa-ruler-combined", label: "Custom Designs" },
  { href: "/enquiries", icon: "fa-message", label: "Enquiries" },
  { href: "/user-roles", icon: "fa-shield", label: "User Roles" },
  { href: "/settings", icon: "fa-gear", label: "Settings" },
  { href: "/audit-logs", icon: "fa-clock-rotate-left", label: "Audit Logs" },
  { sep: "Account" },
  { href: "/profile", icon: "fa-circle-user", label: "Profile" },
];

export default function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("vs_auth");
    router.push("/login");
  };

  return (
    <aside
      style={{
        background:
          "linear-gradient(180deg, rgba(8,17,31,.65), rgba(5,8,15,.35))",
        borderRight: "1px solid var(--border)",
        padding: "22px 14px",
        height: "100vh",
        overflowY: "auto",
        width: mobile ? "100%" : "280px",
        position: mobile ? "relative" : "sticky",
        top: 0,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 10px 18px",
          borderBottom: "1px solid rgba(212,175,55,0.18)",
          marginBottom: 16,
        }}
      >
        <BrandLogo size={40} subtitle={true} label={true} />

        {mobile && (
          <button
            onClick={onClose}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--muted)", fontSize: 18, cursor: "pointer" }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>


      <nav>
        {NAV.map((item, i) => {
          if ("sep" in item) return (
            <div
              key={i}
              style={{
                color: "rgba(165,180,199,0.95)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 2.2,
                padding: "18px 10px 8px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 1,
                  background: "rgba(212,175,55,0.35)",
                  boxShadow: "0 0 20px rgba(212,175,55,0.15)",
                }}
              />
              {item.sep}
            </div>
          );

          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href!));
          return (
            <Link key={item.href} href={item.href!} className={`sidebar-link ${active ? "active" : ""}`} onClick={onClose}>
              <i className={`fa-solid ${item.icon}`} style={{ width: 18, textAlign: "center" }} />
              {item.label}
            </Link>
          );
        })}
        <button className="sidebar-link" onClick={handleLogout} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "var(--danger)" }}>
          <i className="fa-solid fa-right-from-bracket" style={{ width: 18, textAlign: "center" }} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
