"use client";
import { useRouter } from "next/navigation";

const BTN_CLASS_NAME =
  "block text-5xl hover:animate-pulse bg-black border border-white px-8 py-4 text-white";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center h-[100vh]"
      style={{
        backgroundImage: "url(/assets/menu.png)",
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

      <div
        className="absolute bottom-0 left-0 px-4 py-4 w-full"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <div className="relative flex justify-between w-full">
          <a
            href="https://github.com/alopezm/francisca-game"
            target="_blank noreferrer"
            className="text-small opacity-40 hover:opacity-100"
          >
            Code
          </a>

          <p className="text-small opacity-40">
            Made with <span className="text-red-500">❤</span> in Medellín
          </p>
        </div>
      </div>
    </div>
  );
}
