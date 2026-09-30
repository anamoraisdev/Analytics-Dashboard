/**
 * Deterministic PRNG (mulberry32). Given the same seed it always produces
 * the same sequence, which is what lets the mock data reproduce consistently
 * for a given date range/key instead of reshuffling on every re-render.
 */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hashes an arbitrary string into a 32-bit int usable as a PRNG seed. */
export function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

/** Convenience: build a seeded random generator directly from a string key. */
export function createRandom(seedKey: string): () => number {
  return mulberry32(hashSeed(seedKey));
}

export function randomInRange(random: () => number, min: number, max: number): number {
  return min + random() * (max - min);
}

export function randomInt(random: () => number, min: number, max: number): number {
  return Math.floor(randomInRange(random, min, max + 1));
}

export function pick<T>(random: () => number, items: readonly T[]): T {
  const item = items[Math.floor(random() * items.length)];
  if (item === undefined) {
    throw new Error("pick() called with an empty array");
  }
  return item;
}
