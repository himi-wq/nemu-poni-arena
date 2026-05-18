import Link from "next/link";

const mockRanks = [
  { name: "ポニ見習い", score: "---", rank: "準備中" },
  { name: "星あつめ隊", score: "---", rank: "準備中" },
  { name: "月夜ランナー", score: "---", rank: "準備中" }
];

export default function RankingPage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10">
      <section className="dream-card w-full rounded-[2rem] p-8 md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-dream-navy/50">Coming Soon</p>
        <h1 className="mt-2 text-4xl font-black text-dream-navy">ランキング仮画面</h1>
        <p className="mt-4 text-dream-navy/75">
          スコア保存とオンラインランキングは今後実装予定です。現在はUIの見た目だけを用意しています。
        </p>
        <div className="mt-8 space-y-3">
          {mockRanks.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between rounded-3xl bg-white/75 p-5">
              <div className="flex items-center gap-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-dream-moon font-black">{index + 1}</span>
                <div>
                  <p className="font-black">{item.name}</p>
                  <p className="text-sm text-dream-navy/55">{item.rank}</p>
                </div>
              </div>
              <p className="text-2xl font-black">{item.score}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/play" className="dream-button bg-dream-navy text-white">ゲームへ</Link>
          <Link href="/" className="dream-button bg-white text-dream-navy">トップへ</Link>
        </div>
      </section>
    </main>
  );
}
