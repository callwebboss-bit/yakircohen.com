import { redirect } from "next/navigation";

/** כתובת קנונית: חנות / שוברים */
export default function VoucherRedirectPage() {
  redirect("/shop#vouchers");
}
