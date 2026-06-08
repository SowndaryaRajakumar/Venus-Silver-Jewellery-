"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BrandLogo from "@/components/BrandLogo";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/subcategories": "Sub Categories",
  "/orders": "Orders",
  "/customers": "Customers",
  "/wishlist": "Wishlist",
  "/reviews": "Reviews",
  "/metal-rates": "Metal Rates",
  "/hero-banners": "Hero Banners",
  "/newsletter": "Newsletter Subscribers",
  "/coupons": "Coupons",
  "/reports": "Reports",
  "/invoice-center": "Invoice Center",
  "/cms": "CMS Management",
  "/cms/shipping-policy": "Shipping Policy",
  "/enquiries": "Enquiries",
  "/custom-designs": "Custom Designs",
  "/custom-designs/create": "Create Custom Design",
  "/user-roles": "User Roles & Permissions",
  "/settings": "Settings",

  "/audit-logs": "Audit Logs",
  "/profile": "Profile",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notif, setNotif] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("vs_auth");
    if (!auth) router.replace("/login");
  }, [router]);

  const title = TITLES[pathname] || "Admin";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ background: "rgba(0,0,0,0.7)", position: "absolute", inset: 0 }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 1, width: 260 }}>
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <header
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            background: "rgba(8,17,31,0.6)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(212,175,55,0.15)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="md:hidden" onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "var(--text)", fontSize: 20, cursor: "pointer" }}>
              <i className="fa-solid fa-bars" />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <BrandLogo size={32} label={false} subtitle={false} />
              <div>
                <div className="font-playfair" style={{ fontSize: 18 }}>{title}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Venus Silver Jewellery</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(16,28,51,0.35)",
                border: "1px solid rgba(212,175,55,0.25)",
                boxShadow: "0 0 0 1px rgba(212,175,55,0.07) inset",
                padding: "10px 14px",
                borderRadius: 14,
                width: 280,
                backdropFilter: "blur(10px)",
              }}
              className="hidden sm:flex"
            >
              <i
                className="fa-solid fa-magnifying-glass"
                style={{ color: "rgba(165,180,199,0.95)", fontSize: 13 }}
              />
              <input
                placeholder="Global search..."
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  width: "100%",
                }}
              />
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotif(!notif)}
                style={{
                  background: "rgba(16,28,51,0.25)",
                  border: "1px solid rgba(212,175,55,0.18)",
                  borderRadius: 14,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(165,180,199,0.95)",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,.22)",
                }}
              >
                <i className="fa-solid fa-bell" style={{ fontSize: 14 }} />
              </button>

              <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} />
              {notif && (
                <div style={{ position: "absolute", right: 0, top: 44, width: 280, background: "#16161c", border: "1px solid var(--line)", borderRadius: 12, padding: 14, zIndex: 100 }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, fontWeight: 600 }}>NOTIFICATIONS</div>
                  {[{ msg: "3 new orders received", time: "5 min ago" }, { msg: "Silver Chain is low stock", time: "1 hr ago" }, { msg: "New enquiry from Thamizharasi", time: "2 hr ago" }].map((n, i) => (
                    <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                      <div>{n.msg}</div>
                      <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 2 }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 30% 20%, rgba(244,197,66,.45), rgba(212,175,55,.10)), linear-gradient(135deg,rgba(244,197,66,.35),rgba(184,134,11,.25))",
                  display: "grid",
                  placeItems: "center",
                  color: "#1a1300",
                  fontWeight: 900,
                  fontSize: 14,
                  boxShadow: "0 0 0 1px rgba(212,175,55,.25), 0 0 26px rgba(212,175,55,.18)",
                  backdropFilter: "blur(10px)",
                }}
              >
                A
              </div>

              <div className="hidden sm:block">
                <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: 24, overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
