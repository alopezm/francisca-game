"use client";
import React from "react";
import dynamic from "next/dynamic";

const GameWithNoSSR = dynamic(() => import("@/components/Game/Game"), {
  ssr: false,
});

export default function Page() {
  return (
    <main>
      <GameWithNoSSR />
    </main>
  );
}
