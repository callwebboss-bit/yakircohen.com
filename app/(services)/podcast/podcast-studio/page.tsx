import { redirect } from "next/navigation";

/** כתובת קנונית: השכרת סטודיו במודיעין (ראו lib/site-architecture.ts) */
export default function PodcastStudioRedirectPage() {
  redirect("/podcast/podcast-studio-modiin");
}
