import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineLockClosed,
  HiOutlineCog,
  HiOutlineShieldCheck,
  HiOutlineColorSwatch,
  HiOutlineGlobe,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineDeviceMobile,
} from "react-icons/hi";
import { Tabs } from "../components/ui/Controls";
import Button from "../components/ui/Button";

const adminData = {
  name: "Admin User",
  email: "admin@bummps.com",
  phone: "+91 98765 43210",
  role: "Super Admin",
  avatar: "https://i.pravatar.cc/150?img=12",
};

const Field = ({ label, ...props }) => (
  <div>
    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
      {label}
    </label>
    <input
      {...props}
      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all placeholder:text-ink-faint focus:border-gold/50 focus:bg-gold/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between gap-5 border-b border-white/5 py-5 last:border-0">
    <div className="flex min-w-0 items-start gap-3">
      <div
        className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${
          checked
            ? "border-gold/20 bg-gold/[0.08] text-gold"
            : "border-white/10 bg-white/[0.03] text-ink-faint"
        }`}
      >
        <HiOutlineCheckCircle className="text-base" />
      </div>

      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && (
          <p className="mt-1 max-w-lg text-xs leading-relaxed text-ink-faint">
            {description}
          </p>
        )}
      </div>
    </div>

    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-all ${
        checked ? "bg-gold-gradient" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="mb-6 flex items-start gap-3">
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/20 bg-gold/[0.07] text-lg text-gold">
      <Icon />
    </div>

    <div>
      <h2 className="font-display text-lg font-bold text-white">{title}</h2>
      <p className="mt-1 text-xs text-ink-faint">{description}</p>
    </div>
  </div>
);

export default function Settings() {
  const [tab, setTab] = useState("Profile");
  const [profile, setProfile] = useState(adminData);
  const [twoFA, setTwoFA] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("GMT+5:30 (IST)");
  const [saved, setSaved] = useState(false);

  const updateProfile = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveChanges = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="px-4 pb-6 pt-0 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl sm:p-8"
        >
          <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-gold/[0.05] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  System Configuration
                </span>
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Administration
              </p>

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Settings
              </h1>

              <p className="mt-2 max-w-xl text-sm text-ink-muted">
                Manage your administrator profile, security controls and
                platform preferences.
              </p>
            </div>

            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-gold/20 bg-gold/[0.07] text-3xl text-gold">
              <HiOutlineCog />
            </div>
          </div>
        </motion.div>

        <div className="rounded-card border border-gold/[0.12] bg-card/60 p-2 shadow-soft backdrop-blur-xl">
          <Tabs
            tabs={["Profile", "Security", "General", "Theme & Language"]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {tab === "Profile" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.8fr_1.5fr]">
              <div className="rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl">
                <SectionHeader
                  icon={HiOutlineUser}
                  title="Administrator Profile"
                  description="Your account information"
                />

                <div className="flex flex-col items-center border-b border-white/5 pb-6 text-center">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-24 w-24 rounded-full object-cover ring-4 ring-gold/10"
                    />

                    <div className="absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-emerald-400 text-black">
                      <HiOutlineCheckCircle className="text-sm" />
                    </div>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {profile.name}
                  </h3>

                  <p className="mt-1 text-xs text-ink-faint">
                    {profile.email}
                  </p>

                  <span className="mt-3 rounded-full border border-gold/20 bg-gold/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                    {profile.role}
                  </span>

                  <Button variant="outline" size="sm" className="mt-5">
                    Change Photo
                  </Button>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                    <span className="text-xs text-ink-faint">Account Type</span>
                    <span className="text-xs font-semibold text-white">
                      Administrator
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                    <span className="text-xs text-ink-faint">
                      Account Status
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl">
                <SectionHeader
                  icon={HiOutlineUser}
                  title="Personal Information"
                  description="Update your basic administrator details"
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => updateProfile("name", e.target.value)}
                  />

                  <Field
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile("email", e.target.value)}
                  />

                  <Field
                    label="Phone Number"
                    value={profile.phone}
                    onChange={(e) => updateProfile("phone", e.target.value)}
                  />

                  <Field label="Role" value={profile.role} disabled />
                </div>

                {saved && (
                  <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-xs font-medium text-emerald-400">
                    <HiOutlineCheckCircle className="text-base" />
                    Profile changes saved successfully.
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button variant="primary" onClick={saveChanges}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === "Security" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl">
                <SectionHeader
                  icon={HiOutlineLockClosed}
                  title="Change Password"
                  description="Keep your administrator account secure"
                />

                <div className="space-y-5">
                  <Field
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                  />

                  <Field
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                  />

                  <Field
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                  />

                  <Button variant="primary" className="w-full">
                    Update Password
                  </Button>
                </div>
              </div>

              <div className="rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl">
                <SectionHeader
                  icon={HiOutlineShieldCheck}
                  title="Security Preferences"
                  description="Control account security notifications"
                />

                <Toggle
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  checked={twoFA}
                  onChange={setTwoFA}
                />

                <Toggle
                  label="Email Login Alerts"
                  description="Get notified when a new device signs in"
                  checked={emailAlerts}
                  onChange={setEmailAlerts}
                />

                <div className="mt-5 rounded-xl border border-gold/10 bg-gold/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <HiOutlineDeviceMobile className="text-xl text-gold" />
                    <div>
                      <p className="text-xs font-semibold text-white">
                        Protected Account
                      </p>
                      <p className="mt-1 text-[11px] text-ink-faint">
                        Your current security preferences are active.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === "General" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-4xl rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl">
              <SectionHeader
                icon={HiOutlineCog}
                title="General Settings"
                description="Manage platform-wide operational preferences"
              />

              <Toggle
                label="Auto-approve Verified Users"
                description="Skip manual review for users with matching verification data"
                checked={autoApprove}
                onChange={setAutoApprove}
              />

              <Toggle
                label="Maintenance Mode"
                description="Temporarily disable public access to BUMMPS"
                checked={maintenanceMode}
                onChange={setMaintenanceMode}
              />

              <Toggle
                label="Allow New Registrations"
                description="Allow new users to create accounts on the platform"
                checked={allowRegistrations}
                onChange={setAllowRegistrations}
              />
            </div>
          </motion.div>
        )}

        {tab === "Theme & Language" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl">
                <SectionHeader
                  icon={HiOutlineColorSwatch}
                  title="Appearance"
                  description="Customize the dashboard experience"
                />

                <Toggle
                  label="Dark Mode"
                  description="Use the premium BUMMPS charcoal interface"
                  checked={darkMode}
                  onChange={setDarkMode}
                />

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDarkMode(true)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      darkMode
                        ? "border-gold/40 bg-gold/[0.07]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div className="mb-3 h-12 rounded-lg border border-white/10 bg-[#121214]" />
                    <p className="text-xs font-semibold text-white">Dark</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDarkMode(false)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      !darkMode
                        ? "border-gold/40 bg-gold/[0.07]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div className="mb-3 h-12 rounded-lg border border-white/20 bg-white" />
                    <p className="text-xs font-semibold text-white">Light</p>
                  </button>
                </div>
              </div>

              <div className="rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl">
                <SectionHeader
                  icon={HiOutlineGlobe}
                  title="Language & Region"
                  description="Choose your preferred regional settings"
                />

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                      Language
                    </label>

                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none focus:border-gold/50"
                    >
                      <option>English (US)</option>
                      <option>Français</option>
                      <option>العربية</option>
                      <option>Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                      Time Zone
                    </label>

                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none focus:border-gold/50"
                    >
                      <option>GMT+5:30 (IST)</option>
                      <option>GMT+0 (UTC)</option>
                      <option>GMT-5 (EST)</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                      Current Region
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      India · {timezone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}