import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Capture", desc: "Snap or upload a clear photo of the affected leaf." },
  { n: "02", title: "Diagnose", desc: "Our AI model returns the disease, severity, and confidence." },
  { n: "03", title: "Act", desc: "Follow the personalised treatment & prevention plan." },
];

const HowItWorks = () => (
  <section className="border-y border-border/60 bg-card/40">
    <div className="container py-20">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Three steps from worry to harvest.
        </h2>
      </div>
      <div className="relative grid gap-8 md:grid-cols-3">
        <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="relative z-10 flex h-18 w-18 items-center justify-center rounded-full bg-background p-1 shadow-card">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-leaf font-display text-lg font-semibold text-primary-foreground shadow-glow">
                {s.n}
              </span>
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{s.title}</h3>
            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
