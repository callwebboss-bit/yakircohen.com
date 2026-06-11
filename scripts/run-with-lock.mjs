/**
 * Run a command with an exclusive build lock (.next/build.lock).
 * Prevents multiple agents/shells from running next build in parallel.
 *
 * Usage:
 *   node scripts/run-with-lock.mjs next build
 *   node scripts/run-with-lock.mjs -- next build && npm run index:search
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const LOCK_PATH = path.join(process.cwd(), ".next", "build.lock");
const STALE_MS = 2 * 60 * 60 * 1000;

function isPidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readLock() {
  if (!fs.existsSync(LOCK_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(LOCK_PATH, "utf8"));
  } catch {
    return null;
  }
}

function acquireLock(commandLabel) {
  fs.mkdirSync(path.dirname(LOCK_PATH), { recursive: true });
  const existing = readLock();
  if (existing?.pid) {
    const age = Date.now() - (existing.startedAt ?? 0);
    if (isPidAlive(existing.pid) && age < STALE_MS) {
      console.error(
        `[build-lock] Build already running (pid ${existing.pid}, started ${new Date(existing.startedAt).toLocaleTimeString()}).`,
      );
      console.error("[build-lock] Wait for it to finish, or run: npm run build:stop");
      process.exit(1);
    }
    console.warn("[build-lock] Removing stale lock.");
  }
  fs.writeFileSync(
    LOCK_PATH,
    JSON.stringify({ pid: process.pid, startedAt: Date.now(), command: commandLabel }),
  );
}

function releaseLock() {
  const current = readLock();
  if (current?.pid === process.pid) {
    try {
      fs.unlinkSync(LOCK_PATH);
    } catch {
      /* ignore */
    }
  }
}

const argv = process.argv.slice(2);
if (argv.length === 0) {
  console.error("Usage: node scripts/run-with-lock.mjs [--] <command...>");
  process.exit(1);
}

const command =
  argv[0] === "--" ? argv.slice(1).join(" ") : argv.join(" ");

acquireLock(command);

const onSignal = (code) => {
  releaseLock();
  process.exit(code);
};

process.on("SIGINT", () => onSignal(130));
process.on("SIGTERM", () => onSignal(143));

const child = spawn(command, {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
  env: process.env,
});

child.on("exit", (code, signal) => {
  releaseLock();
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});

child.on("error", (err) => {
  releaseLock();
  console.error(err);
  process.exit(1);
});
