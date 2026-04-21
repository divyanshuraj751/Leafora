import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async (mode: "login" | "signup") => {
    if (!email || !password) {
      toast({ title: "Missing details", description: "Email and password are required." });
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup(email, password, name);
      navigate("/");
    } catch {
      toast({ title: "Something went wrong", description: "Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
        <div className="absolute inset-0 bg-mesh-leaf opacity-60" />
        <Leaf className="absolute left-[15%] top-[20%] h-16 w-16 -rotate-12 text-primary-foreground/20 animate-float-slow" />
        <Leaf className="absolute right-[20%] top-[55%] h-24 w-24 rotate-45 text-primary-foreground/15 animate-float" />
        <Leaf className="absolute right-[10%] bottom-[15%] h-12 w-12 -rotate-45 text-primary-foreground/25 animate-float-slow" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/20 backdrop-blur">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-semibold">Leafora</span>
          </div>
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight">
              Healthier plants,<br />
              <span className="italic text-gold">one scan</span> at a time.
            </h2>
            <p className="mt-4 max-w-md text-primary-foreground/85">
              Join thousands of growers using AI to protect their crops from disease — early, accurately, and sustainably.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">Welcome to Leafora</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to sync your scans across devices.</p>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-5 space-y-4">
              <Field id="email" label="Email" icon={Mail} value={email} onChange={setEmail} type="email" />
              <Field id="password" label="Password" icon={Lock} value={password} onChange={setPassword} type="password" />
              <Button onClick={() => handle("login")} disabled={busy} className="w-full rounded-full bg-gradient-leaf shadow-glow">
                {busy ? "Signing in…" : "Sign in"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="mt-5 space-y-4">
              <Field id="name" label="Name" icon={Mail} value={name} onChange={setName} type="text" />
              <Field id="email2" label="Email" icon={Mail} value={email} onChange={setEmail} type="email" />
              <Field id="password2" label="Password" icon={Lock} value={password} onChange={setPassword} type="password" />
              <Button onClick={() => handle("signup")} disabled={busy} className="w-full rounded-full bg-gradient-leaf shadow-glow">
                {busy ? "Creating…" : "Create account"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">
            <Link to="/" className="story-link">Continue as guest</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

interface FieldProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  type: string;
}
const Field = ({ id, label, icon: Icon, value, onChange, type }: FieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs">{label}</Label>
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl pl-9"
      />
    </div>
  </div>
);

export default Login;
