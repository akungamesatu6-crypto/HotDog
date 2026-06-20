import { DAY_DURATION } from "../game/constants";

interface GameHUDProps {
  day: number;
  timeLeft: number;
  money: number;
  dailyEarnings: number;
  dailyTarget: number;
  readySausages: number;
  combo: number;
}

export function GameHUD({ day, timeLeft, money, dailyEarnings, dailyTarget, readySausages, combo }: GameHUDProps) {
  const timePercent = (timeLeft / DAY_DURATION) * 100;
  const earningsPercent = Math.min((dailyEarnings / dailyTarget) * 100, 100);
  const urgent = timeLeft <= 15;
  const almostDone = timeLeft <= 10;

  return (
    <div
      className="flex flex-col gap-2 p-3 rounded-2xl shadow-lg"
      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", border: "2px solid rgba(255,149,50,0.2)" }}
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        <div
          className="px-3 py-1 rounded-xl font-black text-sm"
          style={{ background: "#fff3e0", color: "#e05a00", border: "2px solid #ffd580" }}
        >
          DAY {day}
        </div>

        {/* Timer */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-bold ${almostDone ? "animate-pulse" : ""}`}
              style={{ color: urgent ? "#dc2626" : "#666" }}
            >
              ⏱ {Math.ceil(timeLeft)}s
            </span>
            <span className="text-xs font-bold" style={{ color: "#888" }}>
              Time Left
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 8, background: "#f0f0f0" }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${timePercent}%`,
                background: urgent
                  ? "linear-gradient(90deg, #dc2626, #ff4444)"
                  : "linear-gradient(90deg, #22c55e, #86efac)",
                boxShadow: urgent ? "0 0 8px rgba(220,38,38,0.5)" : "none",
              }}
            />
          </div>
        </div>

        {/* Money */}
        <div
          className="px-3 py-1 rounded-xl font-black text-sm"
          style={{ background: "#f0fff4", color: "#16a34a", border: "2px solid #86efac" }}
        >
          💰 ${money}
        </div>
      </div>

      {/* Daily target progress */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold" style={{ color: "#888" }}>
            Daily Target: ${dailyEarnings} / ${dailyTarget}
          </span>
          {earningsPercent >= 100 && (
            <span className="text-xs font-black" style={{ color: "#16a34a" }}>
              ✅ Target Met!
            </span>
          )}
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 10, background: "#f0f0f0" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${earningsPercent}%`,
              background: earningsPercent >= 100
                ? "linear-gradient(90deg, #16a34a, #4ade80)"
                : "linear-gradient(90deg, #f97316, #fb923c)",
              boxShadow: earningsPercent >= 100 ? "0 0 8px rgba(22,163,74,0.4)" : "none",
            }}
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        {/* Ready sausages */}
        <div
          className="flex items-center gap-1 px-3 py-1 rounded-xl"
          style={{ background: readySausages > 0 ? "#fff8e6" : "#f5f5f5", border: "2px solid", borderColor: readySausages > 0 ? "#ffd580" : "#e0e0e0" }}
        >
          <span style={{ fontSize: "1rem" }}>🌭</span>
          <span className="font-black text-sm" style={{ color: readySausages > 0 ? "#e05a00" : "#aaa" }}>
            x{readySausages}
          </span>
          <span className="text-xs font-medium" style={{ color: "#888" }}>ready</span>
        </div>

        {/* Combo */}
        {combo >= 2 && (
          <div
            className="animate-bounce-in px-3 py-1 rounded-xl font-black text-sm"
            style={{
              background: "linear-gradient(135deg, #ff6b00, #ff9532)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(255,107,0,0.4)",
            }}
          >
            🔥 {combo}x COMBO!
          </div>
        )}
      </div>
    </div>
  );
}
