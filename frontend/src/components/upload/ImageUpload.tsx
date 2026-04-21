import { useCallback, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isValidImage } from "@/utils/imageHelpers";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
}

const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!isValidImage(file)) {
        setError("Please choose an image under 10 MB.");
        return;
      }
      setError(null);
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelect(file, url);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative overflow-hidden rounded-2xl border border-border shadow-card"
          >
            <img src={preview} alt="Selected plant" className="h-80 w-full object-cover" />
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 rounded-full bg-foreground/70 p-2 text-background backdrop-blur transition-colors hover:bg-foreground"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`group relative flex h-80 cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
              dragOver
                ? "border-primary bg-accent shadow-glow"
                : "border-border bg-card/60 hover:border-primary/60 hover:bg-accent/40"
            }`}
          >
            <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100 bg-mesh-leaf" />
            <motion.div
              animate={dragOver ? { scale: 1.15, y: -6 } : { scale: 1, y: 0 }}
              className="rounded-2xl bg-gradient-leaf p-4 shadow-glow"
            >
              <Upload className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <div className="text-center">
              <p className="font-display text-lg font-semibold text-foreground">
                Drop your plant image here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse · JPG, PNG up to 10 MB
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <ImageIcon className="h-3 w-3" /> Best results: bright, focused leaf
              </p>
            </div>
            <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
          </motion.label>
        )}
      </AnimatePresence>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default ImageUpload;
