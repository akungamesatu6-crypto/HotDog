import type { SausageSlot } from "../game/types";
import { getCookTime, getReadyWindow } from "../game/constants";
import type { Upgrade } from "../game/types";

interface GrillStationProps {
  slots: SausageSlot[];
  upgrades: Upgrade[];
  onPlaceSausage: (slotId: number) => void;
  onCollectSausage: (slotId: number) => void;
  onClearBurned: (slotId: number) => void;
}

function SausageProgress({ slot, cookTime, readyWindow }: { slot: SausageSlot; cookTime: number; readyWindow: number }) {
  if (slot.state === "empty") return null;

  const now = Date.now();
  const elapsed = slot.placedAt ? (now - slot.placedAt) / 1000 : 0;
  const totalTime = cookTime + readyWindow;
  const progress = Math.min(elapsed / totalTime, 1);

  const cookPhaseEnd = cookTime / totalTime;

  return (
    <div className="w-full mt-1" style={{ height: 4, background: "#e0e0e0", borderRadius: 999, overflow: "hidden", position: "relative" }}>
      {/* Cook phase marker */}
      <div
        style={{
          position: "absolute",
          left: `${cookPhaseEnd * 100}%`,
          top: 0,
          bottom: 0,
          width: 2,
          background: "rgba(0,0,0,0.2)",
          zIndex: 2,
        }}
      />
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: slot.state === "burned"
            ? "#333"
            : slot.state === "ready"
            ? "linear-gradient(90deg, #22c55e, #86efac)"
            : "linear-gradient(90deg, #f97316, #fbbf24)",
          borderRadius: 999,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

function SausageEmoji({ state }: { state: SausageSlot["state"] }) {
  if (state === "empty") return <span style={{ fontSize: "2rem", opacity: 0.3 }}>➕</span>;
  if (state === "raw") return <span style={{ fontSize: "2rem" }}>🥩</span>;
  if (state === "cooking") return <span className="animate-sizzle" style={{ fontSize: "2rem" }}>🌭</span>;
  if (state === "ready") return (
    <span
      style={{
        fontSize: "2rem",
        filter: "drop-shadow(0 0 6px rgba(255, 200, 0, 0.8))",
        animation: "pulse-glow 1s ease-in-out infinite",
      }}
    >
      🌭
    </span>
  );
  if (state === "burned") return <span style={{ fontSize: "2rem", filter: "grayscale(1) brightness(0.4)" }}>💀</span>;
  return null;
}

export function GrillStation({ slots, upgrades, onPlaceSausage, onCollectSausage, onClearBurned }: GrillStationProps) {
  const cookTime = getCookTime(upgrades);
  const readyWindow = getReadyWindow(upgrades);

  return (
    <div
      className="rounded-2xl p-3 shadow-lg"
      style={{
        background: "linear-gradient(180deg, #3d2000 0%, #2a1500 100%)",
        border: "3px solid #6b3a00",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Grill header */}
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: "1.2rem" }}>🔥</span>
        <span className="font-black text-sm" style={{ color: "#ff9532" }}>
          GRILL STATION
        </span>
        <span className="text-xs ml-auto" style={{ color: "#ff9532", opacity: 0.7 }}>
          {Math.round(cookTime)}s cook time
        </span>
      </div>

      {/* Grill surface */}
      <div
        className="rounded-xl p-2"
        style={{
          background: "repeating-linear-gradient(0deg, #1a0a00 0, #1a0a00 6px, #220c00 6px, #220c00 12px)",
          border: "2px solid #4a2000",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {slots.map((slot) => {
          const clickable = slot.state === "empty" || slot.state === "ready" || slot.state === "burned";
          const isReady = slot.state === "ready";
          const isBurned = slot.state === "burned";

          return (
            <button
              key={slot.id}
              onClick={() => {
                if (slot.state === "empty") onPlaceSausage(slot.id);
                else if (slot.state === "ready") onCollectSausage(slot.id);
                else if (slot.state === "burned") onClearBurned(slot.id);
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl cursor-pointer transition-transform active:scale-90"
              style={{
                background: isReady
                  ? "rgba(255, 200, 50, 0.15)"
                  : isBurned
                  ? "rgba(100, 50, 0, 0.3)"
                  : "rgba(0,0,0,0.3)",
                border: isReady
                  ? "2px solid rgba(255,200,50,0.5)"
                  : isBurned
                  ? "2px solid rgba(150,50,0,0.5)"
                  : "2px solid rgba(255,255,255,0.05)",
                minWidth: 64,
                boxShadow: isReady ? "0 0 12px rgba(255,200,50,0.3)" : "none",
                opacity: clickable ? 1 : 0.7,
              }}
              disabled={!clickable && slot.state !== "cooking" && slot.state !== "raw"}
            >
              <SausageEmoji state={slot.state} />
              <SausageProgress slot={slot} cookTime={cookTime} readyWindow={readyWindow} />
              <span
                className="text-xs font-bold"
                style={{
                  color: isReady ? "#fbbf24" : isBurned ? "#f87171" : "#aaa",
                  fontSize: "0.65rem",
                }}
              >
                {slot.state === "empty" && "empty"}
                {slot.state === "raw" && "heating..."}
                {slot.state === "cooking" && "sizzling!"}
                {slot.state === "ready" && "✓ ready!"}
                {slot.state === "burned" && "✗ burned"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-2 justify-center text-xs" style={{ color: "rgba(255,149,50,0.6)" }}>
        <span>🥩 raw</span>
        <span>🌭 cooking</span>
        <span style={{ color: "#fbbf24" }}>🌟 ready - tap!</span>
        <span style={{ color: "#f87171" }}>💀 burned</span>
      </div>
    </div>
  );
}
