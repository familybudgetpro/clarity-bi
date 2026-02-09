import React, { useState } from "react";
import { MessageSquare, ArrowUpRight } from "lucide-react";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
}

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="h-80 flex flex-col bg-muted/30 border-t border-border">
      <div className="p-3 border-b border-border flex items-center gap-2 bg-card">
        <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-600 rounded flex items-center justify-center shadow-sm">
          <MessageSquare size={12} className="text-primary-foreground" />
        </div>
        <span className="text-xs font-bold text-foreground">Clarity AI</span>
        <span className="ml-auto text-[10px] bg-green-500/10 text-green-600 border border-green-500/20 px-1.5 py-0.5 rounded font-medium">
          Online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-xs leading-relaxed max-w-[90%] ${
              m.role === "user"
                ? "bg-primary text-primary-foreground ml-auto rounded-2xl rounded-br-sm p-3 shadow-md"
                : "bg-card border border-border mr-auto rounded-2xl rounded-bl-sm p-3 text-muted-foreground shadow-sm"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border bg-card"
      >
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI..."
            className="w-full pl-3 pr-10 py-2.5 bg-muted/50 border border-transparent focus:border-primary/50 focus:bg-background rounded-xl text-xs outline-none transition-all placeholder:text-muted-foreground/70"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 shadow-sm transition-transform active:scale-95"
          >
            <ArrowUpRight size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
