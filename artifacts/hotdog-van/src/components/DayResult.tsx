interface DayResultProps {
  day: number;
  dailyEarnings: number;
  dailyTarget: number;
  totalMoney: number;
  customersServed: number;
  ordersMissed: number;
  targetMet: boolean;
  onProceedToUpgrades: () => void;
  onNextDay: () => void;
}

export function DayResult({
  day,
  dailyEarnings,
  dailyTarget,
  totalMoney,
  customersServed,
  ordersMissed,
  targetMet,
  onProceedToUpgrades,
  onNextDay,
}: DayResultProps) {
  const stars = dailyEarnings >= dailyTarget * 1.5 ? 3 : dailyEarnings >= dailyTarget ? 2 : dailyEarnings >= dailyTarget * 0.5 ? 1 : 0;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0f0500 0%, #2d1000 50%, #0f0500 100%)",
      }}
    >
      {/* Result card */}
      <div
        className="animate-bounce-in w-full max-w-sm mx-4 rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: "3px solid", borderColor: targetMet ? "#ffd700" : "#555" }}
      >
        {/* Header */}
        <div
          className="py-5 px-6 text-center"
          style={{
            background: targetMet
              ? "linear-gradient(135deg, #ff6b00, #ff9532)"
              : "linear-gradient(135deg, #444, #333)",
          }}
        >
          <div style={{ fontSize: "3rem" }}>
            {targetMet ? "🎉" : "😔"}
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            {targetMet ? "Day Complete!" : "Day Over!"}
          </h2>
          <p className="text-sm font-medium mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            Day {day} results
          </p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-3 py-4" style={{ background: "#1a0800" }}>
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={s <= stars ? "animate-star" : ""}
              style={{
                fontSize: "2.5rem",
                animationDelay: `${(s - 1) * 0.3}s`,
                filter: s <= stars ? "none" : "grayscale(1) opacity(0.3)",
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="p-4" style={{ background: "#fff" }}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div
              className="text-center p-3 rounded-xl"
              style={{ background: dailyEarnings >= dailyTarget ? "#f0fff4" : "#fff5f5", border: "2px solid", borderColor: dailyEarnings >= dailyTarget ? "#86efac" : "#fca5a5" }}
            >
              <div className="text-xs font-bold mb-1" style={{ color: "#888" }}>EARNED</div>
              <div className="text-2xl font-black" style={{ color: dailyEarnings >= dailyTarget ? "#16a34a" : "#dc2626" }}>
                ${dailyEarnings}
              </div>
              <div className="text-xs" style={{ color: "#aaa" }}>target: ${dailyTarget}</div>
            </div>
            <div
              className="text-center p-3 rounded-xl"
              style={{ background: "#fff8e6", border: "2px solid #ffd580" }}
            >
              <div className="text-xs font-bold mb-1" style={{ color: "#888" }}>TOTAL SAVINGS</div>
              <div className="text-2xl font-black" style={{ color: "#e05a00" }}>
                ${totalMoney}
              </div>
            </div>
            <div
              className="text-center p-3 rounded-xl"
              style={{ background: "#f0fff4", border: "2px solid #86efac" }}
            >
              <div className="text-xs font-bold mb-1" style={{ color: "#888" }}>SERVED</div>
              <div className="text-2xl font-black" style={{ color: "#16a34a" }}>
                {customersServed} 😊
              </div>
            </div>
            <div
              className="text-center p-3 rounded-xl"
              style={{ background: "#fff5f5", border: "2px solid #fca5a5" }}
            >
              <div className="text-xs font-bold mb-1" style={{ color: "#888" }}>MISSED</div>
              <div className="text-2xl font-black" style={{ color: "#dc2626" }}>
                {ordersMissed} 😤
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onProceedToUpgrades}
              className="w-full py-3 rounded-2xl font-black text-base text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 4px 0 #5b21b6",
                border: "none",
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(3px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 0 #5b21b6";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 0 #5b21b6";
              }}
            >
              🛒 Visit Upgrade Shop
            </button>
            <button
              onClick={onNextDay}
              className="w-full py-3 rounded-2xl font-black text-base cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #ff6b00, #ff9532)",
                boxShadow: "0 4px 0 #b84500",
                border: "none",
                color: "#fff",
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(3px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 0 #b84500";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 0 #b84500";
              }}
            >
              ⏭ Next Day →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
