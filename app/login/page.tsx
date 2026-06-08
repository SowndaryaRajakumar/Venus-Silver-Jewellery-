"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    if ((email === "admin@venussilver.in" || email === "admin") && password === "admin123") {
      localStorage.setItem("vs_auth", JSON.stringify({ user: "admin", email: "admin@venussilver.in", ts: Date.now() }));
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Try admin@venussilver.in / admin123");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "grid", placeItems: "center",
      background: `radial-gradient(1200px 600px at 20% 10%, rgba(212,175,55,.15), transparent 60%),
        radial-gradient(1000px 600px at 80% 90%, rgba(212,175,55,.1), transparent 60%),
        #0b0b0d`
    }}>
      {/* Animated background particles */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 2, height: 2,
            background: "var(--gold)",
            borderRadius: "50%",
            left: `${15 + i * 15}%`,
            top: `${20 + i * 10}%`,
            opacity: 0.3,
            animation: `pulse ${2 + i * 0.5}s infinite alternate`,
          }} />
        ))}
      </div>

      <style>{`@keyframes pulse { from { opacity: 0.1; transform: scale(1); } to { opacity: 0.6; transform: scale(3); } }`}</style>

      <div style={{ width: "min(420px, 92vw)", background: "linear-gradient(160deg,#16161c,#0e0e12)", border: "1px solid var(--line)", borderRadius: 20, padding: "36px 28px", boxShadow: "var(--shadow)", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, overflow: "hidden", display: "inline-block" }}>
            <Image
              src="/assets/logo/logo.jpeg"
              alt="Venus Silver"
              width={72}
              height={72}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>


        <h1 className="font-playfair" style={{ fontSize: 26, textAlign: "center", letterSpacing: 1, background: "linear-gradient(180deg,#f4d57a,#d4af37)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 4 }}>
          VENUS SILVER
        </h1>
        <div style={{ textAlign: "center", color: "var(--muted)", marginBottom: 28, fontSize: 13, letterSpacing: 2 }}>JEWELLERY ADMIN CONSOLE</div>

        {!forgot ? (
          <form onSubmit={handleLogin}>
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Email Address</label>
              <div style={{ position: "relative" }}>
                <i className="fa-solid fa-envelope" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 13 }} />
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@venussilver.in" style={{ paddingLeft: 36 }} />
              </div>
            </div>
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <i className="fa-solid fa-lock" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 13 }} />
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: 36, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>
                  <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, fontSize: 13 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--muted)" }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" onClick={() => setForgot(true)} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: 13 }}>Forgot Password?</button>
            </div>
            <button type="submit" className="btn btn-gold btn-block" disabled={loading} style={{ width: "100%", padding: "12px 16px", fontSize: 15 }}>
              {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Signing In...</> : <><i className="fa-solid fa-arrow-right-to-bracket" /> Sign In</>}
            </button>
            {error && <div style={{ color: "var(--danger)", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</div>}
          </form>
        ) : (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div className="field">
                <label>Email Address</label>
                <input type="email" placeholder="admin@venussilver.in" />
              </div>
            </div>
            <button className="btn btn-gold" style={{ width: "100%", padding: "12px 16px" }} onClick={() => { setForgot(false); setError("Password reset link sent to your email."); }}>
              <i className="fa-solid fa-paper-plane" /> Send Reset Link
            </button>
            <button onClick={() => setForgot(false)} style={{ width: "100%", marginTop: 12, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>
              ← Back to Login
            </button>
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "var(--muted)" }}>
          Demo — <span style={{ color: "var(--gold)" }}>admin@venussilver.in</span> / <span style={{ color: "var(--gold)" }}>admin123</span>
        </div>

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "#3a3a44" }}>
          Venus Silver Jewellery · 59E, Ramalinga Nagar, Madurai – 625017
        </div>
      </div>
    </div>
  );
}
