import { motion } from "framer-motion";
import { CloudSun, Leaf, MessagesSquare, ScanLine } from "lucide-react";

const features = [
  { icon: ScanLine, title: "Instant AI detection", desc: "Identify 38+ diseases in under 2 seconds with confidence scoring." },
  { icon: Leaf, title: "Treatment playbooks", desc: "Step-by-step organic & chemical treatment plans tailored to severity." },
  { icon: CloudSun, title: "Weather-aware risk", desc: "Local forecast cross-referenced with disease-spread conditions." },
  { icon: MessagesSquare, title: "Always-on expert", desc: "Chat with a plant-pathology assistant, anytime your crop needs help." },
];

const FeatureGrid = () => (
  <section className="container py-20">
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Why Leafora</p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Everything your crop needs, in one calm interface.
      </h2>
    </div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(({ icon: Icon, title, desc }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="group rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur hover-lift"
        >
          <div className="mb-4 inline-flex rounded-xl bg-gradient-leaf p-3 shadow-glow transition-transform group-hover:scale-110">
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeatureGrid;
