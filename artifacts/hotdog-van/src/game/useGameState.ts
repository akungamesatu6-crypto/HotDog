import { useCallback, useEffect, useRef, useState } from "react";
import type { GameState, Order, OrderType, SausageSlot } from "./types";
import {
  INITIAL_UPGRADES,
  DAILY_TARGETS,
  HOTDOG_PRICES,
  DAY_DURATION,
  MAX_QUEUE,
  ORDER_INTERVAL_MIN,
  ORDER_INTERVAL_MAX,
  getCookTime,
  getReadyWindow,
  getGrillSlots,
  getCustomerPatience,
  getUpgradeCost,
} from "./constants";

function makeSlots(count: number, existingSlots: SausageSlot[] = []): SausageSlot[] {
  return Array.from({ length: count }, (_, i) => existingSlots[i] ?? {
    id: i,
    state: "empty",
    cookProgress: 0,
    placedAt: null,
  });
}

function randomOrderType(): OrderType {
  const r = Math.random();
  if (r < 0.4) return "plain";
  if (r < 0.7) return "sauce";
  return "mustard";
}

const ORDER_LABELS: Record<OrderType, string> = {
  plain: "Plain Hotdog",
  sauce: "With Ketchup",
  mustard: "With Mustard",
};

export { ORDER_LABELS };

function createOrder(): Order {
  return {
    id: Math.random().toString(36).slice(2),
    type: randomOrderType(),
    patience: 100,
    createdAt: Date.now(),
    leaving: false,
  };
}

