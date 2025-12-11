// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // 🚨 CONTENT 設定 (Tailwind がどのファイル内のクラスをスキャンするかを指定) 🚨
  content: [
    // 1. HTMLファイル (index.html) をスキャン
    "./index.html",
    // 2. ルートディレクトリ内のすべての JavaScript/TypeScript/React ファイルをスキャン
    //    (index.tsx や他のコンポーネントファイルを含みます)
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 💡 ここに以前使っていたカスタムカラーやフォント設定などを追加します
      // 例: ダーツアプリで使用するカスタムカラーがあればここに追記してください
      // colors: {
      //   dart: {
      //     'primary': '#0070f3',
      //     'secondary': '#1e293b',
      //   },
      // },
    },
  },
  plugins: [],
}