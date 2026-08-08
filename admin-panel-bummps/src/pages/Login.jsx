import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiArrowRight } from "react-icons/hi";
import { loginAdmin } from "../services/Apis/auth";
import Logo from "../components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
  ev.preventDefault();

  if (!validate()) return;

  try {
    setLoading(true);

    console.log({
      email,
      password,
    });

    const res = await loginAdmin({
      email,
      password,
    });

    console.log(res);

    navigate("/");
  } catch (error) {
    console.log(error.response?.status);
    console.log(error.response?.data);
    alert(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#17181C] px-4">
      {/* Animated gradient "video" backdrop */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-1/4 -top-1/4 h-[900px] w-[900px] rounded-full bg-gradient-to-br from-gold/20 via-gold/5 to-transparent blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -6, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/3 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-tl from-[#F2D89A]/15 via-gold/5 to-transparent blur-[110px]"
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#17181C]/40 to-[#17181C]" />
        {/* floating hearts / sparks motif */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold/40"
            style={{ width: 3 + (i % 3), height: 3 + (i % 3), left: `${(i * 9.3) % 100}%`, top: `${(i * 17) % 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px] rounded-card border border-gold/[0.18] bg-card/60 p-8 sm:p-10 backdrop-blur-2xl shadow-lift"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-11 mb-6" />
          <h1 className="font-display text-2xl font-extrabold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-ink-muted">Sign in to manage the BUMMPS platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">Email</label>
            <div className="relative">
              <HiOutlineMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bummps.io"
                className={`w-full rounded-2xl border bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-ink-faint outline-none transition-all focus:bg-white/[0.05] ${
                  errors.email ? "border-danger/60 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]" : "border-gold/[0.16] focus:border-gold/50 focus:shadow-[0_0_0_4px_rgba(218,178,90,0.08)]"
                }`}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-1.5 text-xs text-danger">
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-ink-muted">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full rounded-2xl border bg-white/[0.03] py-3 pl-11 pr-11 text-sm text-white placeholder:text-ink-faint outline-none transition-all focus:bg-white/[0.05] ${
                  errors.password ? "border-danger/60" : "border-gold/[0.16] focus:border-gold/50 focus:shadow-[0_0_0_4px_rgba(218,178,90,0.08)]"
                }`}
              />
              <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-gold">
                {showPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-1.5 text-xs text-danger">
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-ink-muted">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-3.5 w-3.5 accent-[#DAB25A]" />
              Remember me
            </label>
            <a href="#" className="font-semibold text-gold hover:text-gold-soft transition-colors">
              Forgot Password?
            </a>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-pill bg-gold-gradient py-3.5 text-sm font-bold text-[#1D1508] shadow-[0_8px_28px_rgba(218,178,90,0.4)] transition-shadow hover:shadow-[0_10px_36px_rgba(218,178,90,0.55)] disabled:opacity-70"
          >
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-[#1D1508]/30 border-t-[#1D1508]"
                />
                Signing in...
              </>
            ) : (
              <>
                Sign In <HiArrowRight />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-7 text-center text-xs text-ink-faint">
          Demo access · use any email &amp; a password of 6+ characters
        </p>
      </motion.div>
    </div>
  );
}
