import NextImage, { type ImageProps } from "next/image";

/**
 * Wrapper סביב next/image שאוכף:
 * 1. alt תמיד נדרש (string - לא undefined, לא optional).
 * 2. חייב להיות אחד משניים: fill=true OR width+height מפורשים.
 *
 * לתמונות דקורטיביות שלא צריכות alt: הגדירו alt="" עם aria-hidden={true}.
 *
 * שימוש:
 *   <AppImage src="/..." alt="תיאור" fill />
 *   <AppImage src="/..." alt="תיאור" width={800} height={600} />
 *   <AppImage src="/..." alt="" aria-hidden fill />  <- דקורטיבי
 */

type FillMode = Omit<ImageProps, "fill" | "width" | "height"> & {
  fill: true;
  width?: never;
  height?: never;
};

type FixedMode = Omit<ImageProps, "fill" | "width" | "height"> & {
  fill?: false;
  width: number;
  height: number;
};

type AppImageProps = (FillMode | FixedMode) & {
  alt: string;
};

export default function AppImage(props: AppImageProps) {
  if (process.env.NODE_ENV === "development" && !props.alt && !props["aria-hidden"]) {
    console.warn(
      `[AppImage] alt ריק ב-src="${String(props.src)}". הוסיפו alt תיאורי או aria-hidden={true} לתמונות דקורטיביות.`,
    );
  }

  return <NextImage {...(props as ImageProps)} />;
}
