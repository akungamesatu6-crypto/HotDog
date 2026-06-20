import type { Upgrade } from "../game/types";
import { getUpgradeCost } from "../game/constants";

interface UpgradeShopProps {
  upgrades: Upgrade[];
  money: number;
  day: number;
  onPurchase: (upgradeId: string) => void;
  onNextDay: () => void;
}

const UPGRADE_EFFECTS: Record<string, string[]> = {
  grill_speed: ["Cook 20% faster", "Cook 40% faster", "Cook 60% faster"],
  grill_slots: ["4 sausage slots", "5 sausage slots"],
  ready_window: ["+3s ready window", "+6s ready window", "+9s ready window"],
  patience: ["+5s patience", "+10s patience", "+15s patience"],
};

export function UpgradeShop({ upgrades, money, day, onPurchase, onNextDay }: UpgradeShopProps) {
  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #1a0050 0%, #0d0030 100%)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 text-center"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
        }}
      >
        <div style={{ fontSize: "2rem" }}>🛒</div>
        <h2 className="text-xl font-black text-white">Upgrade Shop</h2>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
          Day {day} completed · You have{" "}
          <span className="font-black text-yellow-300">${money}</span>
        </p>
      </div>

      {/* Upgrades list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {upgrades.map((upgrade) => {
          const cost = getUpgradeCost(upgrade);
          const maxed = upgrade.currentLevel >= upgrade.maxLevel;
          const canAfford = money >= cost;
          const nextEffect = !maxed ? UPGRADE_EFFECTS[upgrade.id]?.[upgrade.currentLevel] : null;

          return (
            <div
              key={upgrade.id}
              className="rounded-2xl overflow-hidden shadow-lg"
              style={{ border: "2px solid", borderColor: maxed ? "#4a4a4a" : canAfford ? "#a855f7" : "#333" }}
            >
              <div
                className="flex items-center gap-3 p-3"
                style={{ background: maxed ? "#1a1a1a" : "rgba(168,85,247,0.1)" }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: 48,
                    height: 48,
                    background: maxed ? "#222" : "rgba(168,85,247,0.2)",
                    fontSize: "1.8rem",
                    flexShrink: 0,
                  }}
                >
                  {upgrade.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm" style={{ color: maxed ? "#666" : "#e2d4ff" }}>
                      {upgrade.name}
                    </span>
                    {/* Level dots */}
                    <div className="flex gap-1">
                      {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: i < upgrade.currentLevel ? "#a855f7" : "#333",
                            border: "1px solid",
                            borderColor: i < upgrade.currentLevel ? "#c084fc" : "#555",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#888" }}>
                    {upgrade.description}
                  </p>
                  {!maxed && nextEffect && (
                    <p className="text-xs mt-0.5 font-bold" style={{ color: "#c084fc" }}>
                      Next: {nextEffect}
                    </p>
                  )}
                  {maxed && (
                    <p className="text-xs mt-0.5 font-bold" style={{ color: "#555" }}>
                      ✓ Maxed out!
                    </p>
                  )}
                </div>

                {/* Buy button */}
                <button
                  onClick={() => !maxed && canAfford && onPurchase(upgrade.id)}
                  disabled={maxed || !canAfford}
                  className="rounded-xl px-3 py-2 font-black text-sm cursor-pointer"
                  style={{
                    background: maxed
                      ? "#222"
                      : canAfford
                      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                      : "#1a1a1a",
                    color: maxed ? "#444" : canAfford ? "#fff" : "#555",
                    boxShadow: canAfford && !maxed ? "0 3px 0 #5b21b6" : "none",
                    border: "none",
                    transition: "transform 0.1s, box-shadow 0.1s",
                    minWidth: 64,
                    flexShrink: 0,
                  }}
                  onMouseDown={(e) => {
                    if (!maxed && canAfford) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 0 #5b21b6";
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!maxed && canAfford) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 3px 0 #5b21b6";
                    }
                  }}
                >
                  {maxed ? "MAX" : `$${cost}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue button */}
      <div className="p-4" style={{ background: "rgba(0,0,0,0.3)" }}>
        <button
          onClick={onNextDay}
          className="w-full py-4 rounded-2xl font-black text-lg text-white cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #ff6b00, #ff9532)",
            boxShadow: "0 5px 0 #b84500",
            border: "none",
            transition: "transform 0.1s, box-shadow 0.1s",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(4px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 0 #b84500";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 5px 0 #b84500";
          }}
        >
          🚐 Open for Business! Day {day + 1} →
        </button>
      </div>
    </div>
  );
}
