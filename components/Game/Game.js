import { useRef, useState, useEffect, useCallback } from "react";
import "./game.css";
import { initGame } from "./initGame";
import { GameConfig } from "./GameConfig";
import { COLLECTABLES } from "./scenes/BerlinScene/BerlinScene.collectables";

export default function Game() {
  const parentEl = useRef(null);
  const [modalData, setModalData] = useState();

  const openModal = useCallback((index) => {
    const modal = COLLECTABLES[index]?.modal;
    if (!modal) return;
    GameConfig.pauseMovement();
    setModalData(modal);
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

  useEffect(() => {
    function closeModalOnPressEnter(e) {
      if (e.key === "Enter") onCloseModal();
    }
    document.addEventListener("keydown", closeModalOnPressEnter);

    return () => {
      document.removeEventListener("keydown", closeModalOnPressEnter);
    };
  }, [onCloseModal]);

  return (
    <>
      <div ref={parentEl} />

      {!!modalData && (
        <div className="modal">
          <div className="modal-content">
            <div className="space-y-2">
              <p className="text-2xl text-bold modal-title">
                {modalData.title}
              </p>
              <img
                className="modal-img"
                src={modalData.img}
                alt={modalData.title}
                height="200"
              />

              <p className="modal-text py-4">{modalData.description}</p>
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
