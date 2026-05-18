import Phaser from "phaser";
import {
  DOUBLE_SCORE_SECONDS,
  DREAM_GOAL,
  FRAGMENT_COUNT,
  FRAGMENT_VALUE_MAX,
  FRAGMENT_VALUE_MIN,
  GAME_HEIGHT,
  GAME_WIDTH,
  HEAL_ZONE,
  HIT_INVINCIBLE_MS,
  MATCH_SECONDS,
  MONSTER_COUNT,
  MONSTER_SPEED,
  OBSTACLES,
  PLAYER_MAX_HEALTH,
  PLAYER_SPEED,
  PLAYER_STARTING_HEALTH,
  RANKS
} from "./constants";
import type { ArenaSceneOptions, DreamFragment, GameResult, SleepyMonster } from "./types";

const TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "ui-rounded, system-ui, sans-serif",
  color: "#16213f"
};

export class NemuPoniArenaScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private fragments?: Phaser.Physics.Arcade.Group;
  private monsters?: Phaser.Physics.Arcade.Group;
  private obstacles?: Phaser.Physics.Arcade.StaticGroup;
  private scoreText?: Phaser.GameObjects.Text;
  private carryText?: Phaser.GameObjects.Text;
  private timeText?: Phaser.GameObjects.Text;
  private healthBar?: Phaser.GameObjects.Rectangle;
  private hintText?: Phaser.GameObjects.Text;
  private score = 0;
  private carriedFragments = 0;
  private depositedFragments = 0;
  private health = PLAYER_STARTING_HEALTH;
  private remainingSeconds = MATCH_SECONDS;
  private lastHitAt = 0;
  private finished = false;

  constructor(private readonly options: ArenaSceneOptions = {}) {
    super("NemuPoniArenaScene");
  }

  preload() {
    this.createCircleTexture("poni", 34, 0xd7ccff, 0xffffff, "🦄");
    this.createCircleTexture("fragment", 18, 0xfff7bf, 0x9ee7ff, "✦");
    this.createCircleTexture("monster", 30, 0x16213f, 0x9ee7ff, "💤");
  }

  create() {
    this.finished = false;
    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.drawArenaBackground();
    this.createGoalAndHealZone();
    this.createObstacles();
    this.createPlayer();
    this.createFragments();
    this.createMonsters();
    this.createHud();
    this.setupControlsAndCollisions();

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.tickTimer()
    });
  }

  update(time: number) {
    if (this.finished || !this.player) return;

    this.updatePlayerMovement();
    this.updateMonsterMovement(time);
    this.updateHealZone();
    this.updateGoalDeposit();
    this.updateHud();
  }

  private createCircleTexture(key: string, size: number, fill: number, stroke: number, emoji: string) {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(fill, 1);
    graphics.lineStyle(4, stroke, 1);
    graphics.fillCircle(size, size, size - 4);
    graphics.strokeCircle(size, size, size - 4);
    const text = this.add.text(size, size, emoji, { fontSize: `${Math.floor(size * 0.75)}px` }).setOrigin(0.5);
    graphics.generateTexture(`${key}-base`, size * 2, size * 2);
    text.destroy();
    graphics.destroy();
  }

  private drawArenaBackground() {
    this.cameras.main.setBackgroundColor("#eefaff");

    const sky = this.add.graphics();
    sky.fillGradientStyle(0x9ee7ff, 0x9ee7ff, 0xeefaff, 0xffffff, 1);
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    for (let i = 0; i < 42; i += 1) {
      const x = Phaser.Math.Between(24, GAME_WIDTH - 24);
      const y = Phaser.Math.Between(20, GAME_HEIGHT - 20);
      this.add.text(x, y, i % 5 === 0 ? "☾" : "✧", {
        ...TEXT_STYLE,
        fontSize: `${Phaser.Math.Between(13, 22)}px`,
        color: i % 5 === 0 ? "#fff7bf" : "#ffffff"
      }).setAlpha(0.75);
    }
  }

  private createGoalAndHealZone() {
    const goal = this.add.circle(DREAM_GOAL.x, DREAM_GOAL.y, DREAM_GOAL.radius, 0xffffff, 0.72);
    goal.setStrokeStyle(5, 0x9ee7ff, 0.95);
    this.add.text(DREAM_GOAL.x, DREAM_GOAL.y - 8, "ゆめ\nゴール", {
      ...TEXT_STYLE,
      align: "center",
      fontSize: "20px",
      fontStyle: "700"
    }).setOrigin(0.5);

    const heal = this.add.circle(HEAL_ZONE.x, HEAL_ZONE.y, HEAL_ZONE.radius, 0xa9ffd7, 0.4);
    heal.setStrokeStyle(3, 0xffffff, 0.9);
    this.add.text(HEAL_ZONE.x, HEAL_ZONE.y, "回復\nエリア", {
      ...TEXT_STYLE,
      align: "center",
      fontSize: "16px"
    }).setOrigin(0.5);
  }

  private createObstacles() {
    this.obstacles = this.physics.add.staticGroup();
    OBSTACLES.forEach((obstacle) => {
      const rect = this.add.rectangle(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 0x5d6f9f, 0.85);
      rect.setStrokeStyle(3, 0xffffff, 0.9);
      this.physics.add.existing(rect, true);
      this.obstacles?.add(rect);
    });
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(140, GAME_HEIGHT / 2, "poni-base");
    this.player.setCircle(30, 4, 4);
    this.player.setCollideWorldBounds(true);
    this.player.setDamping(true);
    this.player.setDrag(0.001);
    this.add.text(this.player.x, this.player.y - 38, "ポニ", {
      ...TEXT_STYLE,
      fontSize: "14px",
      fontStyle: "700"
    }).setOrigin(0.5).setName("playerLabel");
  }

  private createFragments() {
    this.fragments = this.physics.add.group();
    for (let i = 0; i < FRAGMENT_COUNT; i += 1) {
      this.spawnFragment();
    }
  }

  private createMonsters() {
    this.monsters = this.physics.add.group();
    for (let i = 0; i < MONSTER_COUNT; i += 1) {
      const monster = this.monsters.create(
        Phaser.Math.Between(430, GAME_WIDTH - 60),
        Phaser.Math.Between(70, GAME_HEIGHT - 70),
        "monster-base"
      ) as SleepyMonster;
      monster.setCircle(26, 4, 4);
      monster.setCollideWorldBounds(true);
      monster.setBounce(1, 1);
      monster.velocitySeed = Phaser.Math.FloatBetween(0.65, 1.35);
      this.physics.velocityFromAngle(Phaser.Math.Between(0, 360), MONSTER_SPEED * monster.velocitySeed, monster.body.velocity);
    }
  }

  private createHud() {
    const panel = this.add.rectangle(GAME_WIDTH / 2, 32, GAME_WIDTH - 40, 52, 0xffffff, 0.82);
    panel.setStrokeStyle(2, 0x9ee7ff, 0.9);
    this.scoreText = this.add.text(36, 18, "Score 0", { ...TEXT_STYLE, fontSize: "20px", fontStyle: "700" });
    this.carryText = this.add.text(194, 18, "所持 0", { ...TEXT_STYLE, fontSize: "20px" });
    this.timeText = this.add.text(GAME_WIDTH - 190, 18, "03:00", { ...TEXT_STYLE, fontSize: "20px", fontStyle: "700" });
    this.add.rectangle(474, 33, 154, 16, 0xffffff, 1).setStrokeStyle(2, 0x16213f, 0.35);
    this.healthBar = this.add.rectangle(400, 33, 148 * (this.health / PLAYER_MAX_HEALTH), 10, 0x76e5b4, 1).setOrigin(0, 0.5);
    this.hintText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 28, "WASD / 矢印キーで移動。ゆめのかけらを集めて、ゆめゴールへ届けよう。", {
      ...TEXT_STYLE,
      fontSize: "16px"
    }).setOrigin(0.5);
  }

  private setupControlsAndCollisions() {
    if (!this.input.keyboard || !this.player || !this.fragments || !this.monsters || !this.obstacles) return;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D") as Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.monsters, this.obstacles);
    this.physics.add.collider(this.monsters, this.monsters);
    this.physics.add.overlap(this.player, this.fragments, (_, fragment) => this.collectFragment(fragment as DreamFragment));
    this.physics.add.overlap(this.player, this.monsters, (_, monster) => this.hitMonster(monster as SleepyMonster));
  }

  private spawnFragment() {
    if (!this.fragments) return;

    const fragment = this.fragments.create(
      Phaser.Math.Between(230, GAME_WIDTH - 44),
      Phaser.Math.Between(70, GAME_HEIGHT - 58),
      "fragment-base"
    ) as DreamFragment;
    fragment.fragmentValue = Phaser.Math.Between(FRAGMENT_VALUE_MIN, FRAGMENT_VALUE_MAX);
    fragment.setCircle(16, 2, 2);
    fragment.setData("value", fragment.fragmentValue);
  }

  private updatePlayerMovement() {
    if (!this.player || !this.cursors || !this.wasd) return;

    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;
    const velocity = new Phaser.Math.Vector2(Number(right) - Number(left), Number(down) - Number(up));

    if (velocity.lengthSq() > 0) {
      velocity.normalize().scale(PLAYER_SPEED);
    }

    this.player.setVelocity(velocity.x, velocity.y);
    const label = this.children.getByName("playerLabel") as Phaser.GameObjects.Text | null;
    label?.setPosition(this.player.x, this.player.y - 38);
  }

  private updateMonsterMovement(time: number) {
    this.monsters?.children.iterate((child) => {
      const monster = child as SleepyMonster;
      if (!monster.body) return true;

      const wave = Math.sin(time / 900 + monster.velocitySeed * 8) * 25;
      const currentAngle = Phaser.Math.RadToDeg(monster.body.velocity.angle());
      this.physics.velocityFromAngle(currentAngle + wave * 0.01, MONSTER_SPEED * monster.velocitySeed, monster.body.velocity);
      return true;
    });
  }

  private updateHealZone() {
    if (!this.player) return;

    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, HEAL_ZONE.x, HEAL_ZONE.y);
    if (distance <= HEAL_ZONE.radius && this.health < PLAYER_MAX_HEALTH) {
      this.health = Math.min(PLAYER_MAX_HEALTH, this.health + HEAL_ZONE.healPerSecond / 60);
    }
  }

  private updateGoalDeposit() {
    if (!this.player || this.carriedFragments <= 0) return;

    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, DREAM_GOAL.x, DREAM_GOAL.y);
    if (distance > DREAM_GOAL.radius) return;

    const multiplier = this.remainingSeconds <= DOUBLE_SCORE_SECONDS ? 2 : 1;
    const gained = this.carriedFragments * 10 * multiplier;
    this.score += gained;
    this.depositedFragments += this.carriedFragments;
    this.carriedFragments = 0;
    this.flashHint(multiplier === 2 ? `ラストスパート2倍！ +${gained}` : `ゆめゴールへお届け！ +${gained}`);
  }

  private collectFragment(fragment: DreamFragment) {
    this.carriedFragments += fragment.fragmentValue;
    fragment.destroy();
    this.spawnFragment();
  }

  private hitMonster(monster: SleepyMonster) {
    const now = this.time.now;
    if (now - this.lastHitAt < HIT_INVINCIBLE_MS) return;

    this.lastHitAt = now;
    this.health = Math.max(0, this.health - 18);
    const lost = Math.ceil(this.carriedFragments * 0.4);
    this.carriedFragments = Math.max(0, this.carriedFragments - lost);
    this.cameras.main.shake(150, 0.006);
    monster.setTint(0xff9ecb);
    this.time.delayedCall(220, () => monster.clearTint());
    this.flashHint(lost > 0 ? `ねむけモンスターにぶつかった！ 所持 -${lost}` : "ねむけモンスターに注意！");

    if (this.health <= 0) {
      this.finishGame();
    }
  }

  private tickTimer() {
    if (this.finished) return;
    this.remainingSeconds -= 1;
    if (this.remainingSeconds <= DOUBLE_SCORE_SECONDS) {
      this.timeText?.setColor("#ff6b9c");
    }
    if (this.remainingSeconds <= 0) {
      this.finishGame();
    }
  }

  private updateHud() {
    this.scoreText?.setText(`Score ${this.score}`);
    this.carryText?.setText(`所持 ${this.carriedFragments}`);
    const minutes = Math.floor(Math.max(0, this.remainingSeconds) / 60).toString().padStart(2, "0");
    const seconds = Math.max(0, this.remainingSeconds % 60).toString().padStart(2, "0");
    this.timeText?.setText(`${minutes}:${seconds}`);
    this.healthBar?.setDisplaySize(148 * (this.health / PLAYER_MAX_HEALTH), 10);
  }

  private flashHint(message: string) {
    this.hintText?.setText(message);
    this.hintText?.setColor("#ff6b9c");
    this.time.delayedCall(950, () => {
      this.hintText?.setText("WASD / 矢印キーで移動。ゆめのかけらを集めて、ゆめゴールへ届けよう。");
      this.hintText?.setColor("#16213f");
    });
  }

  private finishGame() {
    if (this.finished) return;
    this.finished = true;
    this.physics.pause();
    const rank = [...RANKS].reverse().find((item) => this.score >= item.minScore)?.name ?? "ねむたまご";
    const result: GameResult = {
      score: this.score,
      rank,
      carriedFragments: this.carriedFragments,
      depositedFragments: this.depositedFragments,
      remainingSeconds: Math.max(0, this.remainingSeconds),
      endedAt: new Date().toISOString()
    };

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 430, 190, 0xffffff, 0.92).setStrokeStyle(4, 0x9ee7ff, 1);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 28, "試合終了", { ...TEXT_STYLE, fontSize: "34px", fontStyle: "700" }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 22, `Score ${result.score} / ${result.rank}`, { ...TEXT_STYLE, fontSize: "24px" }).setOrigin(0.5);
    this.time.delayedCall(900, () => this.options.onGameOver?.(result));
  }
}
