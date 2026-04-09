"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Assets/Logo.jpeg";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type FeatureMode = "think" | "search" | "more" | null;
type LLMOption = "gemini" | "openai";

const API_BASE_URL = "http://127.0.0.1:8000";

const SparkleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2">
    <circle cx="8" cy="8" r="3" /><path d="M8 1v3M8 12v3M1 8h3M12 8h3" />
  </svg>
);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<FeatureMode>(null);
  const [selectedLLM, setSelectedLLM] = useState<LLMOption>("gemini");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const history = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      }));

      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          mode: activeMode,
          llm: selectedLLM,
          history,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch chatbot response.");
      }

      const data: { reply?: string } = await response.json();
      const responseText =
        data.reply ||
        "I'm sorry, I couldn't generate a response right now. Please try again.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I ran into an error while connecting to the AI service. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMode = (mode: FeatureMode) => {
    setActiveMode((prev) => (prev === mode ? null : mode));
  };

  const formatTime = (date: Date) => {
    return date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0D1117; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; height: 100vh; overflow: hidden; }

        .topbar { height: 44px; background: #0D1117; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; padding: 0 20px; flex-shrink: 0; }
        .topbar-brand { display: flex; align-items: center; gap: 8px; margin-right: 32px; }
        .brand-icon { width: 22px; height: 22px; border-radius: 5px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .brand-name { font-size: 13px; font-weight: 600; color: #E8EEF8; letter-spacing: -0.2px; }
        .topbar-nav { display: flex; align-items: center; gap: 2px; flex: 1; }
        .nav-item { padding: 4px 12px; font-size: 12px; color: #7C8BA8; border-radius: 5px; cursor: pointer; transition: all 0.15s; font-weight: 500; }
        .nav-item:hover { color: #C5CDE3; background: rgba(255,255,255,0.05); }
        .nav-item.active { color: #E87422; background: rgba(232,116,34,0.1); }
        .sign-in-btn { padding: 5px 14px; font-size: 12px; font-weight: 500; color: #E8EEF8; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; cursor: pointer; background: transparent; transition: all 0.15s; }
        .sign-in-btn:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }

        .chat-layout { display: flex; flex: 1; overflow: hidden; height: calc(100vh - 44px); }

        .sidebar { width: 220px; border-right: 1px solid rgba(255,255,255,0.07); background: #0A0E16; display: flex; flex-direction: column; flex-shrink: 0; }
        .sidebar-header { padding: 12px 14px 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .back-btn { display: flex; align-items: center; gap: 6px; padding: 6px 8px; margin-bottom: 12px; font-size: 12px; font-weight: 500; color: #7C8BA8; cursor: pointer; transition: all 0.15s; border-radius: 5px; }
        .back-btn:hover { background: rgba(255,255,255,0.05); color: #C5CDE3; }
        .new-chat-btn { width: 100%; padding: 7px 12px; font-size: 12px; font-weight: 500; color: #E8EEF8; border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; cursor: pointer; background: rgba(255,255,255,0.04); display: flex; align-items: center; gap: 7px; transition: all 0.15s; }
        .new-chat-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .sidebar-section { padding: 10px 10px 4px; font-size: 10px; font-weight: 600; color: #4A5568; letter-spacing: 0.5px; text-transform: uppercase; }
        .chat-item { padding: 6px 10px; margin: 1px 4px; border-radius: 5px; cursor: pointer; font-size: 12px; color: #7C8BA8; transition: all 0.15s; display: flex; align-items: center; gap: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .chat-item:hover { background: rgba(255,255,255,0.05); color: #C5CDE3; }
        .chat-item.active { background: rgba(232,116,34,0.1); color: #E87422; }
        .sidebar-footer { margin-top: auto; padding: 10px; border-top: 1px solid rgba(255,255,255,0.05); }
        .user-row { display: flex; align-items: center; gap: 8px; padding: 6px 4px; border-radius: 6px; cursor: pointer; transition: all 0.15s; }
        .user-row:hover { background: rgba(255,255,255,0.05); }
        .user-avatar { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg,#E87422,#C5531A); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #fff; flex-shrink: 0; }
        .user-name { font-size: 12px; font-weight: 500; color: #C5CDE3; }
        .user-role { font-size: 10px; color: #4A5568; }

        .chat-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #0D1117; }
        .chat-header { padding: 10px 20px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .chat-header-icon { width: 28px; height: 28px; border-radius: 7px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .chat-header-title { font-size: 13px; font-weight: 600; color: #E8EEF8; }
        .chat-header-sub { font-size: 11px; color: #4A5568; margin-left: 2px; }
        .header-actions { margin-left: auto; display: flex; gap: 4px; }
        .hdr-btn { width: 28px; height: 28px; border-radius: 5px; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #4A5568; transition: all 0.15s; }
        .hdr-btn:hover { background: rgba(255,255,255,0.07); color: #C5CDE3; }

        .messages { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 16px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
        .messages::-webkit-scrollbar { width: 4px; }
        .messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        .welcome { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 12px; padding-bottom: 40px; }
        .welcome-badge { background: rgba(232,116,34,0.1); border: 1px solid rgba(232,116,34,0.2); border-radius: 8px; padding: 8px 16px; font-size: 12px; color: #E87422; font-weight: 500; }
        .welcome-title { font-size: 22px; font-weight: 600; color: #E8EEF8; letter-spacing: -0.4px; }
        .welcome-sub { font-size: 13px; color: #4A5568; }
        .chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
        .chip { padding: 6px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; font-size: 12px; color: #7C8BA8; cursor: pointer; transition: all 0.15s; }
        .chip:hover { border-color: rgba(232,116,34,0.3); color: #E87422; background: rgba(232,116,34,0.06); }

        .msg-row { display: flex; gap: 10px; align-items: flex-start; }
        .msg-row.user { flex-direction: row-reverse; }
        .msg-avatar { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; margin-top: 1px; }
        .msg-avatar.bot { background: rgba(232,116,34,0.15); border: 1px solid rgba(232,116,34,0.2); color: #E87422; }
        .msg-avatar.user-av { background: linear-gradient(135deg,#E87422,#C5531A); color: #fff; }
        .msg-bubble { max-width: 72%; padding: 9px 14px; border-radius: 10px; font-size: 13px; line-height: 1.55; white-space: pre-wrap; word-break: break-word; }
        .msg-bubble.user { background: #E87422; color: #fff; border-radius: 10px 3px 10px 10px; }
        .msg-bubble.bot { background: rgba(22,28,40,0.95); border: 1px solid rgba(255,255,255,0.07); color: #C5CDE3; border-radius: 3px 10px 10px 10px; }
        .msg-meta { font-size: 10px; color: #4A5568; margin-top: 4px; padding: 0 2px; }

        .typing-indicator { display: flex; gap: 5px; padding: 10px 14px; background: rgba(22,28,40,0.95); border: 1px solid rgba(255,255,255,0.07); border-radius: 3px 10px 10px 10px; width: fit-content; }
        .typing-dot { width: 6px; height: 6px; background: #4A5568; border-radius: 50%; animation: pulse 1.3s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse { 0%,80%,100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1.1); } }

        .input-zone { flex-shrink: 0; padding: 10px 20px 14px; border-top: 1px solid rgba(255,255,255,0.07); }
        .input-box { background: rgba(16,22,32,0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; transition: border-color 0.15s; }
        .input-box:focus-within { border-color: rgba(232,116,34,0.4); }
        .input-textarea { width: 100%; background: transparent; border: none; outline: none; resize: none; color: #E8EEF8; font-size: 13px; font-family: inherit; padding: 11px 14px 6px; min-height: 42px; max-height: 120px; line-height: 1.5; }
        .input-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .toolbar { display: flex; align-items: center; gap: 6px; padding: 5px 10px 9px 10px; }
        .tool-pill { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: #7C8BA8; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .tool-pill:hover { background: rgba(255,255,255,0.07); color: #C5CDE3; border-color: rgba(255,255,255,0.14); }
        .tool-pill.active { background: rgba(232,116,34,0.1); border-color: rgba(232,116,34,0.35); color: #E87422; }
        .spacer { flex: 1; }
        .icon-action { width: 30px; height: 30px; border-radius: 7px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #7C8BA8; transition: all 0.15s; }
        .icon-action:hover { background: rgba(255,255,255,0.08); color: #C5CDE3; }
        .send-btn { width: 30px; height: 30px; border-radius: 7px; background: #E87422; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; color: #fff; }
        .send-btn:hover:not(:disabled) { background: #C5531A; }
        .send-btn:disabled { background: rgba(232,116,34,0.3); cursor: not-allowed; }
        .disclaimer { text-align: center; margin-top: 6px; font-size: 10px; color: #2E3748; }
      `}</style>

      <div className="chat-layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="back-btn" onClick={() => navigate('/')}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 12L6 8l4-4" />
              </svg>
              Home
            </div>
            <button className="new-chat-btn">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="3" x2="8" y2="13" /><line x1="3" y1="8" x2="13" y2="8" />
              </svg>
              New conversation
            </button>
          </div>
          <div className="sidebar-section">Recent</div>
          {["Lead follow-up strategy", "Q2 pipeline review", "Onboarding automation"].map((item, i) => (
            <div key={item} className={`chat-item ${i === 0 ? "active" : ""}`}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 2h12v10H9l-3 2v-2H2z" />
              </svg>
              {item}
            </div>
          ))}
          <div className="sidebar-section">Earlier</div>
          {["Cold outreach templates", "Account scoring model"].map((item) => (
            <div key={item} className="chat-item">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 2h12v10H9l-3 2v-2H2z" />
              </svg>
              {item}
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="user-row">
              <div className="user-avatar">J</div>
              <div>
                <div className="user-name">Jony</div>
                <div className="user-role">Sales Manager</div>
              </div>
            </div>
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-header-icon"><img src={Logo} alt="Caduceus" style={{width:'100%',height:'100%',objectFit:'cover'}} /></div>
            <div className="chat-header-title">AI Assistant</div>
            <span className="chat-header-sub">· Caduceus CRM</span>
            <div className="header-actions">
              <button className="hdr-btn">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="3" r="1.5" /><circle cx="3" cy="8" r="1.5" /><circle cx="12" cy="13" r="1.5" />
                  <path d="M4.5 8.8l6 3.5M4.5 7.2l6-3.5" />
                </svg>
              </button>
              <button className="hdr-btn">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="3" cy="8" r="1.2" /><circle cx="8" cy="8" r="1.2" /><circle cx="13" cy="8" r="1.2" />
                </svg>
              </button>
            </div>
          </div>

          <div className="messages">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-badge">AI-powered assistant</div>
                <div className="welcome-title">Welcome back, Jony</div>
                <div className="welcome-sub">Ask me anything about your pipeline or CRM</div>
                <div className="chips">
                  {["Summarize open leads", "Draft follow-up email", "Top deals this month"].map((chip) => (
                    <div key={chip} className="chip" onClick={() => setInput(chip)}>{chip}</div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`msg-row ${msg.role}`}>
                    <div className={`msg-avatar ${msg.role === "user" ? "user-av" : "bot"}`}>
                      {msg.role === "user" ? "J" : "AI"}
                    </div>
                    <div>
                      <div className={`msg-bubble ${msg.role === "user" ? "user" : "bot"}`}>
                        {msg.content}
                      </div>
                      <div className="msg-meta">{formatTime(msg.timestamp)}</div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="msg-row">
                    <div className="msg-avatar bot">AI</div>
                    <div className="typing-indicator">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="input-zone">
            <div className="input-box">
              <textarea
                ref={textareaRef}
                className="input-textarea"
                placeholder="Ask whatever you want…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <div className="toolbar">
                {(["think", "search", "more"] as FeatureMode[]).map((mode) => (
                  <div
                    key={mode}
                    className={`tool-pill ${activeMode === mode ? "active" : ""}`}
                    onClick={() => toggleMode(mode)}
                  >
                    {mode === "think" && (
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 2" />
                      </svg>
                    )}
                    {mode === "search" && (
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5l3 3" />
                      </svg>
                    )}
                    {mode === "more" && (
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="3" cy="8" r="1.2" /><circle cx="8" cy="8" r="1.2" /><circle cx="13" cy="8" r="1.2" />
                      </svg>
                    )}
                    {mode!.charAt(0).toUpperCase() + mode!.slice(1)}
                  </div>
                ))}
                {(["gemini", "openai"] as LLMOption[]).map((llm) => (
                  <div
                    key={llm}
                    className={`tool-pill ${selectedLLM === llm ? "active" : ""}`}
                    onClick={() => setSelectedLLM(llm)}
                  >
                    {llm === "openai" ? "ChatGPT" : "Gemini"}
                  </div>
                ))}
                <div className="spacer" />
                <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={() => { }} />
                <div className="icon-action" onClick={() => fileInputRef.current?.click()}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M13 8.5l-5 5a3.5 3.5 0 0 1-4.95-4.95l5.66-5.66a2 2 0 0 1 2.83 2.83l-5.66 5.66a.5.5 0 0 1-.71-.71L10.83 5" />
                  </svg>
                </div>
                <button
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3 8h10M8 3l5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="disclaimer">AI can make mistakes. Verify important information.</div>
          </div>
        </div>
      </div>
    </>
  );
}