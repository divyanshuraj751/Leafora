import { Leaf } from "lucide-react";

const Footer = () => (
  <footer className="mt-16 border-t border-border/60 bg-background/50 backdrop-blur">
    <div className="container flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
      <Leaf className="h-4 w-4 text-primary" />
      <span>© {new Date().getFullYear()} Leafora</span>
    </div>
  </footer>
);

export default Footer;
