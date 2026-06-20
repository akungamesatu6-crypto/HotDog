import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onReady: () => void;
}

export function LoadingScreen({ onReady }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Fade in
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 300);
          return 100;
        }
        return p + Math.random() * 4 + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #1a0a00 0%, #3d1800 40%, #6b2d00 70%, #2d0d00 100%)",
        transition: "opacity 0.5s",
        opacity: show ? 1 : 0,
      }}
    >
      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-star"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: "#fff",
            top: `${Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Van illustration */}
      <div className="animate-float-van mb-6 select-none" style={{ fontSize: "5rem" }}>
        🚐
      </div>

      {/* Title */}
      <h1
        className="text-5xl font-black mb-2 text-center leading-tight"
        style={{
          color: "#ff9532",
          textShadow: "0 0 30px rgba(255,149,50,0.5), 0 4px 0 rgba(0,0,0,0.5)",
          fontFamily: "'Nunito', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        🌭 HOTDOG VAN
      </h1>
      <p
        className="text-lg mb-8 font-semibold"
        style={{ color: "#ffcc88", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
      >
        Street Food Tycoon
      </p>

      {/* Loading bar */}
      {!done ? (
        <div className="w-64 mb-4">
          <div
            className="rounded-full overflow-hidden"
            style={{ height: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,149,50,0.3)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, #ff6b00, #ffb347)",
                boxShadow: "0 0 10px rgba(255,107,0,0.6)",
              }}
            />
          </div>
          <p className="text-center mt-2 text-sm font-medium" style={{ color: "#ff9532" }}>
            Firing up the grill... {Math.min(Math.round(progress), 100)}%
          </p>
        </div>
      ) : (
        <button
          onClick={onReady}
          className="animate-bounce-in relative group cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #ff6b00, #ff9532)",
            border: "3px solid #ffb347",
            borderRadius: 999,
            padding: "14px 48px",
            color: "#fff",
            fontSize: "1.3rem",
            fontWeight: 900,
            letterSpacing: "0.05em",
            boxShadow: "0 0 20px rgba(255,107,0,0.5), 0 6px 0 rgba(150,50,0,0.8)",
            transition: "transform 0.1s, box-shadow 0.1s",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(4px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 10px rgba(255,107,0,0.5), 0 2px 0 rgba(150,50,0,0.8)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(255,107,0,0.5), 0 6px 0 rgba(150,50,0,0.8)";
          }}
        >
          ▶ PLAY NOW
        </button>
      )}

      {/* Tips */}
      <div className="absolute bottom-8 text-center" style={{ color: "rgba(255,200,150,0.6)", fontSize: "0.8rem" }}>
        Tap sausages to cook → Collect when golden → Serve customers!
      </div>
    </div>
  );
}
