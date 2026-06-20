import type { GameState } from "../game/types";
import type { Upgrade } from "../game/types";
import { GameHUD } from "./GameHUD";
import { GrillStation } from "./GrillStation";
import { OrderQueue } from "./OrderQueue";

interface GameScreenProps {
  state: GameState;
  onPlaceSausage: (slotId: number) => void;
  onCollectSausage: (slotId: number) => void;
  onClearBurned: (slotId: number) => void;
  onServeOrder: (orderId: string) => void;
  coinAnims: { id: string; x: number; y: number; amount: number }[];
  smokeAnims: { id: string; slotId: number }[];
}

export function GameScreen({
  state,
  onPlaceSausage,
  onCollectSausage,
  onClearBurned,
  onServeOrder,
  coinAnims,
  smokeAnims,
}: GameScreenProps) {
  const urgent = state.timeLeft <= 10;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: urgent
          ? "linear-gradient(180deg, #3d0000 0%, #1a0000 100%)"
          : "linear-gradient(180deg, #1a3d1a 0%, #0d1f0d 100%)",
        transition: "background 1s",
      }}
    >
      {/* Van background art */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0.07, fontSize: "12rem", paddingTop: "2rem" }}
      >
        🚐
      </div>

      {/* Smoke effects */}
      {smokeAnims.map((s) => (
        <div
          key={s.id}
          className="absolute animate-smoke pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "2rem",
            zIndex: 100,
          }}
        >
          💨
        </div>
      ))}

      {/* Coin animations */}
      {coinAnims.map((c) => (
        <div
          key={c.id}
          className="fixed animate-coin pointer-events-none font-black"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            zIndex: 200,
            color: "#fbbf24",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            fontSize: "1.2rem",
          }}
        >
          +${c.amount}
        </div>
      ))}

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto relative z-10">
        {/* HUD */}
        <GameHUD
          day={state.day}
          timeLeft={state.timeLeft}
          money={state.money}
          dailyEarnings={state.dailyEarnings}
          dailyTarget={state.dailyTarget}
          readySausages={state.readySausages}
          combo={state.combo}
        />

        {/* Grill */}
        <GrillStation
          slots={state.grillSlots}
          upgrades={state.upgrades}
          onPlaceSausage={onPlaceSausage}
          onCollectSausage={onCollectSausage}
          onClearBurned={onClearBurned}
        />

        {/* Orders */}
        <OrderQueue
          orders={state.orders}
          readySausages={state.readySausages}
          onServe={onServeOrder}
        />

        {/* Urgent warning */}
        {urgent && (
          <div
            className="text-center py-2 rounded-2xl font-black text-sm animate-pulse"
            style={{
              background: "rgba(220,38,38,0.2)",
              color: "#f87171",
              border: "2px solid rgba(220,38,38,0.3)",
            }}
          >
            ⚠️ HURRY! Only {Math.ceil(state.timeLeft)} seconds left!
          </div>
        )}
      </div>
    </div>
  );
}
