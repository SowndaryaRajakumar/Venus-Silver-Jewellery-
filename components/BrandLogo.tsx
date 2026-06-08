"use client";

import Image from "next/image";

export default function BrandLogo({
  size = 36,
  label = true,
  subtitle = true,
}: {
  size?: number;
  label?: boolean;
  subtitle?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 16,
          overflow: "hidden",
          flexShrink: 0,
          border: "1px solid rgba(212,175,55,.35)",
          background:
            "radial-gradient(circle at 30% 20%, rgba(244,197,66,.35), rgba(212,175,55,.08)), linear-gradient(135deg, rgba(244,213,122,.22), rgba(184,134,11,.10))",
          boxShadow:
            "0 0 0 1px rgba(212,175,55,.12), 0 0 30px rgba(212,175,55,.16)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Image
          src="/assets/logo/logo.jpeg"
          alt="Venus Silver"
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {label && (
        <div>
          <div
            className="font-playfair"
            style={{
              fontSize: size >= 40 ? 15 : 14,
              background: "linear-gradient(180deg,#f4d57a,#d4af37)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.2,
            }}
          >
            VENUS SILVER
          </div>
          {subtitle && (
            <div style={{ color: "var(--muted)", fontSize: 9, letterSpacing: 2 }}>
              JEWELLERY ADMIN
            </div>
          )}
        </div>
      )}
    </div>
  );
}

