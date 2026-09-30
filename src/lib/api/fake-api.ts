export class FakeApiError extends Error {
  constructor(message = "Não foi possível carregar os dados agora.") {
    super(message);
    this.name = "FakeApiError";
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

interface FakeLatencyOptions {
  minMs?: number;
  maxMs?: number;
  /** 0..1 probability of throwing a FakeApiError, simulating a flaky backend. */
  errorRate?: number;
}

/**
 * Wraps a synchronous mock-data producer with artificial network latency and
 * an optional random failure rate. This is what justifies every loading
 * skeleton and error state in the dashboard actually being exercised, rather
 * than existing as markup nobody ever sees.
 *
 * The latency/error simulation itself is intentionally non-deterministic
 * (real `Math.random()`) — only the underlying mock *data* is seeded, so
 * re-fetching the same range doesn't reshuffle numbers, but does re-roll
 * whether this particular fetch is slow or fails.
 */
export async function withFakeLatency<T>(
  produce: () => T,
  { minMs = 400, maxMs = 1100, errorRate = 0 }: FakeLatencyOptions = {}
): Promise<T> {
  await delay(randomBetween(minMs, maxMs));
  if (errorRate > 0 && Math.random() < errorRate) {
    throw new FakeApiError();
  }
  return produce();
}

/**
 * Reads the debug-only `?__fail=<key>` query flag (e.g. `?__fail=metrics`)
 * used to force a specific section's next fetch to error, so the error state
 * can be demoed on demand without reaching for devtools.
 */
export function shouldForceFail(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string
): boolean {
  const value = searchParams?.__fail;
  if (Array.isArray(value)) return value.includes(key) || value.includes("all");
  return value === key || value === "all";
}
