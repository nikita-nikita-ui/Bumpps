import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChatAlt2,
  HiOutlineSun,
  HiOutlineMoon,
  HiChevronDown,
  HiOutlineMenu,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

const defaultProfile = {
  name: "Admin User",
  email: "admin@bummps.com",
  role: "Super Admin",
  avatar: "https://i.pravatar.cc/150?img=12",
};

const getStoredProfile = () => {
  try {
    const saved = localStorage.getItem("adminProfile");

    return saved
      ? { ...defaultProfile, ...JSON.parse(saved) }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
};

export default function Topbar() {
  const { setMobileOpen, theme, toggleTheme } = useUI();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profile, setProfile] = useState(getStoredProfile);

  const ref = useRef(null);
  const nref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (nref.current && !nref.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    const updateProfile = () => {
      setProfile(getStoredProfile());
    };

    document.addEventListener("mousedown", onClick);
    window.addEventListener("adminProfileUpdated", updateProfile);

    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("adminProfileUpdated", updateProfile);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      title: "New user registration received",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment verification completed",
      time: "18 min ago",
      read: false,
    },
    {
      id: 3,
      title: "New premium subscription activated",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      title: "User verification request received",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 5,
      title: "System settings were updated",
      time: "3 hours ago",
      read: true,
    },
  ];

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="
        sticky top-0 z-30
        border-b border-gold/[0.08]
        bg-card/70
        px-4 py-3
        backdrop-blur-xl
        sm:px-6
        lg:px-8
      "
    >
      <div className="flex items-center gap-3">

        {/* =====================================================
            Mobile Menu
        ===================================================== */}

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="
            grid h-10 w-10 shrink-0 place-items-center
            rounded-xl
            border border-gold/[0.10]
            bg-white/[0.02]
            text-ink-muted
            transition-all duration-200
            hover:border-gold/30
            hover:bg-gold/[0.06]
            hover:text-gold
            lg:hidden
          "
        >
          <HiOutlineMenu className="text-lg" />
        </button>

        {/* =====================================================
            Search
        ===================================================== */}

        <div className="relative hidden w-full max-w-md md:block">
          <HiOutlineSearch
            className="
              pointer-events-none
              absolute left-4 top-1/2
              -translate-y-1/2
              text-ink-faint
            "
          />

          <input
            placeholder="Search users, chats, payments..."
            className="
              h-11 w-full
              rounded-xl
              border border-gold/[0.08]
              bg-white/[0.02]
              py-2.5 pl-11 pr-4
              text-sm text-white
              outline-none
              placeholder:text-ink-faint
              transition-all duration-200
              focus:border-gold/30
              focus:bg-gold/[0.035]
              focus:ring-4
              focus:ring-gold/[0.04]
            "
          />
        </div>

        {/* =====================================================
            Right Actions
        ===================================================== */}

        <div className="ml-auto flex items-center gap-2">

          {/* Theme */}

          <button
            type="button"
            onClick={toggleTheme}
            className="
              grid h-10 w-10 shrink-0
              place-items-center
              rounded-xl
              border border-gold/[0.10]
              bg-white/[0.02]
              text-ink-muted
              transition-all duration-200
              hover:border-gold/30
              hover:bg-gold/[0.06]
              hover:text-gold
            "
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{
                  rotate: -90,
                  opacity: 0,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  rotate: 90,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                {theme === "dark" ? (
                  <HiOutlineMoon className="text-lg" />
                ) : (
                  <HiOutlineSun className="text-lg" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          {/* Chat */}

          <Link
            to="/chats"
            className="
              relative grid h-10 w-10 shrink-0
              place-items-center
              rounded-xl
              border border-gold/[0.10]
              bg-white/[0.02]
              text-ink-muted
              transition-all duration-200
              hover:border-gold/30
              hover:bg-gold/[0.06]
              hover:text-gold
            "
          >
            <HiOutlineChatAlt2 className="text-lg" />

            <span
              className="
                absolute right-1 top-1
                h-2 w-2
                rounded-full
                bg-emerald-400
                ring-2 ring-card
              "
            />
          </Link>

          {/* =================================================
              Notifications
          ================================================= */}

          <div className="relative" ref={nref}>
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              className={`
                relative grid h-10 w-10 shrink-0
                place-items-center
                rounded-xl
                border
                bg-white/[0.02]
                text-ink-muted
                transition-all duration-200
                ${
                  notifOpen
                    ? "border-gold/40 bg-gold/[0.07] text-gold"
                    : "border-gold/[0.10] hover:border-gold/30 hover:bg-gold/[0.06] hover:text-gold"
                }
              `}
            >
              <HiOutlineBell className="text-lg" />

              {unread > 0 && (
                <span
                  className="
                    absolute -right-1 -top-1
                    grid h-4 min-w-4
                    place-items-center
                    rounded-full
                    border-2 border-card
                    bg-gold
                    px-1
                    text-[8px]
                    font-bold
                    text-[#15161A]
                  "
                >
                  {unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                  className="
                    absolute right-0 mt-3
                    w-[330px]
                    max-w-[calc(100vw-24px)]
                    overflow-hidden
                    rounded-2xl
                    border border-gold/[0.14]
                    bg-card/95
                    shadow-soft
                    backdrop-blur-2xl
                  "
                >
                  {/* Header */}

                  <div
                    className="
                      border-b
                      border-gold/[0.08]
                      bg-gold/[0.025]
                      px-4 py-4
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">
                          Notifications
                        </p>

                        <p className="mt-1 text-[10px] text-ink-faint">
                          Recent platform activity
                        </p>
                      </div>

                      {unread > 0 && (
                        <span
                          className="
                            rounded-full
                            border border-gold/20
                            bg-gold/[0.08]
                            px-2.5 py-1
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-gold
                          "
                        >
                          {unread} New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notifications */}

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="
                          flex items-start gap-3
                          border-b border-white/[0.04]
                          px-4 py-3.5
                          transition-colors
                          hover:bg-gold/[0.025]
                        "
                      >
                        <span
                          className={`
                            mt-1.5 h-2 w-2 shrink-0
                            rounded-full
                            ${
                              n.read
                                ? "bg-white/15"
                                : "bg-gold shadow-[0_0_10px_rgba(218,178,90,0.55)]"
                            }
                          `}
                        />

                        <div className="min-w-0">
                          <p className="text-xs leading-relaxed text-white">
                            {n.title}
                          </p>

                          <p className="mt-1 text-[10px] text-ink-faint">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View All */}

                  <Link
                    to="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="
                      block
                      border-t border-gold/[0.08]
                      bg-gold/[0.02]
                      px-4 py-3.5
                      text-center
                      text-xs
                      font-semibold
                      text-gold
                      transition-colors
                      hover:bg-gold/[0.06]
                    "
                  >
                    View all notifications
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              Profile
          ================================================= */}

          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className={`
                group flex h-10
                items-center gap-2
                rounded-xl
                border
                bg-white/[0.02]
                py-1 pl-1 pr-2
                transition-all duration-200
                ${
                  profileOpen
                    ? "border-gold/40 bg-gold/[0.07]"
                    : "border-gold/[0.10] hover:border-gold/30 hover:bg-gold/[0.05]"
                }
              `}
            >
              {/* Avatar */}

              <div className="relative shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="
                    h-8 w-8
                    rounded-full
                    object-cover
                    ring-2 ring-gold/20
                    transition-all
                    group-hover:ring-gold/40
                  "
                />

                <span
                  className="
                    absolute bottom-0 right-0
                    h-2.5 w-2.5
                    rounded-full
                    border-2 border-card
                    bg-emerald-400
                  "
                />
              </div>

              {/* Profile Info */}

              <div className="hidden min-w-0 text-left sm:block">
                <p
                  className="
                    max-w-[105px]
                    truncate
                    text-xs
                    font-semibold
                    leading-none
                    text-white
                  "
                >
                  {profile.name}
                </p>

                <p
                  className="
                    mt-1
                    max-w-[105px]
                    truncate
                    text-[10px]
                    text-ink-faint
                  "
                >
                  {profile.role}
                </p>
              </div>

              <HiChevronDown
                className={`
                  text-xs
                  text-ink-faint
                  transition-transform duration-300
                  ${
                    profileOpen
                      ? "rotate-180 text-gold"
                      : ""
                  }
                `}
              />
            </button>

            {/* Profile Dropdown */}

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                  className="
                    absolute right-0 mt-3
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border border-gold/[0.14]
                    bg-card/95
                    shadow-soft
                    backdrop-blur-2xl
                  "
                >
                  {/* Profile Header */}

                  <div
                    className="
                      border-b
                      border-gold/[0.08]
                      bg-gold/[0.025]
                      p-4
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="
                            h-12 w-12
                            rounded-full
                            object-cover
                            ring-2 ring-gold/20
                          "
                        />

                        <span
                          className="
                            absolute bottom-0 right-0
                            h-3 w-3
                            rounded-full
                            border-2 border-card
                            bg-emerald-400
                          "
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {profile.name}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-ink-faint">
                          {profile.email}
                        </p>

                        <span
                          className="
                            mt-2 inline-flex
                            rounded-full
                            border border-gold/20
                            bg-gold/[0.08]
                            px-2 py-0.5
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-gold
                          "
                        >
                          {profile.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}

                  <div className="p-2">

                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="
                        group flex items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        transition-all
                        hover:bg-gold/[0.05]
                      "
                    >
                      <span
                        className="
                          grid h-8 w-8 shrink-0
                          place-items-center
                          rounded-lg
                          border border-gold/[0.08]
                          bg-white/[0.025]
                          text-ink-muted
                          transition-colors
                          group-hover:border-gold/20
                          group-hover:text-gold
                        "
                      >
                        <HiOutlineUser />
                      </span>

                      <span>
                        <span className="block text-xs font-semibold text-white">
                          My Profile
                        </span>

                        <span className="mt-0.5 block text-[10px] text-ink-faint">
                          Manage your account
                        </span>
                      </span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="
                        group flex items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        transition-all
                        hover:bg-gold/[0.05]
                      "
                    >
                      <span
                        className="
                          grid h-8 w-8 shrink-0
                          place-items-center
                          rounded-lg
                          border border-gold/[0.08]
                          bg-white/[0.025]
                          text-ink-muted
                          transition-colors
                          group-hover:border-gold/20
                          group-hover:text-gold
                        "
                      >
                        <HiOutlineCog />
                      </span>

                      <span>
                        <span className="block text-xs font-semibold text-white">
                          Settings
                        </span>

                        <span className="mt-0.5 block text-[10px] text-ink-faint">
                          Dashboard preferences
                        </span>
                      </span>
                    </Link>

                  </div>

                  {/* Logout */}

                  <div className="border-t border-gold/[0.08] p-2">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="
                        group flex w-full
                        items-center gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-danger
                        transition-all
                        hover:bg-danger/[0.06]
                      "
                    >
                      <span
                        className="
                          grid h-8 w-8 shrink-0
                          place-items-center
                          rounded-lg
                          bg-danger/[0.06]
                          transition-colors
                          group-hover:bg-danger/[0.10]
                        "
                      >
                        <HiOutlineLogout />
                      </span>

                      <span className="text-xs font-semibold">
                        Log Out
                      </span>
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
}