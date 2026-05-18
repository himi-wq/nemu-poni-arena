import type { RankName } from "./types";

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const MATCH_SECONDS = 180;
export const DOUBLE_SCORE_SECONDS = 30;
export const PLAYER_SPEED = 230;
export const PLAYER_MAX_HEALTH = 100;
export const PLAYER_STARTING_HEALTH = 82;
export const FRAGMENT_COUNT = 24;
export const FRAGMENT_VALUE_MIN = 1;
export const FRAGMENT_VALUE_MAX = 5;
export const MONSTER_COUNT = 5;
export const MONSTER_SPEED = 92;
export const HIT_INVINCIBLE_MS = 1100;
export const SCORE_STORAGE_KEY = "nemu-poni-arena:last-result";

export const DREAM_GOAL = {
  x: 118,
  y: GAME_HEIGHT / 2,
  radius: 58
} as const;

export const HEAL_ZONE = {
  x: 750,
  y: 112,
  radius: 46,
  healPerSecond: 15
} as const;

export const OBSTACLES = [
  { x: 330, y: 126, width: 150, height: 34 },
  { x: 510, y: 300, width: 44, height: 162 },
  { x: 680, y: 410, width: 190, height: 34 },
  { x: 210, y: 420, width: 110, height: 30 }
] as const;

export const RANKS: Array<{ name: RankName; minScore: number; message: string }> = [
  { name: "ねむたまご", minScore: 0, message: "ここから夢の冒険がはじまるよ。" },
  { name: "ちびポニ", minScore: 80, message: "ゆめのかけら集めに慣れてきたね。" },
  { name: "ねむりポニ", minScore: 180, message: "ふわふわステップで安定感ばっちり。" },
  { name: "ゆめみるポニ", minScore: 320, message: "星明かりの中を駆ける名プレイヤー！" },
  { name: "レジェンドポニ", minScore: 520, message: "眠ノポニの夢を守る伝説級の輝き！" }
];

export const SHARE_HASHTAGS = ["ねむポニアリーナ", "眠ノポニ"];
