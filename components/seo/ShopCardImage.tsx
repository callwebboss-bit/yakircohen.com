import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur";
import { cn } from "@/lib/utils";

type ShopCardImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  hoverScale?: boolean;
};

export default function ShopCardImage({
  src,
  alt,
  className,
  priority = false,
  hoverScale = false,
}: ShopCardImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden bg-neutral-100",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover",
          hoverScale &&
            "transition-transform duration-500 ease-luxury group-hover:scale-105",
        )}
        sizes="(max-width: 768px) 100vw, 33vw"
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      />
    </div>
  );
}
