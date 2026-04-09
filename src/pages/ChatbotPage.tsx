import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Send, Paperclip, Clock, Search } from "lucide-react";
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
  const navigate = useNavigate();

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

  const toggleMode = (mode: FeatureMode) =>
    setActiveMode(prev => prev === mode ? null : mode);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#0D1117] text-[#E8EEF8]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>
      {/* ── Chat main ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">

        {/* Chat header */}
        <div className="h-11 shrink-0 border-b border-white/[0.07] flex items-center gap-2.5 px-5">
          <div className="w-7 h-7 rounded-md overflow-hidden shrink-0">
            <img src={Logo} alt="Caduceus" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-semibold text-[#E8EEF8]">AI Assistant</span>
          <span className="text-xs text-[#4A5568]">· Caduceus CRM</span>
          <div className="ml-auto flex gap-1">
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#4A5568] hover:bg-white/7 hover:text-[#C5CDE3] transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="3" r="1.5" /><circle cx="3" cy="8" r="1.5" /><circle cx="12" cy="13" r="1.5" />
                <path d="M4.5 8.8l6 3.5M4.5 7.2l6-3.5" />
              </svg>
            </button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#4A5568] hover:bg-white/7 hover:text-[#C5CDE3] transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="3" cy="8" r="1.2" /><circle cx="8" cy="8" r="1.2" /><circle cx="13" cy="8" r="1.2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 pb-10">
              <div className="px-4 py-2 rounded-lg bg-[rgba(232,116,34,0.1)] border border-[rgba(232,116,34,0.2)] text-xs font-medium text-[#E87422]">
                AI-powered assistant
              </div>
              <div className="text-[22px] font-semibold text-[#E8EEF8] tracking-tight">Welcome back, Jony</div>
              <div className="text-sm text-[#4A5568]">Ask me anything about your pipeline or CRM</div>
              <div className="flex gap-2 flex-wrap justify-center mt-1">
                {CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => setInput(chip)}
                    className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs text-[#7C8BA8] hover:border-[rgba(232,116,34,0.3)] hover:text-[#E87422] hover:bg-[rgba(232,116,34,0.06)] transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2.5 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-semibold mt-0.5 ${msg.role === "user"
                      ? "bg-gradient-to-br from-[#E87422] to-[#C5531A] text-white"
                      : "bg-[rgba(232,116,34,0.15)] border border-[rgba(232,116,34,0.2)] text-[#E87422]"
                    }`}>
                    {msg.role === "user" ? "J" : "AI"}
                  </div>
                  <div className={msg.role === "user" ? "items-end flex flex-col" : ""}>
                    <div className={`max-w-[72%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === "user"
                        ? "bg-[#E87422] text-white rounded-[10px_3px_10px_10px]"
                        : "bg-[rgba(22,28,40,0.95)] border border-white/[0.07] text-[#C5CDE3] rounded-[3px_10px_10px_10px]"
                      }`}>
                      {msg.content}
                    </div>
                    <div className="text-[10px] text-[#4A5568] mt-1 px-0.5">{formatTime(msg.timestamp)}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-[rgba(232,116,34,0.15)] border border-[rgba(232,116,34,0.2)] text-[#E87422] flex items-center justify-center text-[10px] font-semibold shrink-0">AI</div>
                  <div className="flex gap-1.5 px-3.5 py-3 bg-[rgba(22,28,40,0.95)] border border-white/[0.07] rounded-[3px_10px_10px_10px]">
                    {[0, 200, 400].map(delay => (
                      <span key={delay} className="w-1.5 h-1.5 rounded-full bg-[#4A5568] animate-pulse" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input zone */}
        <div className="shrink-0 px-5 pb-4 pt-2.5 border-t border-white/[0.07]">
          <div className="rounded-[10px] bg-[rgba(16,22,32,0.9)] border border-white/[0.1] focus-within:border-[rgba(232,116,34,0.4)] transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask whatever you want…"
              rows={1}
              className="w-full bg-transparent border-none outline-none resize-none text-[#E8EEF8] text-sm px-3.5 pt-3 pb-1.5 min-h-[42px] max-h-[120px] leading-relaxed placeholder-white/20"
            />
            <div className="flex items-center gap-1.5 px-2.5 pb-2.5 pt-1">
              {(["think", "search", "more"] as FeatureMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => toggleMode(mode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${activeMode === mode
                      ? "bg-[rgba(232,116,34,0.1)] border-[rgba(232,116,34,0.35)] text-[#E87422]"
                      : "bg-white/[0.04] border-white/[0.07] text-[#7C8BA8] hover:bg-white/[0.07] hover:text-[#C5CDE3] hover:border-white/[0.14]"
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

              <div className="ml-auto flex items-center gap-1.5">
                <input ref={fileInputRef} type="file" className="hidden" onChange={() => { }} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#7C8BA8] hover:bg-white/[0.08] hover:text-[#C5CDE3] transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-md bg-[#E87422] flex items-center justify-center text-white hover:bg-[#C5531A] disabled:bg-[rgba(232,116,34,0.3)] disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center mt-1.5 text-[10px] text-[#2E3748]">AI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </div>
  );
}
