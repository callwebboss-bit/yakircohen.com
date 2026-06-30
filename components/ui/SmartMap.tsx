"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type SmartMapProps = {
  address: string;
  googleMapsUrl: string;
  thumbnailUrl?: string;
  className?: string;
};

export default function SmartMap({
  address,
  googleMapsUrl,
  thumbnailUrl,
  className = "",
}: SmartMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (isLoaded || isInView) {
    return (
      <div
        ref={ref}
        className={`w-full overflow-hidden rounded-2xl shadow-md ${className}`}
        style={{ height: "24rem" }}
      >
        <iframe
          src={googleMapsUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`מפת מיקום - ${address}`}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-md ${className}`}
      style={{ height: "24rem" }}
      onClick={() => setIsLoaded(true)}
      onKeyDown={(e) => e.key === "Enter" && setIsLoaded(true)}
      role="button"
      tabIndex={0}
      aria-label={`טען מפה עבור ${address}`}
    >
      {/* Background */}
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={`תמונת מפה - ${address}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-border">
          {/* MapPin placeholder */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-muted-foreground"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform hover:scale-110">
          {/* Play triangle */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-foreground"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>

      {/* Address pill */}
      <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/90 px-4 py-3 backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">{address}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          לחצו לטעינת המפה המלאה
        </p>
      </div>
    </div>
  );
}
