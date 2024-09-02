"use client";
import { useRouter } from "next/navigation";

const BTN_CLASS_NAME = "block text-5xl hover:animate-pulse bg-black border border-white px-8 py-4 text-white";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center h-[100vh]"
      style={{
        backgroundImage: "url(/assets/benjamin.png)",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center space-y-8">
        <button className={BTN_CLASS_NAME} onClick={() => router.push("/game")}>
          Empezar
        </button>

        <a
          className={BTN_CLASS_NAME}
          href="/pdf/bibliography.pdf"
          target="_blank noreferrer"
        >
          Documentación
        </a>
      </div>
    </div>
  );
}
