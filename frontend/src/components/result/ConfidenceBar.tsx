import { motion } from "framer-motion";

interface ConfidenceBarProps {
  value: number; // 0..1
  label?: string;
}

const ConfidenceBar = ({ value, label }: ConfidenceBarProps) => {
  const pct = Math.round(value * 100);
  const tone =
    value >= 0.8 ? "from-success to-leaf" : value >= 0.5 ? "from-sun to-gold" : "from-destructive to-sun";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{label ?? "Confidence"}</span>
        <span className="text-foreground">{pct}%</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${tone}`}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
