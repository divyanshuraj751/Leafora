import { Leaf } from "lucide-react";

interface LoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

const Loader = ({ label, size = "md" }: LoaderProps) => (
  <div className="flex flex-col items-center justify-center gap-3">
    <div className="relative">
      <div className={`${sizes[size]} animate-spin-slow rounded-full border-2 border-dashed border-primary/40`} />
      <Leaf className={`absolute inset-0 m-auto ${sizes[size]} animate-float text-primary`} />
    </div>
    {label && <p className="text-sm text-muted-foreground animate-pulse-soft">{label}</p>}
  </div>
);

export default Loader;
