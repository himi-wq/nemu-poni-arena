import Link from "next/link";
import GameClient from "@/components/GameClient";

export default function PlayPage() {
  return (
    <main className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-6 md:px-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-full bg-white/70 px-5 py-3 text-dream-navy shadow-dream backdrop-blur">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-dream-navy/50">Score Attack</p>
          <h1 className="text-xl font-black">ねむポニアリーナ</h1>
        </div>
        <Link href="/" className="dream-button bg-white px-5 py-2 text-sm text-dream-navy">トップへ戻る</Link>
      </header>

      <GameClient />

      <section className="mt-5 grid gap-4 text-sm text-dream-navy/75 md:grid-cols-3">
        <div className="dream-card rounded-3xl p-4"><strong>集める</strong><br />フィールド上の「ゆめのかけら」に触れると所持ポイントが増えます。</div>
        <div className="dream-card rounded-3xl p-4"><strong>届ける</strong><br />左側の「ゆめゴール」へ戻ると所持ポイントをスコアに変換します。</div>
        <div className="dream-card rounded-3xl p-4"><strong>かわす</strong><br />ねむけモンスターに当たると体力と所持ポイントが減ります。</div>
      </section>
    </main>
  );
}
