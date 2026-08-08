import { AnimatePresence, motion } from "framer-motion";
import { HiX } from "react-icons/hi";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidth} max-h-[85vh] overflow-y-auto rounded-card border border-gold/20 bg-[#1D1F24] p-6 sm:p-7 shadow-lift`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">{title}</h3>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-ink-muted transition-colors hover:border-gold/40 hover:text-gold">
                <HiX />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
