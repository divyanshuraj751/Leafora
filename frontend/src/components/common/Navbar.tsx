import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import leaf from "@/assets/leaf.svg";

const Navbar = () => (
  <nav className="sticky top-0 z-50 glass-nav">
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5">
        <motion.img
          src={leaf}
          alt="Leafora"
          className="h-9 w-9"
          whileHover={{ rotate: -8, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <span className="text-xl font-display font-semibold tracking-tight text-foreground">
          Leaf<span className="text-gradient-leaf">ora</span>
        </span>
      </Link>
    </div>
  </nav>
);

export default Navbar;
