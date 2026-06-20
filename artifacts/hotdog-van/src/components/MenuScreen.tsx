interface MenuScreenProps {
  onStartDay: () => void;
  day: number;
  money: number;
  dailyTarget: number;
}

export function MenuScreen({ onStartDay, day, money, dailyTarget }: MenuScreenProps) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6"
      style={{
        background: "linear-gradient(180deg, #87CEEB 0%, #FDB97D 60%, #8B4513 100%)",
      }}
    >
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: "#4a4a4a" }}>
        <div
          className="absolute top-1/2 left-0 right-0 h-2"
          style={{ background: "repeating-linear-gradient(90deg, #fff 0, #fff 40px, transparent 40px, transparent 80px)", transform: "translateY(-50%)", opacity: 0.6 }}
        />
      </div>

      {/* Van */}
      <div className="animate-float-van" style={{ fontSize: "6rem", filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.3))" }}>
        🚐
      </div>

      {/* Game title card */}
      <div
        className="text-center px-8 py-5 rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2), 0 4px 0 rgba(0,0,0,0.1)",
          backdropFilter: "blur(8px)",
          minWidth: 300,
        }}
      >
        <h1 className="text-3xl font-black mb-1" style={{ color: "#e05a00" }}>
          🌭 Hotdog Van
        </h1>
        <p className="text-sm font-medium mb-4" style={{ color: "#888" }}>Street Food Tycoon</p>

        <div className="flex gap-4 justify-center mb-4">
          <div className="text-center px-4 py-2 rounded-xl" style={{ background: "#fff8e6", border: "2px solid #ffd580" }}>
            <div className="text-xs font-bold" style={{ color: "#888" }}>DAY</div>
            <div className="text-2xl font-black" style={{ color: "#e05a00" }}>{day}</div>
          </div>
          <div className="text-center px-4 py-2 rounded-xl" style={{ background: "#f0fff4", border: "2px solid #86efac" }}>
            <div className="text-xs font-bold" style={{ color: "#888" }}>SAVINGS</div>
            <div className="text-2xl font-black" style={{ color: "#16a34a" }}>${money}</div>
          </div>
          <div className="text-center px-4 py-2 rounded-xl" style={{ background: "#fef2f2", border: "2px solid #fca5a5" }}>
            <div className="text-xs font-bold" style={{ color: "#888" }}>TARGET</div>
            <div className="text-2xl font-black" style={{ color: "#dc2626" }}>${dailyTarget}</div>
          </div>
        </div>

        <button
          onClick={onStartDay}
          className="w-full py-3 rounded-2xl font-black text-lg text-white cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #ff6b00, #ff9532)",
            boxShadow: "0 4px 0 #b84500",
            border: "none",
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
          🍳 Start Day {day}
        </button>
      </div>

      {/* Instructions */}
      <div
        className="text-center px-6 py-3 rounded-2xl text-sm"
        style={{ background: "rgba(255,255,255,0.7)", maxWidth: 320 }}
      >
        <p className="font-bold mb-1" style={{ color: "#333" }}>How to play:</p>
        <p style={{ color: "#555" }}>
          🍖 Click empty grill slot → place sausage<br />
          ✅ Click golden sausage → add to bun<br />
          🌭 Click customer order → serve them!<br />
          ⚠️ Don't let sausages burn!
        </p>
      </div>
    </div>
  );
}
