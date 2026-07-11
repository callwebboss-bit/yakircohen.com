import { redirect } from "next/navigation";

/** כתובת קנונית: חנות / ציוד יד שנייה */
export default function UsedGearRedirectPage() {
  redirect("/shop#used-gear");
}
