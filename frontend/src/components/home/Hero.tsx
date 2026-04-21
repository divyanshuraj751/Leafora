import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Sparkles, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-plant.jpg";

const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <img src={heroImg} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-foreground/60" />
      <div className="absolute inset-0 bg-mesh-leaf opacity-60 mix-blend-soft-light" />
    </div>

    {/* floating leaf motifs */}
    <Leaf className="absolute left-[8%] top-[18%] h-10 w-10 -rotate-12 text-primary-foreground/30 animate-float-slow" />
    <Leaf className="absolute right-[10%] top-[28%] h-8 w-8 rotate-45 text-primary-foreground/20 animate-float" />
    <Leaf className="absolute right-[18%] bottom-[15%] h-12 w-12 -rotate-45 text-primary-foreground/25 animate-float-slow" />

    <div className="container relative flex flex-col items-center py-24 text-center sm:py-32">
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-background/10 px-4 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur"
      >
        <Sparkles className="h-3.5 w-3.5 text-gold" />
        AI-powered plant intelligence
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-primary-foreground sm:text-6xl"
      >
        Diagnose your plants in{" "}
        <span className="italic text-gold">seconds</span>
        <span className="block text-primary-foreground/85">not seasons.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-auto mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg"
      >
        Snap a leaf, get an instant AI diagnosis, treatment plan and weather-aware care guidance — built for growers who can't wait.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <Button
          size="lg"
          onClick={() => document.getElementById("scan-section")?.scrollIntoView({ behavior: "smooth" })}
          className="rounded-full bg-background text-foreground shadow-glow hover:bg-background/90"
        >
          <Camera className="mr-2 h-4 w-4" /> Scan a plant
        </Button>
        <Link to="/chat">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            Ask AI expert <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium uppercase tracking-wider text-primary-foreground/70"
      >
        <span>10k+ scans</span>
        <span className="h-1 w-1 rounded-full bg-primary-foreground/40" />
        <span>38 crops covered</span>
        <span className="h-1 w-1 rounded-full bg-primary-foreground/40" />
        <span>95% model accuracy</span>
      </motion.div>
    </div>
  </section>
);

export default Hero;
