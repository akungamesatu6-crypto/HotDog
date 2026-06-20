import { useGameState } from "./game/useGameState";
import { LoadingScreen } from "./components/LoadingScreen";
import { MenuScreen } from "./components/MenuScreen";
import { GameScreen } from "./components/GameScreen";
import { DayResult } from "./components/DayResult";
import { UpgradeShop } from "./components/UpgradeShop";

export default function App() {
  const {
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
  } = useGameState();

  if (state.phase === "loading") {
    return <LoadingScreen onReady={startGame} />;
  }

  if (state.phase === "menu") {
    return (
      <MenuScreen
        onStartDay={startDay}
        day={state.day}
        money={state.money}
        dailyTarget={state.dailyTarget}
      />
    );
  }

  if (state.phase === "playing") {
    return (
      <GameScreen
        state={state}
        onPlaceSausage={placeSausage}
        onCollectSausage={collectSausage}
        onClearBurned={clearBurned}
        onServeOrder={serveOrder}
        coinAnims={coinAnims}
        smokeAnims={smokeAnims}
      />
    );
  }

  if (state.phase === "day_result") {
    return (
      <DayResult
        day={state.day}
        dailyEarnings={state.dailyEarnings}
        dailyTarget={state.dailyTarget}
        totalMoney={state.money}
        customersServed={state.totalCustomersServed}
        ordersMissed={state.totalOrdersMissed}
        targetMet={state.targetMet}
        onProceedToUpgrades={proceedToUpgrades}
        onNextDay={nextDay}
      />
    );
  }

  if (state.phase === "upgrade_shop") {
    return (
      <UpgradeShop
        upgrades={state.upgrades}
        money={state.money}
        day={state.day}
        onPurchase={purchaseUpgrade}
        onNextDay={nextDay}
      />
    );
  }

  return null;
}
