import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { BillBundle } from "../api";
import { fetchChatSuggestions, fetchGroqStatus, fetchMe, postGroqChat, type ChatMessage } from "../api";
import { AppHeader } from "../components/AppHeader";
import { HelpFab } from "../components/HelpFab";
import { IconBack, IconRobot, IconSend } from "../components/Icons";

const SUGGESTIONS = [
  "Why did my bill go up?",
  "What is the activation fee?",
  "How can I reduce my bill?",
  "Dispute a charge",
];

export function ChatPage() {
  const [bill, setBill] = useState<BillBundle | null>(null);
  const [lines, setLines] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [groqOk, setGroqOk] = useState<boolean | null>(null);
  const [chips, setChips] = useState<string[]>(SUGGESTIONS);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void fetchChatSuggestions().then((s) => {
      if (s.length) setChips(s);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [b, g] = await Promise.all([fetchMe(), fetchGroqStatus()]);
        if (!cancelled) {
          setBill(b);
          setGroqOk(g.configured);
        }
      } catch {
        if (!cancelled) setBill(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const greeting = useMemo(() => {
    const name = bill?.profile.name?.split(" ")[0] ?? "there";
    return `Hi ${name}! I'm your Verizon Bill Assistant. I can help you understand your bill, explain charges, or connect you with a specialist. What would you like to know?`;
  }, [bill]);

  useEffect(() => {
    if (!bill) return;
    setLines((prev) => {
      if (prev.length === 0) return [{ role: "assistant", content: greeting }];
      return prev;
    });
  }, [bill, greeting]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, loading]);

  const send = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t || loading || !bill) return;
      if (groqOk === false) {
        setErr("Add GROQ_API_KEY to backend/.env and restart the API to use chat.");
        return;
      }
      setErr(null);
      const system: ChatMessage = {
        role: "system",
        content: `You are a friendly Verizon bill support assistant. Keep answers concise. Customer: ${bill.profile.name}, account ${bill.profile.accountNumber}. Current bill about $${bill.totals.current} for ${bill.billMonth}.`,
      };
      const nextUser: ChatMessage = { role: "user", content: t };
      const history: ChatMessage[] = [
        system,
        ...lines.map((l) => ({ role: l.role, content: l.content }) as ChatMessage),
        nextUser,
      ];
      setLines((prev) => [...prev, { role: "user", content: t }]);
      setInput("");
      setLoading(true);
      try {
        const { reply } = await postGroqChat(history);
        setLines((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Message failed");
        setLines((prev) => prev.slice(0, -1));
        setInput(t);
      } finally {
        setLoading(false);
      }
    },
    [bill, groqOk, lines, loading]
  );

  if (!bill) {
    return (
      <div className="vz-page vz-loading">
        <div className="vz-spinner" />
      </div>
    );
  }

  return (
    <div className="vz-page chat-page">
      <div className="vz-page-inner vz-page-chat">
        <AppHeader name={bill.profile.name} />
        <Link to="/dashboard" className="vz-back-link">
          <IconBack />
          Back to Dashboard
        </Link>
        <div className="vz-chat-header-row">
          <div>
            <h1 className="vz-h1">Chat Support</h1>
            <p className="muted">AI-powered bill assistance.</p>
          </div>
          <span className="vz-pill-online">
            <span className="vz-dot" aria-hidden />
            Online
          </span>
        </div>
        <hr className="vz-divider" />

        <div className="vz-chat-log">
          {lines.map((l, i) => (
            <div key={`${i}-${l.role}`} className={`vz-chat-row ${l.role}`}>
              {l.role === "assistant" ? (
                <div className="vz-bot-avatar" aria-hidden>
                  <IconRobot className="vz-bot-icon" />
                </div>
              ) : (
                <div className="vz-bot-spacer" aria-hidden />
              )}
              <div className={`vz-bubble ${l.role}`}>{l.content}</div>
            </div>
          ))}
          {loading ? (
            <div className="vz-chat-row assistant">
              <div className="vz-bot-avatar" aria-hidden>
                <IconRobot className="vz-bot-icon" />
              </div>
              <div className="vz-bubble assistant muted">Typing…</div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="vz-suggestions">
          {chips.map((s) => (
            <button key={s} type="button" className="vz-chip" onClick={() => void send(s)}>
              {s}
            </button>
          ))}
        </div>
        {err ? <div className="vz-banner vz-banner-error vz-mb-sm">{err}</div> : null}
        <form
          className="vz-chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <input
            className="vz-input vz-chat-input"
            placeholder="Ask me about your bill..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="vz-send-btn" aria-label="Send" disabled={loading}>
            <IconSend className="vz-send-ic" />
          </button>
        </form>
      </div>
      <HelpFab />
    </div>
  );
}
