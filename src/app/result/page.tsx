import Link from "next/link";
import { RANKS, SHARE_HASHTAGS } from "@/game/constants";
import type { RankName } from "@/game/types";

function normalizeRank(rank?: string): RankName {
  return RANKS.some((item) => item.name === rank) ? (rank as RankName) : "ねむたまご";
}

export default async function ResultPage({ searchParams }: { searchParams?: Promise<{ score?: string; rank?: string }> }) {
  const params = await searchParams;
  const score = Number(params?.score ?? 0);
  const rank = normalizeRank(params?.rank);
  const rankInfo = RANKS.find((item) => item.name === rank) ?? RANKS[0];
  const shareText = `ねむポニアリーナで ${score} 点！ランクは「${rank}」でした。 ${SHARE_HASHTAGS.map((tag) => `#${tag}`).join(" ")}`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10">
      <section className="dream-card w-full rounded-[2rem] p-8 text-center md:p-12">
        <p className="text-5xl">☾ ✦ 🦄</p>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-dream-navy/50">Result</p>
        <h1 className="mt-2 text-4xl font-black text-dream-navy">試合終了</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white/75 p-6">
            <p className="text-sm font-bold text-dream-navy/55">Score</p>
            <p className="mt-2 text-5xl font-black">{score}</p>
          </div>
          <div className="rounded-3xl bg-dream-moon/60 p-6">
            <p className="text-sm font-bold text-dream-navy/55">Rank</p>
            <p className="mt-2 text-4xl font-black">{rank}</p>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-dream-navy/75">{rankInfo.message}</p>
        <div className="mt-8 rounded-3xl bg-white/70 p-5 text-left">
          <p className="mb-2 text-sm font-black">X投稿用テキスト</p>
          <p className="break-words text-dream-navy/75">{shareText}</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/play" className="dream-button bg-dream-navy text-white">もう一度遊ぶ</Link>
          <a href={shareUrl} target="_blank" rel="noreferrer" className="dream-button bg-dream-sky text-dream-navy">Xに投稿</a>
          <Link href="/" className="dream-button bg-white text-dream-navy">トップへ</Link>
        </div>
      </section>
    </main>
  );
}
