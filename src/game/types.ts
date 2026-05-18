import type Phaser from "phaser";

export type RankName = "ねむたまご" | "ちびポニ" | "ねむりポニ" | "ゆめみるポニ" | "レジェンドポニ";

export type GameResult = {
  score: number;
  rank: RankName;
  carriedFragments: number;
  depositedFragments: number;
  remainingSeconds: number;
  endedAt: string;
};

export type ArenaSceneOptions = {
  onGameOver?: (result: GameResult) => void;
};

export type DreamFragment = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody & {
  fragmentValue: number;
};

export type SleepyMonster = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody & {
  velocitySeed: number;
};
