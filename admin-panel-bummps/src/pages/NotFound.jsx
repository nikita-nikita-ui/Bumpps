import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="gold-text font-display text-7xl font-extrabold">
        404
      </motion.h1>
      <p className="mt-3 text-ink-muted">This page doesn't exist in the BUMMPS admin panel.</p>
      <Link to="/" className="mt-6">
        <Button variant="primary">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
