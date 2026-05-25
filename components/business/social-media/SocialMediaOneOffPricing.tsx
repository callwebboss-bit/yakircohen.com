import { ONE_OFF_SERVICES, SOCIAL_MEDIA_BRAND } from "@/lib/data/social-media";
import { buildServiceWhatsAppText, buildWhatsAppHref } from "@/lib/whatsapp";

export default function SocialMediaOneOffPricing() {
  return (
    <section aria-labelledby="social-oneoff-heading">
      <header className="mx-auto max-w-2xl">
        <h2
          id="social-oneoff-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          מחירון שירות חד פעמי
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          ללא ריטיינר - עריכה, צילום, בנק סרטונים וייעוץ עם {SOCIAL_MEDIA_BRAND}.
        </p>
      </header>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-right">
              <th className="px-4 py-3 font-semibold text-foreground">שירות</th>
              <th className="px-4 py-3 font-semibold text-foreground">מחיר</th>
              <th className="hidden px-4 py-3 font-semibold text-foreground md:table-cell">
                פרטים
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">
                <span className="sr-only">פעולה</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ONE_OFF_SERVICES.map((row) => {
              const whatsappHref = buildWhatsAppHref({
                text: buildServiceWhatsAppText(`${row.name} - ${SOCIAL_MEDIA_BRAND}`),
                utm_campaign: row.utmCampaign,
              });

              return (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-4 align-top">
                    <span className="font-medium text-foreground">{row.name}</span>
                    {row.priceNote ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground md:hidden">
                        {row.priceNote}
                      </span>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground md:hidden">
                      {row.description}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top font-bold text-brand-red">
                    {row.priceLabel}
                    {row.priceNote ? (
                      <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                        {row.priceNote}
                      </span>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-4 align-top text-muted-foreground md:table-cell">
                    {row.description}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap text-sm font-semibold text-brand-red hover:underline"
                    >
                      וואטסאפ
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
