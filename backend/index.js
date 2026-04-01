import "dotenv/config";
import express from "express";
import cors from "cors";
import { validateLogin } from "./accountTemplates.js";
import { composeBillBundle, defaultSummaryBullets } from "./billComposer.js";
import { getBillingState, recordPayment, listPayments } from "./paymentsStore.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

function accountFromReq(req) {
  const h = req.headers["x-demo-account"] || req.headers["authorization"]?.replace(/^Bearer\s+/i, "");
  const raw = typeof h === "string" ? h.trim() : "";
  return raw || null;
}

function getBillBundle(accountNumber) {
  const { paidBillMonths } = getBillingState(accountNumber);
  return composeBillBundle(accountNumber, { paidBillMonths });
}

function enrichBilling(accountNumber, bundle) {
  if (!bundle) return null;
  const recentPayments = listPayments(accountNumber)
    .slice(-5)
    .reverse()
    .map((p) => ({ ...p }));
  return {
    ...bundle,
    billing: {
      ...bundle.billing,
      recentPayments,
    },
  };
}

function requireAccount(req, res, next) {
  const accountNumber = accountFromReq(req);
  const bundle = accountNumber ? getBillBundle(accountNumber) : null;
  if (!bundle) {
    res.status(401).json({ error: "Sign in required or invalid account." });
    return;
  }
  req.bill = enrichBilling(accountNumber, bundle);
  req.accountNumber = accountNumber;
  next();
}

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const CHAT_SUGGESTIONS = [
  "Why did my bill go up?",
  "What is the activation fee?",
  "How can I reduce my bill?",
  "Dispute a charge",
];

async function groqComplete(messages, temperature = 0.5) {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    const err = new Error("GROQ_API_KEY_MISSING");
    err.code = "NO_KEY";
    throw err;
  }
  const groqRes = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature,
    }),
  });
  const data = await groqRes.json();
  if (!groqRes.ok) {
    const msg = data?.error?.message || data?.message || `Groq HTTP ${groqRes.status}`;
    const err = new Error(msg);
    err.details = data;
    throw err;
  }
  return data?.choices?.[0]?.message?.content ?? "";
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/ui/chat-suggestions", (_req, res) => {
  res.json({ suggestions: CHAT_SUGGESTIONS });
});

app.post("/api/auth/login", (req, res) => {
  const accountNumber = req.body?.accountNumber != null ? String(req.body.accountNumber).trim() : "";
  const pin = req.body?.pin != null ? String(req.body.pin).trim() : "";
  const user = validateLogin(accountNumber, pin);
  if (!user) {
    res.status(401).json({ error: "Invalid account number or PIN." });
    return;
  }
  res.json(user);
});

app.get("/api/me", requireAccount, (req, res) => {
  res.json(req.bill);
});

/** Full raw bill + template-backed fields for “Show raw bill” / support tools */
app.get("/api/bills/raw", requireAccount, (req, res) => {
  res.json({
    generatedAt: new Date().toISOString(),
    accountNumber: req.accountNumber,
    statement: req.bill,
  });
});

app.post("/api/payments/pay", requireAccount, (req, res) => {
  const bundle = req.bill;
  const expected = bundle.totals.current;
  const bodyAmt = req.body?.amount;
  const amount = bodyAmt != null && bodyAmt !== "" ? Number(bodyAmt) : expected;

  if (Number.isNaN(amount) || amount <= 0) {
    res.status(400).json({ error: "Invalid payment amount." });
    return;
  }
  if (Math.abs(amount - expected) > 0.009) {
    res.status(400).json({
      error: `Amount must equal your total due of $${expected.toFixed(2)}.`,
      totalDue: expected,
    });
    return;
  }
  if (bundle.billing?.isPaid) {
    const all = listPayments(req.accountNumber);
    res.json({
      ok: true,
      alreadyPaid: true,
      receipt: all.length ? all[all.length - 1] : null,
    });
    return;
  }

  const result = recordPayment(req.accountNumber, bundle.billMonth, expected);
  res.json({
    ok: true,
    alreadyPaid: result.duplicate === true,
    receipt: result.receipt,
  });
});

app.get("/api/groq/status", (_req, res) => {
  res.json({ configured: Boolean(process.env.GROQ_API_KEY?.trim()) });
});

app.post("/api/chat", async (req, res) => {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    res.status(503).json({
      error:
        "GROQ_API_KEY is not set. Add it to backend/.env (see backend/.env.example).",
    });
    return;
  }
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Request body must include a non-empty messages array." });
    return;
  }
  const cleaned = messages
    .filter((m) => m && typeof m.role === "string" && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content }));
  if (cleaned.length === 0) {
    res.status(400).json({ error: "Each message needs role and content strings." });
    return;
  }
  try {
    const reply = await groqComplete(cleaned, 0.6);
    res.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Groq request failed";
    res.status(502).json({ error: message, details: err?.details });
  }
});

app.post("/api/bill-summary", requireAccount, async (req, res) => {
  const language = req.body?.language === "es" ? "es" : "en";
  const bundle = req.bill;
  const fallback = () =>
    res.json({
      bullets: defaultSummaryBullets(bundle, language),
      source: "fallback",
    });

  if (!process.env.GROQ_API_KEY?.trim()) {
    fallback();
    return;
  }

  const billJson = JSON.stringify({
    profile: bundle.profile,
    billMonth: bundle.billMonth,
    totals: bundle.totals,
    billing: bundle.billing,
    charges: bundle.charges.map((c) => ({
      title: c.title,
      amount: c.amount,
      variant: c.variant,
    })),
    dataUsage: bundle.dataUsage,
    unusualChargesCount: bundle.unusualChargesCount,
  });

  const system =
    language === "es"
      ? "Eres un asistente de facturas móviles. Responde SOLO con una lista de viñetas en español (cada línea empieza con '- '), máximo 5 viñetas, tono claro y breve, sin markdown aparte de los guiones."
      : "You are a mobile carrier bill assistant. Reply with ONLY a plain bullet list in English (each line starts with '- '), at most 5 bullets, clear and concise. No other text.";

  const userPrompt = `Explain this bill in plain language for the customer:\n${billJson}`;

  try {
    const text = await groqComplete(
      [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      0.4
    );
    const bullets = text
      .split("\n")
      .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
      .filter(Boolean);
    if (bullets.length === 0) {
      fallback();
      return;
    }
    res.json({ bullets, source: "groq" });
  } catch (err) {
    if (err?.code === "NO_KEY") {
      fallback();
      return;
    }
    res.status(502).json({ error: err instanceof Error ? err.message : "Summary failed" });
  }
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
});