const INITIAL_STATE: GameState = {
  phase: "loading",
  day: 1,
  timeLeft: DAY_DURATION,
  money: 0,
  dailyEarnings: 0,
  dailyTarget: DAILY_TARGETS[0],
  targetMet: false,
  grillSlots: makeSlots(3),
  orders: [],
  readySausages: 0,
  upgrades: INITIAL_UPGRADES,
  totalCustomersServed: 0,
  totalOrdersMissed: 0,
  combo: 0,
  lastServedTime: 0,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const tickRef = useRef<number | null>(null);
  const orderTimerRef = useRef<number | null>(null);
  const coinAnimsRef = useRef<{ id: string; x: number; y: number; amount: number }[]>([]);
  const [coinAnims, setCoinAnims] = useState<{ id: string; x: number; y: number; amount: number }[]>([]);
  const [smokeAnims, setSmokeAnims] = useState<{ id: string; slotId: number }[]>([]);

  const addCoin = useCallback((amount: number, x: number = 50, y: number = 50) => {
    const id = Math.random().toString(36).slice(2);
    setCoinAnims((prev) => [...prev, { id, x, y, amount }]);
    setTimeout(() => setCoinAnims((prev) => prev.filter((c) => c.id !== id)), 900);
  }, []);

  const addSmoke = useCallback((slotId: number) => {
    const id = Math.random().toString(36).slice(2);
    setSmokeAnims((prev) => [...prev, { id, slotId }]);
    setTimeout(() => setSmokeAnims((prev) => prev.filter((s) => s.id !== id)), 1000);
  }, []);

  // Main game tick
  useEffect(() => {
    if (state.phase !== "playing") return;

    tickRef.current = window.setInterval(() => {
      setState((prev) => {
        if (prev.phase !== "playing") return prev;

        const now = Date.now();
        const cookTime = getCookTime(prev.upgrades) * 1000;
        const readyWindow = getReadyWindow(prev.upgrades) * 1000;
        const patience = getCustomerPatience(prev.upgrades);

        // Update grill slots
        const grillSlots = prev.grillSlots.map((slot) => {
          if (slot.state === "empty" || slot.state === "burned") return slot;
          if (!slot.placedAt) return slot;

          const elapsed = now - slot.placedAt;
          const cookProgress = Math.min((elapsed / cookTime) * 100, 100);

          if (slot.state === "raw" || slot.state === "cooking") {
            if (elapsed >= cookTime) {
              // Check if burned
              if (elapsed >= cookTime + readyWindow) {
                return { ...slot, state: "burned" as const, cookProgress: 100 };
              }
              return { ...slot, state: "ready" as const, cookProgress: 100 };
            }
            return {
              ...slot,
              state: elapsed > cookTime * 0.1 ? "cooking" as const : "raw" as const,
              cookProgress,
            };
          }

          if (slot.state === "ready") {
            if (elapsed >= cookTime + readyWindow) {
              return { ...slot, state: "burned" as const };
            }
          }

          return slot;
        });

        // Update customer patience
        const orders = prev.orders
          .map((order) => {
            const elapsed = (now - order.createdAt) / 1000;
            const newPatience = Math.max(0, 100 - (elapsed / patience) * 100);
            if (newPatience <= 0 && !order.leaving) {
              return { ...order, patience: 0, leaving: true };
            }
            return { ...order, patience: newPatience };
          })
          .filter((o) => {
            if (o.leaving && o.patience <= 0) {
              return false;
            }
            return true;
          });

        const missedThisTick = prev.orders.filter((o) => o.patience <= 0 && !o.leaving).length;

        const newTimeLeft = prev.timeLeft - 0.05;

        if (newTimeLeft <= 0) {
          return {
            ...prev,
            phase: "day_result",
            timeLeft: 0,
            grillSlots,
            orders: [],
            targetMet: prev.dailyEarnings >= prev.dailyTarget,
            totalOrdersMissed: prev.totalOrdersMissed + missedThisTick,
          };
        }

        return {
          ...prev,
          timeLeft: newTimeLeft,
          grillSlots,
          orders,
          totalOrdersMissed: prev.totalOrdersMissed + missedThisTick,
        };
      });
    }, 50);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [state.phase]);

  // Order spawner
  useEffect(() => {
    if (state.phase !== "playing") return;

    const spawnOrder = () => {
      setState((prev) => {
        if (prev.orders.length >= MAX_QUEUE) return prev;
        return { ...prev, orders: [...prev.orders, createOrder()] };
      });

      const delay = (ORDER_INTERVAL_MIN + Math.random() * (ORDER_INTERVAL_MAX - ORDER_INTERVAL_MIN)) * 1000;
      orderTimerRef.current = window.setTimeout(spawnOrder, delay);
    };

    // First order after a short delay
    orderTimerRef.current = window.setTimeout(spawnOrder, 2000);

    return () => {
      if (orderTimerRef.current) clearTimeout(orderTimerRef.current);
    };
  }, [state.phase]);

  const startGame = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "menu" }));
  }, []);

  const startDay = useCallback(() => {
    setState((prev) => {
      const slotCount = getGrillSlots(prev.upgrades);
      return {
        ...prev,
        phase: "playing",
        timeLeft: DAY_DURATION,
        dailyEarnings: 0,
        grillSlots: makeSlots(slotCount),
        orders: [],
        readySausages: 0,
        combo: 0,
      };
    });
  }, []);

  const placeSausage = useCallback((slotId: number) => {
    setState((prev) => {
      const slot = prev.grillSlots[slotId];
      if (!slot || slot.state !== "empty") return prev;
      const newSlots = prev.grillSlots.map((s) =>
        s.id === slotId ? { ...s, state: "raw" as const, placedAt: Date.now(), cookProgress: 0 } : s
      );
      return { ...prev, grillSlots: newSlots };
    });
  }, []);

  const collectSausage = useCallback((slotId: number) => {
    setState((prev) => {
      const slot = prev.grillSlots[slotId];
      if (!slot || slot.state !== "ready") return prev;
      const newSlots = prev.grillSlots.map((s) =>
        s.id === slotId ? { ...s, state: "empty" as const, cookProgress: 0, placedAt: null } : s
      );
      return { ...prev, grillSlots: newSlots, readySausages: prev.readySausages + 1 };
    });
  }, []);

  const clearBurned = useCallback((slotId: number) => {
    addSmoke(slotId);
    setState((prev) => {
      const slot = prev.grillSlots[slotId];
      if (!slot || slot.state !== "burned") return prev;
      const newSlots = prev.grillSlots.map((s) =>
        s.id === slotId ? { ...s, state: "empty" as const, cookProgress: 0, placedAt: null } : s
      );
      return { ...prev, grillSlots: newSlots };
    });
  }, [addSmoke]);

  const serveOrder = useCallback((orderId: string) => {
    setState((prev) => {
      if (prev.readySausages <= 0) return prev;
      const order = prev.orders.find((o) => o.id === orderId);
      if (!order) return prev;

      const price = HOTDOG_PRICES[order.type];
      const now = Date.now();
      const timeSinceLast = now - prev.lastServedTime;
      const newCombo = timeSinceLast < 5000 ? prev.combo + 1 : 1;
      const comboBonus = newCombo >= 3 ? Math.floor(price * 0.5) : 0;
      const earned = price + comboBonus;

      addCoin(earned, 60, 30);

      return {
        ...prev,
        orders: prev.orders.filter((o) => o.id !== orderId),
        readySausages: prev.readySausages - 1,
        money: prev.money + earned,
        dailyEarnings: prev.dailyEarnings + earned,
        totalCustomersServed: prev.totalCustomersServed + 1,
        combo: newCombo,
        lastServedTime: now,
      };
    });
  }, [addCoin]);

  const proceedToUpgrades = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "upgrade_shop" }));
  }, []);

  const purchaseUpgrade = useCallback((upgradeId: string) => {
    setState((prev) => {
      const upgrade = prev.upgrades.find((u) => u.id === upgradeId);
      if (!upgrade) return prev;
      if (upgrade.currentLevel >= upgrade.maxLevel) return prev;
      const cost = getUpgradeCost(upgrade);
      if (prev.money < cost) return prev;
      const newUpgrades = prev.upgrades.map((u) =>
        u.id === upgradeId ? { ...u, currentLevel: u.currentLevel + 1 } : u
      );
      return { ...prev, money: prev.money - cost, upgrades: newUpgrades };
    });
  }, []);

  const nextDay = useCallback(() => {
    setState((prev) => {
      const nextDay = prev.day + 1;
      const targetIndex = Math.min(nextDay - 1, DAILY_TARGETS.length - 1);
      return {
        ...prev,
        day: nextDay,
        dailyTarget: DAILY_TARGETS[targetIndex],
        phase: "playing",
        timeLeft: DAY_DURATION,
        dailyEarnings: 0,
        grillSlots: makeSlots(getGrillSlots(prev.upgrades)),
        orders: [],
        readySausages: 0,
        combo: 0,
      };
    });
  }, []);

  const goToMenu = useCallback(() => {
    setState(INITIAL_STATE);
    setTimeout(() => setState((prev) => ({ ...prev, phase: "menu" })), 50);
  }, []);

  return {
    state,
    startGame,
    startDay,
    placeSausage,
    collectSausage,
    clearBurned,
    serveOrder,
    proceedToUpgrades,
    purchaseUpgrade,
    nextDay,
    goToMenu,
    coinAnims,
    smokeAnims,
  };
}
