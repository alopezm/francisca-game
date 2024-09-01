"use client";
import dynamic from "next/dynamic";

const GameWithNoSSR = dynamic(() => import("@/components/Game/Game"), {
  ssr: false,
});

export default GameWithNoSSR;
