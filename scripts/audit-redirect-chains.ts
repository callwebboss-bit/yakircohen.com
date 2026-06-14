/**
 * Find redirect chains (A -> B -> C) and duplicate sources in the legacy
 * redirect map, so they can be flattened to a single direct hop.
 * Run: npm run audit:redirects
 */
import { getLegacyRedirects } from "../lib/legacy-redirects";

const redirects = getLegacyRedirects();

/** Static (non-pattern) sources only - pattern rules use `:` segments. */
const staticEntries = redirects.filter((r) => !r.source.includes(":"));

const sourceToDestinations = new Map<string, string[]>();
for (const { source, destination } of staticEntries) {
  const list = sourceToDestinations.get(source) ?? [];
  list.push(destination);
  sourceToDestinations.set(source, list);
}

const destinationBySource = new Map<string, string>();
for (const { source, destination } of staticEntries) {
  if (!destinationBySource.has(source)) destinationBySource.set(source, destination);
}

// --- Duplicate sources (same path redirected twice, possibly differently) ---
const duplicates = [...sourceToDestinations.entries()].filter(
  ([, destinations]) => destinations.length > 1,
);

// --- Chains: source -> dest, where dest is itself a redirect source ---
type Chain = { source: string; hops: string[]; final: string };
const chains: Chain[] = [];

for (const { source, destination } of staticEntries) {
  if (!destinationBySource.has(destination) || destination === source) continue;

  const hops = [source];
  const seen = new Set([source]);
  let current = destination;
  while (destinationBySource.has(current) && !seen.has(current)) {
    hops.push(current);
    seen.add(current);
    current = destinationBySource.get(current)!;
  }
  hops.push(current);

  chains.push({ source, hops, final: current });
}

console.log(`STATIC_REDIRECTS: ${staticEntries.length}`);

console.log("\n=== Duplicate redirect sources ===\n");
if (duplicates.length === 0) {
  console.log("(none)");
} else {
  for (const [source, destinations] of duplicates) {
    console.log(`${source} -> ${destinations.join(" | ")}`);
  }
}

console.log("\n=== Redirect chains (fix: point source directly at the final destination) ===\n");
if (chains.length === 0) {
  console.log("(none)");
} else {
  for (const { source, hops, final } of chains) {
    console.log(`${hops.join(" -> ")}  (fix: ${source} -> ${final})`);
  }
}

if (duplicates.length > 0 || chains.length > 0) {
  process.exitCode = 1;
}
