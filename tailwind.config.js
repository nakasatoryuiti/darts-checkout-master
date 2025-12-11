// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // 🚨 CONTENT 設定 (Tailwind が CSS クラスを含むファイルをスキャンするための設定) 🚨
  content: [
    // 1. HTML ファイルをスキャン対象に追加
    "./index.html",
    // 2. ルートディレクトリとそのサブディレクトリ内のすべての JS/TS/JSX/TSX ファイルを再帰的にスキャン
    //    (index.tsx や他のすべてのコンポーネントを確実に含める)
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 💡 必要であれば、ここにアプリケーション固有のカスタムカラーなどを追加
    },
  },
  plugins: [],
}