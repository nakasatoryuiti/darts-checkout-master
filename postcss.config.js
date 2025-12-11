// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // index.html とすべてのtsxファイルをスキャン
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // ... ここにカスタムテーマ設定（Dart関連の色など）を記述
  },
  plugins: [],
}