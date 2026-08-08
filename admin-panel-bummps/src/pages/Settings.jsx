import { useState } from "react";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineCog, HiOutlineShieldCheck, HiOutlineColorSwatch, HiOutlineGlobe, HiOutlineLogout } from "react-icons/hi";
import { PageHeader, Tabs } from "../components/ui/Controls";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { useNavigate } from "react-router-dom";

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">{label}</label>
      <input {...props} className="w-full rounded-xl border border-gold/[0.16] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-gold/50 transition-colors" />
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-white">{label}</p>
        {description && <p className="text-xs text-ink-faint mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-gold-gradient" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useUI();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Profile");
  const [twoFA, setTwoFA] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);

  return (
    <div>
      <PageHeader eyebrow="System" title="Settings" description="Manage your admin profile, security, and platform preferences." />

      <Tabs tabs={["Profile", "Security", "General", "Theme & Language"]} active={tab} onChange={setTab} />

      {tab === "Profile" && (
        <GlassCard className="p-6 sm:p-7 max-w-2xl" delay={0.1}>
          <div className="flex items-center gap-5 mb-7 pb-7 border-b border-white/5">
            <img src={admin?.avatar} className="h-20 w-20 rounded-full object-cover ring-4 ring-gold/20" />
            <div>
              <h3 className="font-display text-lg font-bold text-white">{admin?.name}</h3>
              <p className="text-xs text-ink-faint">{admin?.role}</p>
              <Button variant="outline" size="sm" className="mt-3">Change Photo</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name" defaultValue={admin?.name} />
            <Field label="Email Address" defaultValue={admin?.email} />
            <Field label="Phone Number" defaultValue="+1 555-0142" />
            <Field label="Role" defaultValue={admin?.role} disabled />
          </div>
          <Button variant="primary" className="mt-6">Save Changes</Button>
        </GlassCard>
      )}

      {tab === "Security" && (
        <GlassCard className="p-6 sm:p-7 max-w-2xl" delay={0.1}>
          <h3 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2"><HiOutlineLockClosed className="text-gold" /> Change Password</h3>
          <div className="space-y-4 mb-7 pb-7 border-b border-white/5">
            <Field label="Current Password" type="password" placeholder="••••••••" />
            <Field label="New Password" type="password" placeholder="••••••••" />
            <Field label="Confirm New Password" type="password" placeholder="••••••••" />
            <Button variant="primary">Update Password</Button>
          </div>
          <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2"><HiOutlineShieldCheck className="text-gold" /> Security Preferences</h3>
          <Toggle label="Two-Factor Authentication" description="Add an extra layer of security to your account" checked={twoFA} onChange={setTwoFA} />
          <Toggle label="Email Login Alerts" description="Get notified when a new device signs in" checked={emailAlerts} onChange={setEmailAlerts} />
        </GlassCard>
      )}

      {tab === "General" && (
        <GlassCard className="p-6 sm:p-7 max-w-2xl" delay={0.1}>
          <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2"><HiOutlineCog className="text-gold" /> General Settings</h3>
          <Toggle label="Auto-approve verified users" description="Skip manual review for users with matching ID data" checked={autoApprove} onChange={setAutoApprove} />
          <Toggle label="Maintenance Mode" description="Temporarily disable public access to BUMMPS" checked={false} onChange={() => {}} />
          <Toggle label="Allow new registrations" description="Let new users sign up for the platform" checked={true} onChange={() => {}} />
        </GlassCard>
      )}

      {tab === "Theme & Language" && (
        <GlassCard className="p-6 sm:p-7 max-w-2xl" delay={0.1}>
          <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2"><HiOutlineColorSwatch className="text-gold" /> Appearance</h3>
          <Toggle label="Dark Mode" description="Luxury charcoal theme (recommended)" checked={theme === "dark"} onChange={toggleTheme} />
          <div className="my-6 border-t border-white/5" />
          <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2"><HiOutlineGlobe className="text-gold" /> Language & Region</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">Language</label>
              <select className="w-full rounded-xl border border-gold/[0.16] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-gold/50">
                <option>English (US)</option>
                <option>Français</option>
                <option>العربية</option>
                <option>Deutsch</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">Time Zone</label>
              <select className="w-full rounded-xl border border-gold/[0.16] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-gold/50">
                <option>GMT+5:30 (IST)</option>
                <option>GMT+0 (UTC)</option>
                <option>GMT-5 (EST)</option>
              </select>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="mt-7">
        <Button variant="danger" icon={HiOutlineLogout} onClick={() => { logout(); navigate("/login"); }}>Log Out</Button>
      </div>
    </div>
  );
}
