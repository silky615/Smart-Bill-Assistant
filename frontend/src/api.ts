export const ACCOUNT_STORAGE_KEY = "vzw_demo_account";

export type Charge = {
  id: string;
  title: string;
  amount: number;
  badge: string;
  badgeTone: "blue" | "purple" | "orange" | "gray";
  variant: "default" | "warning";
  warningTitle?: string;
  warningDetail?: string;
};

export type PaymentReceipt = {
  id: string;
  at: string;
  amount: number;
  billMonth: string;
};

export type BillBundle = {
  profile: {
    name: string;
    accountNumber: string;
    plan: string;
    address: string;
    dueDate: string;
  };
  billMonth: string;
  totals: {
    current: number;
    lastMonth: number;
    difference: number;
    subtotal: number;
    taxes: number;
  };
  comparisonFootnote: string;
  dataUsage: {
    usedGb: number;
    totalGb: number;
    note: string;
    overageBanner: string;
  };
  unusualChargesCount: number;
  alertBanner: {
    title: string;
    body: string;
    actionLabel: string;
  };
  charges: Charge[];
  billing: {
    billMonth: string;
    isPaid: boolean;
    recentPayments?: PaymentReceipt[];
  };
};

export function getStoredAccount(): string | null {
  return localStorage.getItem(ACCOUNT_STORAGE_KEY);
}

export function setStoredAccount(accountNumber: string | null) {
  if (accountNumber) localStorage.setItem(ACCOUNT_STORAGE_KEY, accountNumber);
  else localStorage.removeItem(ACCOUNT_STORAGE_KEY);
}

function authHeaders(): HeadersInit {
  const a = getStoredAccount();
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (a) h["X-Demo-Account"] = a;
  return h;
}

async function readJson<T>(r: Response): Promise<T> {
  const data = (await r.json()) as T & { error?: string };
  if (!r.ok) {
    throw new Error((data as { error?: string }).error || `${r.status} ${r.statusText}`);
  }
  return data as T;
}

export async function login(accountNumber: string, pin: string): Promise<{ accountNumber: string; name: string }> {
  const r = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountNumber, pin }),
  });
  return readJson(r);
}

export async function fetchMe(): Promise<BillBundle> {
  const r = await fetch("/api/me", { headers: authHeaders() });
  return readJson(r);
}

export async function fetchGroqStatus(): Promise<{ configured: boolean }> {
  const r = await fetch("/api/groq/status");
  return readJson(r);
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function postGroqChat(messages: ChatMessage[]): Promise<{ reply: string }> {
  const r = await fetch("/api/chat", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ messages }),
  });
  const data = (await r.json()) as { reply?: string; error?: string };
  if (!r.ok) throw new Error(data.error || `${r.status}`);
  if (typeof data.reply !== "string") throw new Error("Invalid chat response");
  return { reply: data.reply };
}

export async function fetchBillSummary(language: "en" | "es"): Promise<{ bullets: string[]; source: string }> {
  const r = await fetch("/api/bill-summary", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ language }),
  });
  return readJson(r);
}

export async function fetchChatSuggestions(): Promise<string[]> {
  try {
    const r = await fetch("/api/ui/chat-suggestions");
    const data = (await r.json()) as { suggestions?: string[] };
    if (!r.ok || !Array.isArray(data.suggestions)) return [];
    return data.suggestions;
  } catch {
    return [];
  }
}

export async function fetchRawBill(): Promise<unknown> {
  const r = await fetch("/api/bills/raw", { headers: authHeaders() });
  return readJson(r);
}

export async function postPayment(): Promise<{
  ok: boolean;
  alreadyPaid?: boolean;
  receipt: PaymentReceipt | null;
}> {
  const r = await fetch("/api/payments/pay", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({}),
  });
  return readJson(r);
}

export function money(n: number) {
  return `$${n.toFixed(2)}`;
}
