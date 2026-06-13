import { TARGET_AUDIENCES } from "@/lib/data/reel-factory";

export default function ReelFactoryAudienceGrid() {
  return (
    <section aria-labelledby="reel-audience-heading">
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id="reel-audience-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          למי זה מתאים?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          ספקי אירועים שצריכים תוכן שמביא את הלקוח הבא - בלי לשבת על עריכה.
        </p>
      </header>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TARGET_AUDIENCES.map((item) => (
          <li
            key={item.title}
            className="flex flex-col rounded-2xl border border-border bg-background p-5"
          >
            <span className="text-2xl" aria-hidden>
              {item.icon}
            </span>
            <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
