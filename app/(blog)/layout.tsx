import { Noto_Serif_Hebrew } from "next/font/google";

const notoSerifHebrew = Noto_Serif_Hebrew({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-noto-serif-hebrew",
  weight: ["400", "500", "600", "700"],
});

export default function BlogRouteGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={notoSerifHebrew.variable}>{children}</div>;
}
