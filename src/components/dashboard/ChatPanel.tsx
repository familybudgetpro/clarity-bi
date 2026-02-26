"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  WifiOff,
  ArrowRight,
  Filter,
  RotateCcw,
  Plus,
  LayoutDashboard,
} from "lucide-react";

interface AiAction {
  navigate?: string;
  filters?: Record<string, string>;
  create_template?: string;
}

interface WidgetSuggestion {
  type: string;
  title: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  actions?: AiAction | null;
  nextSuggestions?: string[];
  widgetSuggestions?: WidgetSuggestion[];
}

interface HistoryItem {
  role: string;
  content: string;
}

interface ChatPanelProps {
  show: boolean;
  onSend: (
    message: string,
    history: HistoryItem[],
  ) => Promise<{
    response: string;
    actions?: AiAction | null;
    suggestions?: string[];
    nextSuggestions?: string[];
    widgetSuggestions?: WidgetSuggestion[];
  }>;
  aiAvailable: boolean;
  onAiAction?: (action: AiAction) => void;
  onAddWidget?: (type: string, title: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  "What is the overall loss ratio?",
  "Which dealer has the most claims?",
  "Show me claims by vehicle make",
  "What are the top part failures?",
];

function parseMarkdown(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function ChatPanel({
  show,
  onSend,
  aiAvailable,
  onAiAction,
  onAddWidget,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generalSuggestions, setGeneralSuggestions] =
    useState<string[]>(DEFAULT_SUGGESTIONS);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    const userMsg: ChatMessage = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const priorHistory = [...history];

    try {
      const result = await onSend(msg, priorHistory);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: result.response,
        actions: result.actions,
        nextSuggestions: result.nextSuggestions?.slice(0, 3) || [],
        widgetSuggestions: result.widgetSuggestions?.slice(0, 3) || [],
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Accumulate history for multi-turn memory
      setHistory((prev) => [
        ...prev,
        { role: "user", content: msg },
        { role: "assistant", content: result.response },
      ]);

      if (result.suggestions && result.suggestions.length > 0) {
        setGeneralSuggestions(result.suggestions.slice(0, 4));
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Failed to get a response. Please try again.",
          nextSuggestions: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    setHistory([]);
    setGeneralSuggestions(DEFAULT_SUGGESTIONS);
  };

  const handleAction = (action: AiAction) => {
    if (onAiAction) onAiAction(action);
  };

  if (!show) return null;

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col shrink-0 shadow-lg">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border flex items-center gap-2 shrink-0">
        <Sparkles size={15} className="text-primary" />
        <span className="text-sm font-bold text-foreground">Clarity AI</span>
        <div
          className={`ml-auto w-2 h-2 rounded-full shrink-0 ${aiAvailable ? "bg-green-500" : "bg-red-400"}`}
        />
        <span className="text-[9px] text-muted-foreground">
          {aiAvailable ? "Online" : "Offline"}
        </span>
        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="ml-1 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Clear conversation"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-muted-foreground/20"
      >
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-4 font-medium">
              Ask me about your data
            </p>
            <div className="space-y-1.5">
              {generalSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(s)}
                  className="w-full text-left text-[11px] p-2.5 bg-muted/30 hover:bg-muted/70 border border-border hover:border-primary/30 rounded-lg text-foreground transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="space-y-1.5">
            <div
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-foreground border border-border"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {parseMarkdown(msg.content)}
                </div>

                {msg.role === "assistant" && msg.actions && (
                  <div className="mt-2 pt-2 border-t border-border/50 space-y-1.5">
                    {msg.actions.navigate && (
                      <button
                        onClick={() => handleAction(msg.actions!)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[10px] font-semibold transition-colors"
                      >
                        <ArrowRight size={10} />
                        View in{" "}
                        {msg.actions.navigate.charAt(0).toUpperCase() +
                          msg.actions.navigate.slice(1)}
                      </button>
                    )}
                    {msg.actions.filters &&
                      Object.keys(msg.actions.filters).length > 0 && (
                        <button
                          onClick={() => handleAction(msg.actions!)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 rounded-lg text-[10px] font-semibold transition-colors"
                        >
                          <Filter size={10} />
                          Apply:{" "}
                          {Object.entries(msg.actions.filters)
                            .map(([k, v]) => `${k}=${v}`)
                            .join(", ")}
                        </button>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* 3 follow-up suggestion pills after each AI response */}
            {msg.role === "assistant" &&
              msg.nextSuggestions &&
              msg.nextSuggestions.length > 0 &&
              i === messages.length - 1 &&
              !loading && (
                <div className="space-y-1 pl-1">
                  {msg.nextSuggestions.map((s, si) => (
                    <button
                      key={si}
                      onClick={() => handleSubmit(s)}
                      className="block w-full text-left text-[10px] px-2.5 py-1.5 bg-muted/20 hover:bg-primary/10 border border-border/60 hover:border-primary/40 rounded-lg text-muted-foreground hover:text-primary transition-all"
                    >
                      ↳ {s}
                    </button>
                  ))}
                </div>
              )}

            {/* Widget suggestions — Add to Dashboard buttons */}
            {msg.role === "assistant" &&
              onAddWidget &&
              msg.widgetSuggestions &&
              msg.widgetSuggestions.length > 0 &&
              i === messages.length - 1 &&
              !loading && (
                <div className="pl-1 mt-1">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <LayoutDashboard size={9} /> Suggested Widgets
                  </p>
                  <div className="space-y-1">
                    {msg.widgetSuggestions.map((w, wi) => (
                      <button
                        key={wi}
                        onClick={() => onAddWidget(w.type, w.title)}
                        className="flex items-center gap-2 w-full text-left text-[10px] px-2.5 py-1.5 bg-primary/5 hover:bg-primary/15 border border-primary/20 hover:border-primary/50 rounded-lg text-primary transition-all"
                      >
                        <Plus size={9} />
                        <span className="flex-1 truncate">{w.title}</span>
                        <span className="text-[8px] opacity-60">Add</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted/50 border border-border rounded-xl px-3 py-2 flex items-center gap-1.5">
              <Loader2 size={12} className="animate-spin text-primary" />
              <span className="text-[10px] text-muted-foreground">
                Thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border shrink-0">
        {!aiAvailable && (
          <div className="flex items-center gap-2 text-[10px] text-amber-600 bg-amber-500/10 px-2 py-1.5 rounded-lg mb-2 border border-amber-500/20">
            <WifiOff size={10} />
            <span>Set GEMINI_API_KEY in .env to enable AI</span>
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSubmit()
            }
            placeholder="Ask about your data..."
            className="flex-1 px-3 py-2 text-xs bg-muted/30 border border-border rounded-lg outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || loading}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
        {history.length > 0 && (
          <p className="text-[9px] text-muted-foreground/60 text-center mt-1.5">
            {Math.floor(history.length / 2)} turn
            {history.length / 2 !== 1 ? "s" : ""} in context
          </p>
        )}
      </div>
    </aside>
  );
}
