/**
 * Stop an in-progress locked build and any orphan `next build` node processes.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const LOCK_PATH = path.join(process.cwd(), ".next", "build.lock");

function stopLockedBuild() {
  if (!fs.existsSync(LOCK_PATH)) {
    console.log("[build-stop] No lock file.");
    return;
  }
  try {
    const { pid } = JSON.parse(fs.readFileSync(LOCK_PATH, "utf8"));
    if (pid) {
      try {
        process.kill(pid, "SIGTERM");
        console.log(`[build-stop] Sent SIGTERM to lock holder pid ${pid}`);
      } catch {
        console.log(`[build-stop] Lock holder pid ${pid} not running.`);
      }
    }
  } catch {
    /* ignore */
  }
  try {
    fs.unlinkSync(LOCK_PATH);
    console.log("[build-stop] Removed build lock.");
  } catch {
    /* ignore */
  }
}

function stopOrphanNextBuilds() {
  if (process.platform === "win32") {
    const script = [
      "$procs = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'next.*build' }",
      "$procs | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }",
    ].join("; ");
    try {
      execSync(
        `powershell -NoProfile -NonInteractive -EncodedCommand ${Buffer.from(script, "utf16le").toString("base64")}`,
        { stdio: "pipe" },
      );
    } catch {
      /* no matches */
    }
    return;
  }
  try {
    execSync("pkill -f 'next build' || true", { stdio: "inherit", shell: true });
  } catch {
    /* ignore */
  }
}

stopLockedBuild();
stopOrphanNextBuilds();
console.log("[build-stop] Done.");
