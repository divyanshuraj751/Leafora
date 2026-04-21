import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { dataUrlToFile } from "@/utils/imageHelpers";

interface CameraCaptureProps {
  onImageSelect: (file: File, preview: string) => void;
}

const CameraCapture = ({ onImageSelect }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const start = async () => {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch {
      setError("Camera unavailable. Please check permissions or use upload instead.");
    }
  };

  const stop = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  };

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setSnapshot(dataUrl);
    const file = dataUrlToFile(dataUrl, `leafora-${Date.now()}.jpg`);
    onImageSelect(file, dataUrl);
    stop();
  };

  const retake = () => {
    setSnapshot(null);
    start();
  };

  if (error) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 p-6 text-center">
        <X className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground shadow-card">
      <AnimatePresence mode="wait">
        {snapshot ? (
          <motion.div key="snap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <img src={snapshot} alt="Captured" className="h-80 w-full object-cover" />
          </motion.div>
        ) : (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <video ref={videoRef} className="h-80 w-full object-cover" playsInline muted />
          </motion.div>
        )}
      </AnimatePresence>

      {flash && <div className="pointer-events-none absolute inset-0 bg-background animate-fade-in" />}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-t from-foreground/90 to-transparent p-4">
        {snapshot ? (
          <Button onClick={retake} variant="secondary" className="rounded-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Retake
          </Button>
        ) : (
          <button
            onClick={capture}
            className="group flex h-16 w-16 items-center justify-center rounded-full bg-background/95 ring-4 ring-background/40 transition-transform hover:scale-105"
            aria-label="Capture photo"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-leaf transition-transform group-active:scale-90">
              <Camera className="h-5 w-5 text-primary-foreground" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
