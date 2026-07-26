# Service Fit Matrix

מקור האמת בקוד: [`lib/data/service-fit-matrix.ts`](../lib/data/service-fit-matrix.ts).

מטרה: קהל · delivery · guidance · outcome · next step — על **pathnames קיימים בלבד**.

## Consumers

| רכיב | תפקיד |
| --- | --- |
| `HubAudienceFitBlock` | האבים לפי קהל (`/studio` `/podcast` `/business` `/academy` `/events` `/online` `/voiceover`) |
| `ContextualIntroParagraph` → `ServiceFitSnapshot` | אינטרו בדפי שירות (אופט-אאוט באקדמיה / business tiers) |
| `getPageRelatedTrio` | `PageRelatedFooter` — עד 3 קישורים (next-up + decision-paths) |
| `getMobileDecisiveNav` | sticky + footer מובייל |

## Separation rules (TODO 5)

- Mobile ≠ in-studio ≠ on-site ≠ self-service
- Corporate podcast ≠ creator podcast
- GEO city pages stay GEO; physical studio is Modi’in
- קהל ראשי אחד; secondary רק כשמשפר בהירות

## Sample rows

| Pathname | Audience | Delivery | Guidance | Outcome | Next | Price |
| --- | --- | --- | --- | --- | --- | --- |
| `/studio/recording-song-modiin` | families | in_studio | full_production | ready_song | video-clip | 1200 |
| `/studio/mobile-studio` | families | mobile | full_production | ready_song | /pricing | 5000 |
| `/podcast/podcast-editing` | creators | self_service | assisted | podcast | recording | 750 |
| `/podcast/corporate-podcast` | business | in_studio | full_production | podcast | /business | 4800 |
| `/business/on-site-studio` | business | on_site | full_production | content day | /pricing | 6500 |
| `/online/legacy-digitization` | families | self_service | assisted | ready_song | blessings | 350 |
| `/events/dj-events` | families | on_site | full_production | ready_song | attractions | 5000 |
| `/photography/wedding` | families | on_site | full_production | video_clip | dj-events | 12000 |

הרשימה המלאה בקובץ ה-TS (`SERVICE_FIT_MATRIX`).
