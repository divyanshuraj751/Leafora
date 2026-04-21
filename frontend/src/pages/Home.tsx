import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload as UploadIcon, Zap, Leaf, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/upload/ImageUpload";
import CameraCapture from "@/components/upload/CameraCapture";
import WeatherBanner from "@/components/result/WeatherBanner";
import LocalHistory from "@/components/home/LocalHistory";
import ChatDrawer from "@/components/chat/ChatDrawer";
import { predictDisease } from "@/services/api";
import { saveScan } from "@/utils/historyStore";
import { fileToDataURL } from "@/utils/imageHelpers";
import { toast } from "@/hooks/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<{ file: File; preview: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [mode, setMode] = useState<"upload" | "camera">("upload");

  const handleSelect = useCallback((file: File, preview: string) => {
    setSelected({ file, preview });
  }, []);

  const handleAnalyze = async () => {
    if (!selected) return;
    setAnalyzing(true);
    try {
      const result = await predictDisease(selected.file);
      const id = Date.now().toString();
      const dataUrl = await fileToDataURL(selected.file).catch(() => selected.preview);
      saveScan({ id, date: new Date().toISOString(), preview: dataUrl, result });
      navigate(`/result/${id}`);
    } catch {
      toast({ title: "Analysis failed", description: "Please try again in a moment." });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="container pt-8">
        <div className="mx-auto max-w-2xl">
          <WeatherBanner />
        </div>
      </section>

      <section id="scan-section" className="container pt-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl glass-card p-6 sm:p-8"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">Scan a plant</h2>
                <p className="text-sm text-muted-foreground">Upload an image or use your camera.</p>
              </div>
              <Leaf className="h-6 w-6 text-primary animate-float" />
            </div>

            <Tabs value={mode} onValueChange={(v) => setMode(v as "upload" | "camera")}>
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="gap-1.5">
                  <UploadIcon className="h-3.5 w-3.5" /> Upload
                </TabsTrigger>
                <TabsTrigger value="camera" className="gap-1.5">
                  <Camera className="h-3.5 w-3.5" /> Camera
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <ImageUpload onImageSelect={handleSelect} />
              </TabsContent>
              <TabsContent value="camera">
                {mode === "camera" && <CameraCapture onImageSelect={handleSelect} />}
              </TabsContent>
            </Tabs>

            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5"
                >
                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    size="lg"
                    className="w-full rounded-full bg-gradient-leaf text-primary-foreground shadow-glow hover:opacity-90"
                  >
                    {analyzing ? (
                      <>
                        <Leaf className="mr-2 h-4 w-4 animate-spin" /> Analyzing…
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" /> Analyze plant
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-primary" />
              95% model accuracy
            </div>
          </motion.div>
        </div>
      </section>

      <LocalHistory />

      <ChatDrawer />
    </div>
  );
};

export default Home;
