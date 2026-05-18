import Link from "next/link";

const features = [
  "3分間の1人用スコアアタック",
  "ゆめのかけらを集めて、ゆめゴールでスコア化",
  "残り30秒はゴール時スコア2倍",
  "ねむけモンスター、障害物、回復エリアを配置"
];

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
      <nav className="mb-10 flex items-center justify-between rounded-full bg-white/60 px-5 py-3 text-sm font-bold shadow-dream backdrop-blur">
        <span>☾ 眠ノポニ Original Mini Game</span>
        <Link href="/ranking" className="text-dream-navy/80 hover:text-dream-navy">ランキング仮画面</Link>
      </nav>

      <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="dream-card rounded-[2rem] p-8 md:p-12">
          <p className="mb-4 inline-flex rounded-full bg-dream-moon/70 px-4 py-2 text-sm font-bold">ゆめかわMOBA風スコアアタック</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-dream-navy md:text-6xl">
            ねむポニ<br />アリーナ
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-dream-navy/75">
            ポニを操作して、星と月がきらめくアリーナに散らばった「ゆめのかけら」を集めよう。
            ねむけモンスターをかわしながら、自陣の「ゆめゴール」へ届けるほど高スコア！
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/play" className="dream-button bg-dream-navy text-white">ゲームスタート</Link>
            <Link href="/ranking" className="dream-button bg-white text-dream-navy">ランキングを見る</Link>
          </div>
        </div>

        <div className="dream-card rounded-[2rem] p-7">
          <div className="mb-5 rounded-[1.5rem] bg-gradient-to-br from-dream-sky to-white p-8 text-center text-7xl shadow-inner">🦄 ✦ ☾</div>
          <h2 className="text-2xl font-black">遊び方</h2>
          <ul className="mt-4 space-y-3 text-dream-navy/75">
            {features.map((feature) => (
              <li key={feature} className="flex gap-3"><span>✦</span><span>{feature}</span></li>
            ))}
          </ul>
          <p className="mt-5 rounded-2xl bg-white/70 p-4 text-sm font-bold">操作: WASD または 矢印キーで移動</p>
        </div>
      </section>
    </main>
  );
}
