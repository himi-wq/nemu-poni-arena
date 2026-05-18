import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ねむポニアリーナ",
  description: "ゆめのかけらを集めてゆめゴールへ届ける、1人用スコアアタックWebミニゲーム。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-10 top-10 text-5xl opacity-60">☾</div>
          <div className="absolute right-16 top-20 text-4xl opacity-60">✦</div>
          <div className="absolute bottom-10 left-1/4 text-3xl opacity-50">✧</div>
        </div>
        {children}
      </body>
    </html>
  );
}
