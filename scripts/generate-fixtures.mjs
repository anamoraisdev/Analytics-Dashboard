#!/usr/bin/env node
/**
 * Regenerates src/lib/api/mock-db/data/transactions.json — a static,
 * hand-tunable fixture of fake transactions, expressed as "days ago" (not
 * absolute dates) so the dataset always looks current no matter when the
 * app is viewed, and revenue/order metrics can be derived directly from it
 * instead of living as a disjoint random series.
 *
 * This is a one-off generator, not part of the running app: edit the
 * constants below and re-run to reshape the fixture.
 *
 *   node scripts/generate-fixtures.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../src/lib/api/mock-db/data/transactions.json");

const FIRST_NAMES = [
  "Ana", "Bruno", "Carla", "Diego", "Elisa", "Fábio", "Gabriela", "Hugo",
  "Isabela", "João", "Karina", "Lucas", "Mariana", "Nicolas", "Olivia",
  "Pedro", "Queila", "Rafael", "Sofia", "Thiago", "Vitor", "Yasmin",
  "Camila", "Rodrigo", "Beatriz",
];

const LAST_NAMES = [
  "Almeida", "Barros", "Costa", "Dias", "Esteves", "Ferreira", "Gomes",
  "Henriques", "Ibrahim", "Junqueira", "Lima", "Martins", "Nogueira",
  "Oliveira", "Pereira", "Queiroz", "Ramos", "Silva", "Teixeira", "Vieira",
  "Cardoso", "Moura",
];

const STATUS_WEIGHTS = [
  ["completed", 0.72],
  ["pending", 0.14],
  ["refunded", 0.08],
  ["failed", 0.06],
];

/** Fixed seed: the fixture is reproducible — only changes if this file changes and is re-run. */
function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20260101);

function pick(items) {
  return items[Math.floor(random() * items.length)];
}

function randomInt(min, max) {
  return Math.floor(min + random() * (max - min + 1));
}

function pickStatus() {
  const roll = random();
  let acc = 0;
  for (const [status, weight] of STATUS_WEIGHTS) {
    acc += weight;
    if (roll <= acc) return status;
  }
  return "completed";
}

function toEmailSlug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining accents: "João" -> "Joao"
    .toLowerCase();
}

function pickAmount() {
  const tierRoll = random();
  if (tierRoll < 0.78) return randomInt(4_900, 29_900); // R$49–299: everyday orders
  if (tierRoll < 0.97) return randomInt(29_900, 79_900); // R$299–799: mid-tier
  return randomInt(79_900, 159_900); // R$799–1.599: occasional big ticket, capped to avoid single-order spikes
}

// Covers 90d + the previous 90d, so the "vs. previous period" comparison has
// real data at the widest filter setting too.
const DAYS = 180;
const transactions = [];

for (let daysAgo = 0; daysAgo < DAYS; daysAgo++) {
  const isFixtureWeekend = daysAgo % 7 === 5 || daysAgo % 7 === 6;
  // Gentle upward trend as daysAgo -> 0 ("today"), so the revenue chart reads
  // as a growing business rather than flat noise. A high baseline count (vs.
  // a handful/day) keeps daily sums from being dominated by any single
  // big-ticket order — and the weekend dip is a moderate factor, not a
  // separate low range, so the chart reads as gentle weekly seasonality
  // rather than a sawtooth.
  const growth = 1 + ((DAYS - daysAgo) / DAYS) * 0.5;
  const weekendFactor = isFixtureWeekend ? 0.6 : 1;
  const base = randomInt(15, 23);
  const count = Math.max(1, Math.round(base * weekendFactor * growth));

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    transactions.push({
      daysAgo,
      customer: {
        name: `${firstName} ${lastName}`,
        email: `${toEmailSlug(firstName)}.${toEmailSlug(lastName)}@example.com`,
      },
      amount: pickAmount(),
      status: pickStatus(),
    });
  }
}

writeFileSync(OUTPUT_PATH, `${JSON.stringify(transactions, null, 2)}\n`);
console.log(`Wrote ${transactions.length} transactions (${DAYS} days) to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
