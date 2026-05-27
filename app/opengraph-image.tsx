import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${SITE_NAME} - אולפן, פודקאסט ואירועים במודיעין`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background: "#FAFAF8",
          fontFamily: "sans-serif",
          direction: "rtl",
        }}
      >
        <div
          style={{
            width: 120,
            height: 8,
            background: "#D42B2B",
            borderRadius: 4,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#1A1A1A",
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#525252",
            lineHeight: 1.45,
            maxWidth: 820,
          }}
        >
          אולפן הקלטות · פודקאסט · DJ ואטרקציות - מודיעין והמרכז
        </div>
      </div>
    ),
    { ...size },
  );
}

