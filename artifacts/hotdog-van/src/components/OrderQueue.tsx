import { useEffect, useRef } from "react";
import type { Order } from "../game/types";
import { ORDER_LABELS } from "../game/useGameState";
import { HOTDOG_PRICES } from "../game/constants";

const ORDER_ICONS: Record<string, string> = {
  plain: "🌭",
  sauce: "🍅",
  mustard: "🟡",
};

const ORDER_COLORS: Record<string, string> = {
  plain: "#e05a00",
  sauce: "#dc2626",
  mustard: "#ca8a04",
};

const ORDER_BG: Record<string, string> = {
  plain: "#fff8f0",
  sauce: "#fff5f5",
  mustard: "#fffbeb",
};

interface OrderCardProps {
  order: Order;
  canServe: boolean;
  onServe: (orderId: string) => void;
}

function OrderCard({ order, canServe, onServe }: OrderCardProps) {
  const prevPatience = useRef(order.patience);

  const patienceColor =
    order.patience > 60 ? "#22c55e" : order.patience > 30 ? "#f97316" : "#dc2626";
  const price = HOTDOG_PRICES[order.type];

  return (
    <div
      className="animate-customer-in flex flex-col gap-1 p-2.5 rounded-xl cursor-pointer transition-transform active:scale-95"
      style={{
        background: ORDER_BG[order.type],
        border: `2px solid ${canServe ? ORDER_COLORS[order.type] : "#ddd"}`,
        boxShadow: canServe
          ? `0 0 12px ${ORDER_COLORS[order.type]}33, 0 3px 0 ${ORDER_COLORS[order.type]}44`
          : "0 2px 4px rgba(0,0,0,0.08)",
        opacity: order.leaving ? 0 : 1,
        transition: "opacity 0.3s, border-color 0.2s",
        minWidth: 90,
        maxWidth: 110,
      }}
      onClick={() => canServe && onServe(order.id)}
    >
      {/* Customer avatar */}
      <div className="text-center" style={{ fontSize: "1.8rem" }}>
        {["👨", "👩", "🧑", "👴", "👧", "🧔"][Math.abs(order.id.charCodeAt(0)) % 6]}
      </div>

      {/* Order type */}
      <div className="text-center">
        <div style={{ fontSize: "1.1rem" }}>{ORDER_ICONS[order.type]}</div>
        <div className="font-bold text-xs leading-tight" style={{ color: ORDER_COLORS[order.type] }}>
          {ORDER_LABELS[order.type]}
        </div>
        <div className="text-xs font-black" style={{ color: "#16a34a" }}>${price}</div>
      </div>

      {/* Patience bar */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 4, background: "#e0e0e0" }}
      >
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${order.patience}%`,
            background: `linear-gradient(90deg, ${patienceColor}, ${patienceColor}aa)`,
          }}
        />
      </div>

      {/* Serve button */}
      {canServe && (
        <div
          className="text-center text-xs font-black py-1 rounded-lg"
          style={{ background: ORDER_COLORS[order.type], color: "#fff" }}
        >
          SERVE! 🌭
        </div>
      )}
    </div>
  );
}

interface OrderQueueProps {
  orders: Order[];
  readySausages: number;
  onServe: (orderId: string) => void;
}

export function OrderQueue({ orders, readySausages, onServe }: OrderQueueProps) {
  return (
    <div
      className="rounded-2xl p-3 shadow-lg"
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "2px solid rgba(255,149,50,0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontSize: "1.2rem" }}>👥</span>
        <span className="font-black text-sm" style={{ color: "#333" }}>CUSTOMERS</span>
        <span
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: orders.length > 0 ? "#fff3e0" : "#f5f5f5",
            color: orders.length > 0 ? "#e05a00" : "#aaa",
          }}
        >
          {orders.length} waiting
        </span>
      </div>

      {orders.length === 0 ? (
        <div
          className="text-center py-6 rounded-xl"
          style={{ background: "#f9f9f9", color: "#bbb", fontSize: "0.85rem" }}
        >
          <div style={{ fontSize: "2rem" }}>🏜️</div>
          No customers yet...
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              canServe={readySausages > 0}
              onServe={onServe}
            />
          ))}
        </div>
      )}

      {readySausages === 0 && orders.length > 0 && (
        <p className="text-center text-xs mt-2 font-medium" style={{ color: "#f97316" }}>
          ⬆️ Collect a sausage first!
        </p>
      )}
    </div>
  );
}
