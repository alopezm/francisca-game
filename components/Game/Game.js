import { useRef, useState, useEffect, useCallback } from "react";
import "./game.css";
import { initGame } from "./initGame";
import { GameConfig } from "./GameConfig";
import { COLLECTABLES } from "./scenes/BerlinScene/BerlinScene.collectables";

export default function Game() {
  const parentEl = useRef(null);
  const [modalData, setModalData] = useState();

  const openModal = useCallback((index) => {
    const data = COLLECTABLES[index]?.data;
    if (!data) return;

    GameConfig.pauseMovement();
    setModalData(data);
  }, []);

  const onCloseModal = useCallback(() => {
    GameConfig.startMovement();
    setModalData();
  }, []);

  useEffect(() => {
    if (!parentEl.current) return;

    GameConfig.openModal = openModal;

    const game = initGame({ parent: parentEl.current });

    return () => {
      game?.destroy(true, true);
    };
  }, []);

  return (
    <>
      <div ref={parentEl} />

      {!!modalData && (
        <div className="modal">
          <div className="modal-content">
            <div className="space-y-2">
              <p className="text-2xl modal-title">{modalData.title}</p>
              <img
                className="modal-img"
                src={modalData.img}
                alt={modalData.title}
                height="200"
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
