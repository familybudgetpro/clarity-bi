import React from "react";
import { Search, ChevronDown, MessageSquare } from "lucide-react";
import { ChatPanel } from "./ChatPanel";

interface FieldPanelProps {
  show: boolean;
  chatMessages: { role: string; content: string }[];
  onSendMessage: (msg: string) => void;
}

export function FieldPanel({
  show,
  chatMessages,
  onSendMessage,
}: FieldPanelProps) {
  if (!show) return null;

  const FieldItem = ({ name, icon }: { name: string; icon: string }) => (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-grab active:cursor-grabbing text-xs text-foreground group transition-colors">
      <span className="opacity-70 group-hover:opacity-100 transition-opacity">
        {icon}
      </span>
      <span>{name}</span>
    </div>
  );

  return (
    <aside className="w-72 bg-card border-l border-border flex flex-col shrink-0 shadow-xl z-20 h-full">
      <div className="flex-1 flex flex-col border-b border-border min-h-0">
        <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Fields
          </span>
          <Search size={14} className="text-muted-foreground" />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* Measures */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2 px-1">
              <ChevronDown size={12} />
              <span>Measures</span>
            </div>
            <div className="space-y-1">
              {[
                "Premium Amount",
                "Claims Amount",
                "Policy Count",
                "Loss Ratio",
              ].map((f) => (
                <FieldItem key={f} name={f} icon="💰" />
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2 px-1">
              <ChevronDown size={12} />
              <span>Dimensions</span>
            </div>
            <div className="space-y-1">
              {["Dealer Name", "Region", "Product Type", "Month"].map((f) => (
                <FieldItem key={f} name={f} icon="📊" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ChatPanel messages={chatMessages} onSendMessage={onSendMessage} />
    </aside>
  );
}
