"use client";

import dynamic from "next/dynamic";

const SessionRescuerBar = dynamic(() => import("./SessionRescuerBar"), {
  ssr: false,
});

export default function SessionRescuerBarLazy() {
  return <SessionRescuerBar />;
}
