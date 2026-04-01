/**
 * Demo account credentials + billing templates (source data only).
 * Totals, alerts, and footnotes are computed in billComposer.js.
 */

export const DEMO_USERS = {
  "123456": { pin: "1234" },
  "789012": { pin: "5678" },
  "345678": { pin: "9012" },
  "901234": { pin: "3456" },
};

/**
 * @typedef {Object} ChargeTemplate
 * @property {string} id
 * @property {string} title
 * @property {number} amount
 * @property {string} badge
 * @property {'blue'|'purple'|'orange'|'gray'} badgeTone
 * @property {'default'|'warning'} variant
 * @property {'service'|'fee'|'overage'|'tax'} category
 * @property {string} [warningTitle]
 * @property {string} [warningDetail]
 */

/** Per-account billing source data (totals derived in billComposer). */
export const ACCOUNT_TEMPLATES = {
  "123456": {
    profile: {
      name: "Sarah Johnson",
      plan: "Unlimited Plus",
      address: "742 Evergreen Terrace, Springfield",
      dueDateLabel: "April 15, 2026",
    },
    billMonth: "March 2026",
    lastMonthTotal: 53.5,
    dataUsage: {
      usedGb: 8.2,
      totalGb: 15,
      /** Shown when UI references overage policy / payment page banner */
      overageMessage: "You exceeded your data limit by 2GB",
    },
    /** @type {ChargeTemplate[]} */
    chargeLineItems: [
      {
        id: "plan",
        title: "Unlimited Plus Plan",
        amount: 45,
        badge: "Recurring",
        badgeTone: "blue",
        variant: "default",
        category: "service",
      },
      {
        id: "activation",
        title: "Activation Fee",
        amount: 30,
        badge: "One-Time",
        badgeTone: "purple",
        variant: "warning",
        category: "fee",
        warningTitle: "Unusual Charge Detected",
        warningDetail: "One-time activation fee added this month",
      },
      {
        id: "overage",
        title: "Data Overage 2GB",
        amount: 20,
        badge: "Overage",
        badgeTone: "orange",
        variant: "warning",
        category: "overage",
        warningTitle: "Unusual Charge Detected",
        warningDetail: "You exceeded your data limit by 2GB",
      },
      {
        id: "taxes",
        title: "Taxes & Fees",
        amount: 8.5,
        badge: "Tax",
        badgeTone: "gray",
        variant: "default",
        category: "tax",
      },
    ],
  },
  "789012": {
    profile: {
      name: "Michael Chen",
      plan: "Start Unlimited",
      address: "100 Market St, San Francisco, CA",
      dueDateLabel: "April 12, 2026",
    },
    billMonth: "March 2026",
    lastMonthTotal: 62.0,
    dataUsage: { usedGb: 4.1, totalGb: 10, overageMessage: "" },
    chargeLineItems: [
      {
        id: "plan",
        title: "Start Unlimited Plan",
        amount: 55,
        badge: "Recurring",
        badgeTone: "blue",
        variant: "default",
        category: "service",
      },
      {
        id: "taxes",
        title: "Taxes & Fees",
        amount: 7.25,
        badge: "Tax",
        badgeTone: "gray",
        variant: "default",
        category: "tax",
      },
    ],
  },
  "345678": {
    profile: {
      name: "Emily Rodriguez",
      plan: "Play Unlimited",
      address: "45 Oak Lane, Austin, TX",
      dueDateLabel: "April 18, 2026",
    },
    billMonth: "March 2026",
    lastMonthTotal: 88.0,
    dataUsage: { usedGb: 21.5, totalGb: 20, overageMessage: "You exceeded your data limit by 1.5GB" },
    chargeLineItems: [
      {
        id: "plan",
        title: "Play Unlimited Plan",
        amount: 65,
        badge: "Recurring",
        badgeTone: "blue",
        variant: "default",
        category: "service",
      },
      {
        id: "overage",
        title: "Data Overage 1.5GB",
        amount: 15,
        badge: "Overage",
        badgeTone: "orange",
        variant: "warning",
        category: "overage",
        warningTitle: "Unusual Charge Detected",
        warningDetail: "You exceeded your data limit by 1.5GB",
      },
      {
        id: "taxes",
        title: "Taxes & Fees",
        amount: 9.2,
        badge: "Tax",
        badgeTone: "gray",
        variant: "default",
        category: "tax",
      },
    ],
  },
  "901234": {
    profile: {
      name: "James Wilson",
      plan: "Get Unlimited",
      address: "9 Canal St, Boston, MA",
      dueDateLabel: "April 10, 2026",
    },
    billMonth: "March 2026",
    lastMonthTotal: 71.25,
    dataUsage: { usedGb: 9.8, totalGb: 10, overageMessage: "" },
    chargeLineItems: [
      {
        id: "plan",
        title: "Get Unlimited Plan",
        amount: 70,
        badge: "Recurring",
        badgeTone: "blue",
        variant: "default",
        category: "service",
      },
      {
        id: "intl",
        title: "International Day Pass",
        amount: 12,
        badge: "One-Time",
        badgeTone: "purple",
        variant: "warning",
        category: "fee",
        warningTitle: "Unusual Charge Detected",
        warningDetail: "International roaming add-on from a recent trip",
      },
      {
        id: "taxes",
        title: "Taxes & Fees",
        amount: 11.5,
        badge: "Tax",
        badgeTone: "gray",
        variant: "default",
        category: "tax",
      },
    ],
  },
};

export function validateLogin(accountNumber, pin) {
  const row = DEMO_USERS[accountNumber];
  if (!row || String(pin) !== row.pin) return null;
  const t = ACCOUNT_TEMPLATES[accountNumber];
  return { accountNumber, name: t.profile.name };
}

export function getTemplate(accountNumber) {
  return ACCOUNT_TEMPLATES[accountNumber] || null;
}
