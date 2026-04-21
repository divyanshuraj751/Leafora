import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Search, ScanLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoryList, { type ScanHistoryItem } from "@/components/common/HistoryList";
import WeatherBanner from "@/components/result/WeatherBanner";
import Loader from "@/components/common/Loader";
import { fetchHistory } from "@/services/api";

type Filter = "all" | "healthy" | "issues";

const Dashboard = () => {
  const [items, setItems] = useState<ScanHistoryItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetchHistory().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((i) => {
      const matchesQuery =
        !query ||
        i.disease.toLowerCase().includes(query.toLowerCase()) ||
        i.plantName.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === "all" || (filter === "healthy" ? i.isHealthy : !i.isHealthy);
      return matchesQuery && matchesFilter;
    });
  }, [items, query, filter]);

  const stats = useMemo(() => {
    const total = items?.length ?? 0;
    const healthy = items?.filter((i) => i.isHealthy).length ?? 0;
    const issues = total - healthy;
    return [
      { label: "Total scans", value: total, icon: ScanLine, tone: "from-primary to-primary-glow" },
      { label: "Healthy", value: `${total ? Math.round((healthy / total) * 100) : 0}%`, icon: Heart, tone: "from-leaf to-success" },
      { label: "Active issues", value: issues, icon: Activity, tone: "from-sun to-gold" },
    ];
  }, [items]);

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Your scan history
          </h1>
          <p className="text-sm text-muted-foreground">
            Every diagnosis, treatment plan and trend in one place.
          </p>
        </div>

        <WeatherBanner />

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, tone }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl glass-card p-5"
            >
              <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${tone} p-2.5 shadow-glow`}>
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="font-display text-3xl font-semibold text-foreground">{value}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search disease or plant…"
              className="rounded-full pl-9"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="healthy">Healthy</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {!items ? (
          <div className="flex h-64 items-center justify-center">
            <Loader label="Loading your scans…" />
          </div>
        ) : (
          <HistoryList items={filtered} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
