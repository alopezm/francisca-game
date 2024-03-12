import { useRef, useState, useEffect, useCallback } from "react";
import { GameConfig, initGame } from "@/components/Game/initGame";
import "./game.css"

export default function Game() {
  const parentEl = useRef(null);
  const [game, setGame] = useState(null);
  const [modalData, setModalData] = useState()

  const openModal = useCallback((startId) => {
    const startData = GameConfig.stars[startId]?.data;
    if (!startData) return

    GameConfig.pauseMovement();
    setModalData(startData);
  }, []);

  const onCloseModal = useCallback(() => {
    GameConfig.startMovement()
    setModalData()
  }, [])

  useEffect(() => {
    if (!parentEl.current) return;

    GameConfig.openModal = openModal;
    GameConfig.width = parentEl.current.offsetWidth;
    GameConfig.height = parentEl.current.offsetHeight;

    const newGame = initGame({parent: parentEl.current});

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
                height="300"
              />

              <p className="modal-text">{modalData.description}</p>
            </div>
            <button className="block" onClick={onCloseModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
