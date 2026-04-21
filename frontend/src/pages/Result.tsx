import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, RotateCcw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DiseaseCard, { type DiseaseResult } from "@/components/result/DiseaseCard";
import WeatherBanner from "@/components/result/WeatherBanner";
import Loader from "@/components/common/Loader";
import ChatDrawer from "@/components/chat/ChatDrawer";
import { getScan } from "@/utils/historyStore";

const fallback: DiseaseResult = {
  name: "Tomato Late Blight",
  confidence: 0.943,
  severity: "high",
  description:
    "Late blight, caused by the oomycete Phytophthora infestans, spreads rapidly in cool, wet conditions and can destroy entire crops within days.",
  treatment: [
    "Remove and destroy all infected plant parts immediately",
    "Apply copper-based fungicide every 7–10 days",
    "Improve air circulation by spacing plants properly",
    "Avoid overhead watering — switch to drip irrigation",
  ],
  prevention: [
    "Use certified disease-free seeds and transplants",
    "Practice 3-year crop rotation with non-solanaceous crops",
    "Mulch to prevent soil splash onto foliage",
    "Apply preventive fungicide before forecasted wet periods",
  ],
  isHealthy: false,
};

const Result = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => {
      const stored = id ? getScan(id) : undefined;
      setResult(stored?.result ?? fallback);
      setPreview(
        stored?.preview ??
          "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800&h=800&fit=crop",
      );
    }, 300);
    return () => clearTimeout(t);
  }, [id]);

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="rounded-full">
            <Share2 className="mr-1.5 h-4 w-4" /> Share
          </Button>
        </div>

        {!result ? (
          <div className="flex h-96 items-center justify-center">
            <Loader label="Analyzing leaf…" size="lg" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-5"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-elevated">
                <img
                  src={preview}
                  alt="Scanned plant"
                  className="h-80 w-full object-cover lg:h-[420px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-primary-foreground">
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-80">Confidence</p>
                    <p className="font-display text-3xl font-semibold">
                      {Math.round(result.confidence * 100)}%
                    </p>
                  </div>
                  <div className="relative h-16 w-16">
                    <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--background) / 0.25)" strokeWidth="3" />
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="hsl(var(--gold))"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 94.25" }}
                        animate={{ strokeDasharray: `${result.confidence * 94.25} 94.25` }}
                        transition={{ duration: 1 }}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <WeatherBanner />
            </motion.div>

            <div className="lg:col-span-3">
              <DiseaseCard result={result} />
            </div>
          </div>
        )}

        <div className="sticky bottom-4 z-30 flex gap-3 rounded-2xl glass-card p-3">
          <Link to="/" className="flex-1">
            <Button className="w-full rounded-full bg-gradient-leaf text-primary-foreground shadow-glow hover:opacity-90">
              <RotateCcw className="mr-2 h-4 w-4" /> Scan another
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat sits next to the result */}
      <ChatDrawer defaultOpen={false} label="Ask about this result" />
    </div>
  );
};

export default Result;
