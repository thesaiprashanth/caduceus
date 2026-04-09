import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Paperclip, Search, Sparkles, Bot, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../Assets/Logo.jpeg";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type FeatureMode = "think" | "search" | "more" | null;

const API_BASE_URL = "http://127.0.0.1:8000";

const CHIPS = ["Summarize open leads", "Draft follow-up email", "Top deals this month"];

const formatTime = (d: Date) =>
  d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<FeatureMode>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const history = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      }));
      const res = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, mode: activeMode, history }),
      });
      const data: { reply?: string } = res.ok ? await res.json() : {};
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply ?? "I'm sorry, I couldn't generate a response right now.",
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I ran into an error connecting to the AI service. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const navigate = useNavigate();

  const toggleMode = (mode: FeatureMode) =>
    setActiveMode(prev => prev === mode ? null : mode);

  return (
    /* h-screen + overflow-hidden anchors the layout to the viewport,
       bypassing the parent <main>'s overflow-y-auto scroll container */
    <div className="flex flex-col h-screen overflow-hidden bg-black text-zinc-200 font-sans antialiased">

      {/* Header */}
      <div className="shrink-0 h-12 border-b border-white/5 flex items-center gap-3 px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors shrink-0"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-white/10 shrink-0" />

        <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-white/10 shrink-0">
          <img src={Logo} alt="Caduceus" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">AI Assistant</span>
          <span className="text-xs text-zinc-600">· Caduceus CRM</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-400 text-[11px] font-medium">
          <Sparkles className="w-3 h-3" strokeWidth={1.75} />
          AI powered
        </div>
      </div>

      {/* Messages — flex-1 + min-h-0 makes this fill remaining space and scroll internally */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-6 py-6 flex flex-col gap-5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 pb-16">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-zinc-900/60 ring-1 ring-white/5 flex items-center justify-center">
              <Bot className="w-7 h-7 text-violet-400" strokeWidth={1.5} />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white tracking-tight">How can I help you?</h2>
              <p className="text-sm text-zinc-500 mt-1">Ask anything about your pipeline or CRM data.</p>
            </div>

            {/* Chips */}
            <div className="flex gap-2 flex-wrap justify-center mt-1">
              {CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="px-3.5 py-1.5 rounded-full text-xs text-zinc-400 bg-zinc-900/60 ring-1 ring-white/5 hover:ring-violet-500/30 hover:text-violet-300 hover:bg-violet-500/5 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-semibold mt-0.5 ${
                  msg.role === "user"
                    ? "bg-zinc-700 text-zinc-200"
                    : "bg-violet-500/15 ring-1 ring-violet-500/25 text-violet-400"
                }`}>
                  {msg.role === "user" ? "S" : "AI"}
                </div>

                {/* Bubble */}
                <div className={msg.role === "user" ? "flex flex-col items-end" : ""}>
                  <div className={`max-w-[68%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words rounded-xl ${
                    msg.role === "user"
                      ? "bg-zinc-800 text-zinc-100 rounded-tr-sm"
                      : "bg-zinc-900/60 ring-1 ring-white/5 text-zinc-300 rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-1 px-1">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-violet-500/15 ring-1 ring-violet-500/25 text-violet-400 flex items-center justify-center text-[10px] font-semibold shrink-0">
                  AI
                </div>
                <div className="flex gap-1.5 px-4 py-3.5 bg-zinc-900/60 ring-1 ring-white/5 rounded-xl rounded-tl-sm">
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input zone */}
      <div className="shrink-0 px-6 pb-5 pt-3 border-t border-white/5">
        <div className="rounded-xl bg-zinc-900/60 ring-1 ring-white/8 focus-within:ring-violet-500/30 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask whatever you want…"
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none text-zinc-200 text-sm px-4 pt-3.5 pb-2 min-h-[44px] max-h-[120px] leading-relaxed placeholder-zinc-600"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-1.5 px-3 pb-3 pt-1">
            {/* Mode toggles */}
            {(["think", "search", "more"] as FeatureMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => toggleMode(mode)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ring-1 transition-colors ${
                  activeMode === mode
                    ? "bg-violet-500/10 ring-violet-500/25 text-violet-300"
                    : "bg-white/[0.03] ring-white/6 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300"
                }`}
              >
                {mode === "think" && (
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 2" />
                  </svg>
                )}
                {mode === "search" && <Search className="w-2.5 h-2.5" />}
                {mode === "more" && (
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="3" cy="8" r="1.2" /><circle cx="8" cy="8" r="1.2" /><circle cx="13" cy="8" r="1.2" />
                  </svg>
                )}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-1.5">
              <input ref={fileInputRef} type="file" className="hidden" onChange={() => {}} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-7 h-7 rounded-md bg-white/[0.03] ring-1 ring-white/6 flex items-center justify-center text-zinc-500 hover:bg-white/[0.07] hover:text-zinc-300 transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center text-white hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-2 text-[10px] text-zinc-700">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
