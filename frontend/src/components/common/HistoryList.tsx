import { motion } from "framer-motion";
import { Calendar, ChevronRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export interface ScanHistoryItem {
  id: string;
  plantName: string;
  disease: string;
  date: string;
  severity: "low" | "medium" | "high";
  imageUrl: string;
  isHealthy: boolean;
}

const severityDot: Record<string, string> = {
  low: "bg-leaf",
  medium: "bg-sun",
  high: "bg-destructive",
};

interface Props {
  items: ScanHistoryItem[];
  layout?: "list" | "grid";
}

const HistoryList = ({ items, layout = "grid" }: Props) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center">
        <div className="rounded-full bg-accent p-5 animate-float">
          <Leaf className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="font-display text-lg text-foreground">No scans yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Upload your first plant image to get started.</p>
        </div>
      </div>
    );
  }

  const containerClass =
    layout === "grid"
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "flex flex-col gap-3";

  return (
    <div className={containerClass}>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            to={`/result/${item.id}`}
            className="group block overflow-hidden rounded-2xl bg-card shadow-card hover-lift"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.plantName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-foreground/70 to-transparent" />
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
                <span className={`h-1.5 w-1.5 rounded-full ${severityDot[item.severity]}`} />
                {item.isHealthy ? "Healthy" : item.severity}
              </span>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-primary-foreground">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold">{item.disease}</p>
                  <p className="truncate text-xs opacity-80">{item.plantName}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {item.date}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default HistoryList;
