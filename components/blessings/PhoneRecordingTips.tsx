import { PHONE_RECORDING_TIPS } from "@/lib/data/milestone-album";

export default function PhoneRecordingTips() {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {PHONE_RECORDING_TIPS.map((tip) => (
        <li
          key={tip.title}
          className="rounded-2xl border border-border bg-surface p-5"
        >
          <h3 className="text-base font-semibold text-foreground">{tip.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {tip.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
