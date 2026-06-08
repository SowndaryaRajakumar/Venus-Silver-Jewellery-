"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@venussilver.in", phone: "7338834666", designation: "Super Admin", bio: "Managing Venus Silver Jewellery admin operations." });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPass, setSavedPass] = useState(false);
  const [passError, setPassError] = useState("");

  const saveProfile = () => { setSavedProfile(true); setTimeout(() => setSavedProfile(false), 2000); };
  const changePassword = () => {
    setPassError("");
    if (!passwords.current || !passwords.newPass || !passwords.confirm) { setPassError("All fields required."); return; }
    if (passwords.newPass !== passwords.confirm) { setPassError("New passwords do not match."); return; }
    if (passwords.newPass.length < 8) { setPassError("Password must be at least 8 characters."); return; }
    setSavedPass(true);
    setPasswords({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setSavedPass(false), 2000);
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 className="font-playfair" style={{ fontSize: 26 }}>My Profile</h1>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>Manage your account settings</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
        {/* Profile Card */}
        <div>
          <div className="panel-bg" style={{ padding: 24, marginBottom: 20, textAlign: "center" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#f4d57a,#b8860b)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 36, fontWeight: 900, color: "#1a1300", position: "relative" }}>
              A
              <button style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "var(--gold)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1a1300" }}>
                <i className="fa-solid fa-camera" style={{ fontSize: 11 }} />
              </button>
            </div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{profile.name}</div>
            <div style={{ color: "var(--gold)", fontSize: 13, marginTop: 4 }}>{profile.designation}</div>
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>{profile.email}</div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Last Login</div>
              <div style={{ fontSize: 13 }}>{new Date().toLocaleString("en-IN")}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Actions Today", "24", "var(--gold)"], ["This Month", "186", "var(--info)"], ["Sessions", "12", "var(--success)"], ["Role", "Super Admin", "var(--warn)"]].map(([l, v, c]) => (
              <div key={l} className="panel-bg" style={{ padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: String(c) }}>{v}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {/* Edit Profile */}
          <div className="panel-bg" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Edit Profile</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Full Name</label><input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
                <div className="field"><label>Designation</label><input value={profile.designation} onChange={e => setProfile({ ...profile, designation: e.target.value })} /></div>
              </div>
              <div className="field"><label>Email Address</label><input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></div>
              <div className="field"><label>Phone Number</label><input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></div>
              <div className="field"><label>Bio</label><textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={2} /></div>
            </div>
            <button className="btn btn-gold" style={{ marginTop: 16 }} onClick={saveProfile}>
              {savedProfile ? <><i className="fa-solid fa-check" /> Saved!</> : <><i className="fa-solid fa-save" /> Update Profile</>}
            </button>
          </div>

          {/* Change Password */}
          <div className="panel-bg" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Change Password</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <div className="field"><label>Current Password</label><input type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} /></div>
              <div className="field"><label>New Password</label><input type="password" value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} /></div>
              <div className="field"><label>Confirm New Password</label><input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} /></div>
            </div>
            {passError && <div style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{passError}</div>}
            <button className="btn btn-gold" style={{ marginTop: 16 }} onClick={changePassword}>
              {savedPass ? <><i className="fa-solid fa-check" /> Password Updated!</> : <><i className="fa-solid fa-lock" /> Change Password</>}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
