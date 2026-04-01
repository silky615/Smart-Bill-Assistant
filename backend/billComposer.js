import { getTemplate } from "./accountTemplates.js";

/**
 * @typedef {object} AccountTemplate
 * @property {{ name: string; plan: string; address: string; dueDateLabel: string }} profile
 * @property {string} billMonth
 * @property {number} lastMonthTotal
 * @property {{ usedGb: number; totalGb: number; overageMessage: string }} dataUsage
 * @property {Array<{
 *   id: string;
 *   title: string;
 *   amount: number;
 *   badge: string;
 *   badgeTone: string;
 *   variant: string;
 *   category: string;
 *   warningTitle?: string;
 *   warningDetail?: string;
 * }>} chargeLineItems
 */

function roundMoney(n) {
  return Math.round(n * 100) / 100;
}

function formatMoney(n) {
  return `$${roundMoney(n).toFixed(2)}`;
}

/**
 * Dashboard data-usage caption from measured use only (overage line items handled separately).
 */
export function computeDataUsageNarrative(usedGb, totalGb) {
  const ratio = totalGb > 0 ? usedGb / totalGb : 0;
  if (usedGb > totalGb + 0.001) {
    return "You've exceeded your plan data; overage charges may apply.";
  }
  if (ratio >= 0.95) return "You're running low on high-speed data this cycle.";
  if (ratio >= 0.85) return "You still have data left, but you're nearing your limit.";
  return "You have plenty of data remaining.";
}

function computeComparisonFootnote(difference) {
  const d = roundMoney(difference);
  if (d === 0) return "Your bill is unchanged from last month.";
  if (d > 0) return `Your bill increased by ${formatMoney(d)} this month.`;
  return `Your bill decreased by ${formatMoney(Math.abs(d))} this month.`;
}

function buildAlertBanner(unusualCount) {
  if (unusualCount <= 0) {
    return {
      title: "No unusual charges",
      body: "We did not flag any unusual one-time or overage charges this month.",
      actionLabel: "View Details",
    };
  }
  return {
    title: "Unusual charges detected",
    body: `We found ${unusualCount} unusual charge(s) on your bill this month.`,
    actionLabel: "View Details",
  };
}

/**
 * @param {string} accountNumber
 * @param {{ paidBillMonths?: string[] }} [billingState]
 */
export function composeBillBundle(accountNumber, billingState = {}) {
  const template = getTemplate(accountNumber);
  if (!template) return null;

  const items = template.chargeLineItems.map((c) => ({ ...c }));
  const taxes = roundMoney(items.filter((c) => c.category === "tax").reduce((s, c) => s + c.amount, 0));
  const subtotal = roundMoney(
    items.filter((c) => c.category !== "tax").reduce((s, c) => s + c.amount, 0)
  );
  const current = roundMoney(subtotal + taxes);

  const lastMonth = roundMoney(template.lastMonthTotal);
  const difference = roundMoney(current - lastMonth);

  const unusual = items.filter((c) => c.variant === "warning");
  const unusualChargesCount = unusual.length;

  const hasOverageLine = items.some((c) => c.category === "overage");

  const dataNote = computeDataUsageNarrative(template.dataUsage.usedGb, template.dataUsage.totalGb);

  const overageBanner =
    template.dataUsage.overageMessage?.trim() ||
    (hasOverageLine
      ? unusual.find((c) => c.category === "overage")?.warningDetail || "Data overage detected on this bill."
      : "");

  const paidForCycle = billingState.paidBillMonths?.includes(template.billMonth) ?? false;

  const charges = items.map(
    ({ category: _cat, ...rest }) => rest
  );

  return {
    profile: {
      name: template.profile.name,
      accountNumber,
      plan: template.profile.plan,
      address: template.profile.address,
      dueDate: template.profile.dueDateLabel,
    },
    billMonth: template.billMonth,
    totals: {
      current,
      lastMonth,
      difference,
      subtotal,
      taxes,
    },
    comparisonFootnote: computeComparisonFootnote(difference),
    dataUsage: {
      usedGb: template.dataUsage.usedGb,
      totalGb: template.dataUsage.totalGb,
      note: dataNote,
      overageBanner,
    },
    unusualChargesCount,
    alertBanner: buildAlertBanner(unusualChargesCount),
    charges,
    billing: {
      billMonth: template.billMonth,
      isPaid: paidForCycle,
    },
  };
}

export function defaultSummaryBullets(bundle, language) {
  const unusualTitles =
    bundle.charges.filter((c) => c.variant === "warning").map((c) => c.title) || [];
  const unusualList = unusualTitles.length ? unusualTitles.join(", ") : "none";

  if (language === "es") {
    return [
      `Tu factura total de ${bundle.billMonth} es ${formatMoney(bundle.totals.current)}, una diferencia de ${formatMoney(
        Math.abs(bundle.totals.difference)
      )} respecto al mes pasado (${bundle.totals.difference >= 0 ? "más" : "menos"}).`,
      `Cargos inusuales detectados: ${unusualList}.`,
      `Uso de datos: ${bundle.dataUsage.usedGb}GB de ${bundle.dataUsage.totalGb}GB (${bundle.dataUsage.note})`,
    ];
  }
  return [
    `Your total bill for ${bundle.billMonth} is ${formatMoney(bundle.totals.current)}, which is ${formatMoney(
      Math.abs(bundle.totals.difference)
    )} ${bundle.totals.difference >= 0 ? "more" : "less"} than last month.`,
    `Unusual or one-time charges this cycle: ${unusualList}.`,
    `You're using ${bundle.dataUsage.usedGb}GB of your ${bundle.dataUsage.totalGb}GB allowance — ${bundle.dataUsage.note}`,
  ];
}
