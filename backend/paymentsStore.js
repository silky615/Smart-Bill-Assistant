import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, "data", "billing-state.json");

/** @type {{ accounts: Record<string, { paidBillMonths: string[]; payments: Array<{ id: string; at: string; amount: number; billMonth: string }> }> }} */
let cache = { accounts: {} };

function ensureDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function load() {
  ensureDir();
  if (!fs.existsSync(STORE_PATH)) {
    cache = { accounts: {} };
    return;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    cache = {
      accounts: typeof parsed.accounts === "object" && parsed.accounts ? parsed.accounts : {},
    };
  } catch {
    cache = { accounts: {} };
  }
}

function save() {
  ensureDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(cache, null, 2), "utf8");
}

load();

function accountBucket(accountNumber) {
  if (!cache.accounts[accountNumber]) {
    cache.accounts[accountNumber] = { paidBillMonths: [], payments: [] };
  }
  return cache.accounts[accountNumber];
}

/** @returns {{ paidBillMonths: string[] }} */
export function getBillingState(accountNumber) {
  load();
  const b = accountBucket(accountNumber);
  return { paidBillMonths: [...b.paidBillMonths] };
}

/**
 * Pay the current statement. Idempotent per (accountNumber, billMonth).
 */
export function recordPayment(accountNumber, billMonth, amount) {
  load();
  const b = accountBucket(accountNumber);
  const already = b.paidBillMonths.includes(billMonth);
  if (already) {
    const last = b.payments.length ? b.payments[b.payments.length - 1] : null;
    return { ok: true, duplicate: true, receipt: last };
  }
  const id = `pay_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const receipt = {
    id,
    at: new Date().toISOString(),
    amount: Math.round(amount * 100) / 100,
    billMonth,
  };
  b.payments.push(receipt);
  b.paidBillMonths.push(billMonth);
  save();
  return { ok: true, duplicate: false, receipt };
}

export function listPayments(accountNumber) {
  load();
  return [...accountBucket(accountNumber).payments];
}

/** Test / admin hook */
export function _resetBillingStore() {
  cache = { accounts: {} };
  if (fs.existsSync(STORE_PATH)) fs.unlinkSync(STORE_PATH);
}
