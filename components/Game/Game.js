import { useRef, useState, useEffect, useCallback } from "react";
import { initGame } from "@/components/Game/initGame";
import "./modal.css"

export default function Game() {
  const parentEl = useRef(null);
  const [game, setGame] = useState(null);
  const [modalData, setModalData] = useState()

  const onClose = useCallback(() => {
    setModalData()
  }, [])

  useEffect(() => {
    if (!parentEl.current) return;

    const newGame = initGame({
      parent: parentEl.current,
      width: parentEl.current.offsetWidth,
      height: parentEl.current.offsetHeight,
      setModalData,
    });

    setGame(newGame);

    return () => {
      newGame?.destroy(true, true);
    };
  }, []);

  return (
    <>
      <div ref={parentEl} className="w-[800px] h-[800px]" />
      {!!modalData && (
        <div className="modal">
          <div className="modal-content">
            <div className="space-y-2">
              <p className="text-2xl modal-title">{modalData.title}</p>
              <img
                className="modal-img"
                src={modalData.img}
                alt={modalData.title}
              />

              <p className="modal-text">{modalData.description}</p>
            </div>
            <button className="block" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
