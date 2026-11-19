"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  icon: string;
  name: string;
};

const inventoryItems: Record<string, Item> = {
  photo: {
    id: "photo",
    icon: "🖼️",
    name: "Fotografía de la Escuela N.º 14",
  },
  letter: {
    id: "letter",
    icon: "✉️",
    name: "Nota: 16 de agosto",
  },
  clock: {
    id: "clock",
    icon: "🕰️",
    name: "Año: 1916",
  },
};

export default function Home() {
  const [screen, setScreen] = useState<
    "start" | "intro" | "game" | "solved" | "chapters"
  >("start");

  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);
  const [showInventory, setShowInventory] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("misterio-cultural-progress");

    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.inventory) setInventory(data.inventory);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "misterio-cultural-progress",
      JSON.stringify({ inventory })
    );
  }, [inventory]);

  useEffect(() => {
    if (screen !== "game") return;

    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen]);

  function addItem(id: string) {
    setInventory((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  }

  function openObject(id: string) {
    setSelectedObject(id);

    if (["photo", "letter", "clock"].includes(id)) {
      addItem(id);
    }
  }

  function tryCode() {
    if (code === "16081916") {
      setError("");
      setSelectedObject(null);
      setScreen("solved");
    } else {
      setError("La cerradura no responde. Revisá las pistas.");
    }
  }

  function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const sec = (seconds % 60).toString().padStart(2, "0");

    return `${min}:${sec}`;
  }

  function resetGame() {
    localStorage.removeItem("misterio-cultural-progress");
    setInventory([]);
    setElapsed(0);
    setCode("");
    setHintLevel(0);
    setShowHint(false);
    setSelectedObject(null);
    setScreen("start");
  }

  const hints = [
    "Observá los objetos que puedan indicar cuándo empezó esta historia.",
    "Necesitás descubrir un día, un mes y un año.",
    "La combinación utiliza ocho números: DDMMYYYY.",
  ];

  return (
    <main className="game-app">

      {screen === "start" && (
        <section className="start-screen">
          <div className="start-overlay">
            <div className="tiny-label">CENTRO CULTURAL SIERRAS BAYAS</div>

            <div className="key-symbol">⌾</div>

            <h1>
              LA CASA
              <span>DE LAS HUELLAS</span>
            </h1>

            <p className="subtitle">
              El misterio del Centro Cultural Sierras Bayas
            </p>

            <div className="separator" />

            <p className="intro-phrase">
              Hay historias que todavía viven
              <br />
              entre estas paredes.
            </p>

            <button
              className="primary-button"
              onClick={() => setScreen("intro")}
            >
              COMENZAR
            </button>
          </div>
        </section>
      )}

      {screen === "intro" && (
        <section className="narrative-screen">
          <div className="old-envelope">
            <div className="wax">H</div>
          </div>

          <div className="narrative-card">
            <span className="chapter-small">UNA CARTA SIN FECHA</span>

            <p>
              Esta casa ha tenido muchos nombres.
            </p>

            <p>
              Fue cancha, salón, escenario, cine,
              refugio y lugar de encuentro.
            </p>

            <p className="important-text">
              Pero hay algo que nunca cambió.
            </p>

            <p>
              Si lográs descubrirlo,
              la casa volverá a recordar.
            </p>

            <button
              className="primary-button"
              onClick={() => setScreen("game")}
            >
              ENTRAR
            </button>
          </div>
        </section>
      )}

      {screen === "game" && (
        <section className="game-screen">
          <header className="game-header">
            <div>
              <span className="chapter-small">CAPÍTULO 1</span>
              <h2>EL SUEÑO</h2>
            </div>

            <div className="game-actions">
              <div className="timer">{formatTime(elapsed)}</div>

              <button
                className="icon-button"
                onClick={() => setShowHint(true)}
              >
                💡
              </button>

              <button
                className="icon-button"
                onClick={() => setShowInventory(true)}
              >
                🎒
                {inventory.length > 0 && (
                  <span className="badge">{inventory.length}</span>
                )}
              </button>
            </div>
          </header>

          <div className="mission">
            Descubrí cuándo comenzó esta historia y abrí la caja.
          </div>

          <div className="room">

            <div className="wall-text">
              SIERRAS BAYAS
              <small>
                Hay historias que comienzan
                con una reunión.
              </small>
            </div>

            <div className="window">
              <div className="mountains" />
            </div>

            <div className="desk">
              <button
                className="object photo-object"
                onClick={() => openObject("photo")}
                aria-label="Fotografía antigua"
              >
                <div className="fake-photo">
                  <div className="building-mini" />
                </div>
              </button>

              <button
                className="object letter-object"
                onClick={() => openObject("letter")}
                aria-label="Sobre antiguo"
              >
                ✉
              </button>

              <button
                className="object box-object"
                onClick={() => openObject("box")}
                aria-label="Caja cerrada"
              >
                <span>✦</span>
              </button>
            </div>

            <button
              className="object clock-object"
              onClick={() => openObject("clock")}
              aria-label="Reloj antiguo"
            >
              <span>12</span>
              <div className="clock-hands" />
            </button>

            <div className="room-bottom">
              TOCÁ LOS OBJETOS PARA INVESTIGAR
            </div>
          </div>
        </section>
      )}

      {screen === "solved" && (
        <section className="solved-screen">
          <div className="glow-symbol">✦</div>

          <span className="chapter-small">
            PRIMERA HUELLA RECUPERADA
          </span>

          <h2>SOÑAR</h2>

          <p>
            Antes del edificio, antes del salón
            y antes del Centro Cultural,
            hubo personas que imaginaron
            algo para su pueblo.
          </p>

          <button
            className="primary-button"
            onClick={() => setScreen("chapters")}
          >
            CONTINUAR
          </button>
        </section>
      )}

      {screen === "chapters" && (
        <section className="chapters-screen">
          <span className="chapter-small">
            LA CASA DE LAS HUELLAS
          </span>

          <h2>Tu investigación</h2>

          <div className="chapter-list">
            <div className="chapter-card completed">
              <span>01</span>
              <div>
                <strong>El sueño</strong>
                <small>HUELLA: SOÑAR</small>
              </div>
              <b>✓</b>
            </div>

            {[
              "La pelota",
              "El salón de las voces",
              "La memoria se mueve",
              "El renacer",
            ].map((name, index) => (
              <div className="chapter-card locked" key={name}>
                <span>0{index + 2}</span>

                <div>
                  <strong>{name}</strong>
                  <small>CAPÍTULO BLOQUEADO</small>
                </div>

                <b>🔒</b>
              </div>
            ))}
          </div>

          <button
            className="secondary-button"
            onClick={resetGame}
          >
            REINICIAR EXPERIENCIA
          </button>
        </section>
      )}

      {selectedObject && (
        <div className="modal-backdrop">
          <div className="object-modal">

            {selectedObject === "photo" && (
              <>
                <span className="chapter-small">FOTOGRAFÍA</span>

                <div className="large-photo">
                  <div className="old-school">
                    ESCUELA N.º 14
                  </div>
                </div>

                <h3>La escuela vieja</h3>

                <p>
                  Aquí se reunió el grupo de vecinos
                  que decidió constituir la institución.
                </p>
              </>
            )}

            {selectedObject === "letter" && (
              <>
                <span className="chapter-small">
                  DOCUMENTO
                </span>

                <div className="paper-note">
                  “El <strong>16 de agosto</strong>,
                  vecinos de Sierras Bayas
                  se reunieron para dar forma
                  a un nuevo proyecto
                  para la localidad.”
                </div>

                <p className="modal-hint">
                  Falta una parte de la fecha.
                </p>
              </>
            )}

            {selectedObject === "clock" && (
              <>
                <span className="chapter-small">
                  RELOJ DETENIDO
                </span>

                <div className="year-display">
                  1916
                </div>

                <p>
                  El mecanismo parece haberse
                  detenido en ese año.
                </p>
              </>
            )}

            {selectedObject === "box" && (
              <>
                <span className="chapter-small">
                  CAJA CERRADA
                </span>

                <h3>Ingresá la combinación</h3>

                <p className="modal-hint">
                  Día · Mes · Año
                </p>

                <input
                  className="code-input"
                  value={code}
                  maxLength={8}
                  inputMode="numeric"
                  placeholder="00000000"
                  onChange={(e) =>
                    setCode(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8)
                    )
                  }
                />

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <button
                  className="primary-button"
                  onClick={tryCode}
                >
                  ABRIR
                </button>
              </>
            )}

            <button
              className="close-button"
              onClick={() => {
                setSelectedObject(null);
                setError("");
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showInventory && (
        <div className="modal-backdrop">
          <div className="object-modal">

            <span className="chapter-small">
              INVENTARIO
            </span>

            <h3>Objetos encontrados</h3>

            <div className="inventory-list">

              {inventory.length === 0 && (
                <p className="modal-hint">
                  Todavía no encontraste ninguna pista.
                </p>
              )}

              {inventory.map((id) => {
                const item = inventoryItems[id];

                return (
                  <div className="inventory-item" key={id}>
                    <span>{item.icon}</span>
                    <p>{item.name}</p>
                  </div>
                );
              })}

            </div>

            <button
              className="close-button"
              onClick={() => setShowInventory(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showHint && (
        <div className="modal-backdrop">
          <div className="object-modal hint-modal">

            <span className="chapter-small">
              PISTA
            </span>

            <div className="hint-symbol">💡</div>

            <p>{hints[Math.min(hintLevel, 2)]}</p>

            <button
              className="primary-button"
              onClick={() => {
                setHintLevel((prev) =>
                  Math.min(prev + 1, 2)
                );
                setShowHint(false);
              }}
            >
              ENTENDIDO
            </button>

            <button
              className="close-button"
              onClick={() => setShowHint(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

    </main>
  );
}