/**
 * בדיקת תאימות BPM ו-Camelot לרעיונות מאשאפ.
 * גלגל Camelot: מספר 1–12, A = minor, B = major.
 */

export type MashupHarmonyRelation =
  | "same_key"
  | "relative"
  | "adjacent"
  | "parallel"
  | "half_time"
  | "pitch_shift";

export type MashupTrackMeta = {
  bpm: number;
  keyCamelot: string;
  keyName?: string;
};

export type MashupHarmony = {
  relation: MashupHarmonyRelation;
  targetBpm: number;
  pitchSemitones?: number;
  note: string;
};

export type MashupMusic = {
  trackA: MashupTrackMeta;
  trackB: MashupTrackMeta;
  harmony: MashupHarmony;
};

export type MashupYoutubeDemo = {
  videoId: string;
  label: string;
  source: "yakir" | "reference";
};

export type CompatibilityLevel = "גבוהה" | "בינונית" | "דרוג+";

const CAMELOT_ORDER = [
  "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B",
  "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B", "11A", "11B", "12A", "12B",
] as const;

function parseCamelot(key: string): { num: number; letter: "A" | "B" } | null {
  const m = key.trim().match(/^(\d{1,2})([AB])$/i);
  if (!m) return null;
  const num = Number(m[1]);
  if (num < 1 || num > 12) return null;
  return { num, letter: m[2]!.toUpperCase() as "A" | "B" };
}

export function getCamelotDistance(a: string, b: string): number {
  const pa = parseCamelot(a);
  const pb = parseCamelot(b);
  if (!pa || !pb) return 99;
  if (pa.num === pb.num && pa.letter === pb.letter) return 0;
  if (pa.num === pb.num) return 1;
  const ia = CAMELOT_ORDER.indexOf(`${pa.num}${pa.letter}` as (typeof CAMELOT_ORDER)[number]);
  const ib = CAMELOT_ORDER.indexOf(`${pb.num}${pb.letter}` as (typeof CAMELOT_ORDER)[number]);
  if (ia < 0 || ib < 0) return 99;
  const direct = Math.abs(ia - ib);
  return Math.min(direct, CAMELOT_ORDER.length - direct);
}

export function isBpmCompatible(
  a: number,
  b: number,
  tolerance = 0.06,
): boolean {
  if (a <= 0 || b <= 0) return false;
  const ratio = a / b;
  if (Math.abs(ratio - 1) <= tolerance) return true;
  if (Math.abs(ratio - 2) <= tolerance || Math.abs(ratio - 0.5) <= tolerance) return true;
  return false;
}

export function inferHarmonyRelation(
  trackA: MashupTrackMeta,
  trackB: MashupTrackMeta,
): MashupHarmony {
  const dist = getCamelotDistance(trackA.keyCamelot, trackB.keyCamelot);
  const sameBpm = isBpmCompatible(trackA.bpm, trackB.bpm);
  const halfTime =
    Math.abs(trackA.bpm / trackB.bpm - 2) < 0.08 ||
    Math.abs(trackA.bpm / trackB.bpm - 0.5) < 0.08;
  const targetBpm = sameBpm
    ? Math.round((trackA.bpm + trackB.bpm) / 2)
    : halfTime
      ? Math.max(trackA.bpm, trackB.bpm)
      : Math.round((trackA.bpm + trackB.bpm) / 2);

  if (dist === 0 && sameBpm) {
    return {
      relation: "same_key",
      targetBpm,
      note: "אותו סולם ואותו קצב - מיזוג ישיר, מינימום pitch.",
    };
  }
  if (dist === 1 && trackA.keyCamelot.slice(0, -1) === trackB.keyCamelot.slice(0, -1)) {
    return {
      relation: "relative",
      targetBpm,
      note: "מז'ור/מינור יחסיים - מעבר הרמוני טבעי, אנרגיה עולה או יורדת בלי להרוס.",
    };
  }
  if (dist <= 1 && sameBpm) {
    return {
      relation: "adjacent",
      targetBpm,
      note: "סולמות סמוכים על גלגל Camelot. עובד טוב עם מעבר של 4-8 תיבות.",
    };
  }
  if (halfTime) {
    return {
      relation: "half_time",
      targetBpm,
      note: "יחס כפול/חצי בקצב - צריך לבחור איזה שיר מוביל את הגריד.",
    };
  }
  if (dist >= 2) {
    return {
      relation: "parallel",
      targetBpm,
      pitchSemitones: dist <= 3 ? 2 : undefined,
      note: "מודולציה מודעת - לא sync ולתקווה. עריכה באולפן.",
    };
  }
  return {
    relation: "pitch_shift",
    targetBpm,
    pitchSemitones: 1,
    note: "pitch קטן על אחד השירים - בדרך כלל מספיק.",
  };
}

export function getCompatibilityLevel(music: MashupMusic): CompatibilityLevel {
  const dist = getCamelotDistance(music.trackA.keyCamelot, music.trackB.keyCamelot);
  const bpmOk = isBpmCompatible(music.trackA.bpm, music.trackB.bpm);
  const rel = music.harmony.relation;

  if (
    (dist <= 1 && bpmOk) ||
    rel === "same_key" ||
    rel === "relative" ||
    rel === "adjacent"
  ) {
    return "גבוהה";
  }
  if (rel === "half_time" || rel === "pitch_shift" || dist === 2) {
    return "בינונית";
  }
  return "דרוג+";
}

export function formatMusicLine(music: MashupMusic): string {
  const { trackA, trackB, harmony } = music;
  const keys =
    trackA.keyCamelot === trackB.keyCamelot
      ? trackA.keyCamelot
      : `${trackA.keyCamelot} ל-${trackB.keyCamelot}`;
  const bpm =
    trackA.bpm === trackB.bpm
      ? `${harmony.targetBpm}`
      : `${trackA.bpm}/${trackB.bpm} ל-${harmony.targetBpm}`;
  return `${bpm} BPM · ${keys}`;
}

export function validateMashupMusic(music: MashupMusic): {
  ok: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  if (!parseCamelot(music.trackA.keyCamelot)) {
    warnings.push(`סולם A לא תקין: ${music.trackA.keyCamelot}`);
  }
  if (!parseCamelot(music.trackB.keyCamelot)) {
    warnings.push(`סולם B לא תקין: ${music.trackB.keyCamelot}`);
  }
  if (music.trackA.bpm < 60 || music.trackB.bpm < 60) {
    warnings.push("BPM נמוך מדי - בדוק half-time");
  }
  const level = getCompatibilityLevel(music);
  if (level === "דרוג+") {
    warnings.push("תאימות נמוכה - מומלץ דרוג+ או עריכה מלאה");
  }
  return { ok: warnings.length === 0, warnings };
}
