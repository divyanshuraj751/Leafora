import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Leaf, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHistory, clearHistory, type LocalScan } from "@/utils/historyStore";
import { useEffect, useState } from "react";

const severityDot: Record<string, string> = {
  low: "bg-leaf",
  medium: "bg-sun",
  high: "bg-destructive",
};

const LocalHistory = () => {
  const [items, setItems] = useState<LocalScan[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  if (items.length === 0) {
    return (
      <section className="container py-12">
        <div className="mx-auto max-w-2xl flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 py-12 text-center">
          <div className="rounded-full bg-accent p-4 animate-float">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <p className="font-display text-base text-foreground">No scans yet</p>
          <p className="text-sm text-muted-foreground">Your scan history is saved locally on this device.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Recent scans</h2>
            <p className="text-sm text-muted-foreground">Stored locally on your device</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearHistory();
              setItems([]);
            }}
            className="text-muted-foreground"
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/result/${item.id}`}
                className="group block overflow-hidden rounded-2xl bg-card shadow-card hover-lift"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.preview}
                    alt={item.result.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
                    <span className={`h-1.5 w-1.5 rounded-full ${severityDot[item.result.severity]}`} />
                    {Math.round(item.result.confidence * 100)}%
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-primary-foreground">
                    <div className="min-w-0">
                      <p className="truncate font-display text-base font-semibold">{item.result.name}</p>
                      <p className="flex items-center gap-1 truncate text-xs opacity-80">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalHistory;
