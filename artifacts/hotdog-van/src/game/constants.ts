import type { Upgrade } from "./types";

export const DAY_DURATION = 60; // seconds
export const BASE_COOK_TIME = 8; // seconds to fully cook
export const READY_WINDOW = 5; // seconds before burning
export const CUSTOMER_PATIENCE = 15; // seconds before customer leaves
export const ORDER_INTERVAL_MIN = 4; // min seconds between new orders
export const ORDER_INTERVAL_MAX = 8; // max seconds between new orders
export const MAX_QUEUE = 4;

export const HOTDOG_PRICES: Record<string, number> = {
  plain: 3,
  sauce: 4,
  mustard: 4,
};

export const DAILY_TARGETS = [20, 35, 55, 80, 110, 150, 200, 260, 330, 400];

export const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: "grill_speed",
    name: "Turbo Grill",
    description: "Cooks sausages faster",
    cost: 15,
    icon: "🔥",
    maxLevel: 3,
    currentLevel: 0,
  },
  {
    id: "grill_slots",
    name: "Bigger Grill",
    description: "Add more sausage slots",
    cost: 20,
    icon: "🍳",
    maxLevel: 2,
    currentLevel: 0,
  },
  {
    id: "ready_window",
    name: "Heat Keeper",
    description: "Sausages stay ready longer",
    cost: 12,
    icon: "⏳",
    maxLevel: 3,
    currentLevel: 0,
  },
  {
    id: "patience",
    name: "Happy Vibes",
    description: "Customers wait longer",
    cost: 10,
    icon: "😊",
    maxLevel: 3,
    currentLevel: 0,
  },
];

export function getCookTime(upgrades: Upgrade[]): number {
  const speedUp = upgrades.find((u) => u.id === "grill_speed");
  const level = speedUp?.currentLevel ?? 0;
  return BASE_COOK_TIME * (1 - level * 0.2);
}

export function getReadyWindow(upgrades: Upgrade[]): number {
  const keeper = upgrades.find((u) => u.id === "ready_window");
  const level = keeper?.currentLevel ?? 0;
  return READY_WINDOW + level * 3;
}

export function getGrillSlots(upgrades: Upgrade[]): number {
  const bigger = upgrades.find((u) => u.id === "grill_slots");
  const level = bigger?.currentLevel ?? 0;
  return 3 + level;
}

export function getCustomerPatience(upgrades: Upgrade[]): number {
  const happy = upgrades.find((u) => u.id === "patience");
  const level = happy?.currentLevel ?? 0;
  return CUSTOMER_PATIENCE + level * 5;
}

export function getUpgradeCost(upgrade: Upgrade): number {
  return upgrade.cost * (upgrade.currentLevel + 1);
}
