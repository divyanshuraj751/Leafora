import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, Leaf, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfidenceBar from "@/components/result/ConfidenceBar";

export interface DiseaseResult {
  name: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
  treatment: string[];
  prevention: string[];
  isHealthy: boolean;
}

const severityConfig = {
  low: { label: "Low Risk", className: "bg-leaf-light text-leaf border-leaf/30" },
  medium: { label: "Moderate", className: "bg-sun-light text-secondary-foreground border-sun/30" },
  high: { label: "High Risk", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

const DiseaseCard = ({ result }: { result: DiseaseResult }) => {
  const severity = severityConfig[result.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl glass-card"
    >
      <div className="relative bg-gradient-hero p-6">
        <div className="absolute inset-0 bg-mesh-leaf opacity-40" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-background/15 p-2.5 backdrop-blur">
              {result.isHealthy ? (
                <CheckCircle className="h-7 w-7 text-primary-foreground" />
              ) : (
                <AlertTriangle className="h-7 w-7 text-primary-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold leading-tight text-primary-foreground">
                {result.name}
              </h3>
              <p className="text-sm text-primary-foreground/80">
                AI diagnosis · {(result.confidence * 100).toFixed(1)}% confidence
              </p>
            </div>
          </div>
          <Badge className={`${severity.className} border shrink-0`}>{severity.label}</Badge>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <ConfidenceBar value={result.confidence} />

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <Info className="h-4 w-4 text-primary" /> About this diagnosis
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{result.description}</p>
        </div>

        <Tabs defaultValue="treatment" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="treatment" className="gap-1.5">
              <Leaf className="h-3.5 w-3.5" /> Treatment
            </TabsTrigger>
            <TabsTrigger value="prevention" className="gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Prevention
            </TabsTrigger>
          </TabsList>
          <TabsContent value="treatment" className="mt-4 space-y-2">
            {result.treatment.map((t, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-accent/40 p-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground">{t}</p>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="prevention" className="mt-4 space-y-2">
            {result.prevention.map((p, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-leaf-light/60 p-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                <p className="text-sm leading-relaxed text-foreground">{p}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default DiseaseCard;
