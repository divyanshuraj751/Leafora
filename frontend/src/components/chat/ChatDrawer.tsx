import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ChatBot from "@/components/chat/ChatBot";

interface ChatDrawerProps {
  defaultOpen?: boolean;
  label?: string;
}

const ChatDrawer = ({ defaultOpen = false, label = "Ask AI expert" }: ChatDrawerProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-leaf px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-elevated"
            >
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <p className="font-display text-base font-semibold">Leafora Expert</p>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden p-3">
                <ChatBot />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatDrawer;
