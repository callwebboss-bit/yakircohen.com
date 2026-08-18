"use client";

import { cn } from "@/lib/utils";
import {
  getSoundProofProfileById,
  type SoundProofProfileId,
} from "@/lib/data/sound-proof-metrics";

type Props = {
  profileId: SoundProofProfileId;
  density?: "full" | "compact";
  className?: string;
};

export default function SoundProofTable({
  profileId,
  density = "full",
  className,
}: Props) {
  const profile = getSoundProofProfileById(profileId);
  const rows =
    density === "compact" ? profile.rows.slice(0, 3) : profile.rows;

  return (
    <div className={cn("rounded-xl border border-border bg-background", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] text-right text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-3 py-3 font-semibold text-foreground" scope="col">
                מדד
              </th>
              <th
                className="px-3 py-3 font-semibold text-muted-foreground"
                scope="col"
              >
                לפני השירות
              </th>
              <th className="px-3 py-3 font-semibold text-brand-red" scope="col">
                אחרי השירות
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.metric}
                className="border-b border-border/60 align-top last:border-0"
              >
                <th
                  scope="row"
                  className="px-3 py-3 font-medium text-foreground"
                >
                  {row.metric}
                </th>
                <td className="px-3 py-3 text-muted-foreground">{row.before}</td>
                <td className="px-3 py-3 font-medium text-foreground">{row.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {profile.note ? (
        <p className="border-t border-border px-3 py-2 text-[0.7rem] leading-relaxed text-muted-foreground">
          {profile.note}
        </p>
      ) : null}
    </div>
  );
}
