"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GAME_HEIGHT, GAME_WIDTH, SCORE_STORAGE_KEY } from "@/game/constants";
import type { GameResult } from "@/game/types";

export default function GameClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<import("phaser").Game | null>(null);
  const router = useRouter();

  useEffect(() => {
    let disposed = false;

    async function bootGame() {
      if (!containerRef.current || gameRef.current) return;

      const [{ default: Phaser }, { NemuPoniArenaScene }] = await Promise.all([
        import("phaser"),
        import("@/game/NemuPoniArenaScene")
      ]);

      if (disposed || !containerRef.current) return;

      const handleGameOver = (result: GameResult) => {
        window.localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(result));
        const params = new URLSearchParams({ score: String(result.score), rank: result.rank });
        router.push(`/result?${params.toString()}`);
      };

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "#eefaff",
        physics: {
          default: "arcade",
          arcade: {
            debug: false,
            gravity: { x: 0, y: 0 }
          }
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [new NemuPoniArenaScene({ onGameOver: handleGameOver })]
      });
    }

    bootGame();

    return () => {
      disposed = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [router]);

  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/50 p-3 shadow-dream backdrop-blur">
      <div ref={containerRef} className="min-h-[280px] overflow-hidden rounded-[1.5rem] bg-dream-mist" />
    </div>
  );
}
