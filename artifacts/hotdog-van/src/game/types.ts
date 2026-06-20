export type SausageState = "empty" | "raw" | "cooking" | "ready" | "burned";

export interface SausageSlot {
  id: number;
  state: SausageState;
  cookProgress: number; // 0-100
  placedAt: number | null; // timestamp
}

export type OrderType = "plain" | "sauce" | "mustard";

export interface Order {
  id: string;
  type: OrderType;
  patience: number; // 0-100, decreases over time
  createdAt: number;
  leaving: boolean;
}

export type GamePhase = "loading" | "menu" | "playing" | "day_result" | "upgrade_shop";

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  maxLevel: number;
  currentLevel: number;
}

export interface GameState {
  phase: GamePhase;
  day: number;
  timeLeft: number; // seconds
  money: number;
  dailyEarnings: number;
  dailyTarget: number;
  targetMet: boolean;
  grillSlots: SausageSlot[];
  orders: Order[];
  readySausages: number; // sausages placed in bun but not yet given
  upgrades: Upgrade[];
  totalCustomersServed: number;
  totalOrdersMissed: number;
  combo: number;
  lastServedTime: number;
}
