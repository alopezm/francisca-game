import { useRef, useState, useEffect } from "react";
import { initGame } from "@/components/Game/initGame";

export default function Game() {
  const parentEl = useRef(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (!parentEl.current) return;

    const newGame = initGame({
      parent: parentEl.current,
      width: parentEl.current.offsetWidth,
      height: parentEl.current.offsetHeight,
    });

    setGame(newGame);

    return () => {
      newGame?.destroy(true, true);
    };
  }, []);

  return <div ref={parentEl} className="w-[800px] h-[800px]" />;
}
