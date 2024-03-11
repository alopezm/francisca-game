"use client";
import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const GameWithNoSSR = dynamic(() => import("@/components/Game/Game"), {
  ssr: false,
});

export default function Page() {
  return (
    <main>
      <Head>
        <title>Francisca Game</title>
      </Head>
      <GameWithNoSSR />
    </main>
  );
}
