import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage, type ChatTurn } from "@/services/chatbot";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "How to treat leaf blight?",
  "Best organic fungicides?",
  "Why are my leaves yellowing?",
  "Prevent root rot",
];

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi, I'm your Leafora plant expert 🌿 Ask me anything about diseases, treatments, soil, or seasonal care.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsLoading(true);
    const history: ChatTurn[] = next.map(({ role, content }) => ({ role, content }));
    const reply = await sendMessage(text.trim(), history);
    setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-2xl glass-card">
      <div className="relative flex items-center gap-3 border-b border-border/60 bg-gradient-hero p-4">
        <div className="absolute inset-0 bg-mesh-leaf opacity-30" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background/20 backdrop-blur">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="relative">
          <p className="font-display text-base font-semibold text-primary-foreground">Leafora Expert</p>
          <p className="text-xs text-primary-foreground/80">AI plant assistant · always learning</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user" ? "bg-primary" : "bg-gradient-leaf"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Bot className="h-4 w-4 text-primary-foreground" />
                )}
              </div>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-card ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card text-foreground rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-leaf">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="rounded-2xl bg-card px-4 py-3 shadow-card">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft [animation-delay:0.4s]" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 border-t border-border/60 px-4 py-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border/60 bg-background/40 p-4 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about plant diseases…"
            className="flex-1 rounded-full bg-background"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="rounded-full shadow-glow">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
