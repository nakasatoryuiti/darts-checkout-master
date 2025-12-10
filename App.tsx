// App.tsx
import React, { useState, useMemo } from 'react';
import { calculateCheckouts } from './services/dartLogic';
// import { getDartsAdvice } from './services/geminiService'; // 🚨 コメントアウトを維持または確認
import DartTag from './components/DartTag';
import Keypad from './components/Keypad';
import { CheckoutPath, GameMode } from './types';
import { Target, Trophy, BrainCircuit, Loader2, ArrowUp01, Crosshair, Hexagon } from 'lucide-react';

const App: React.FC = () => {
  const [inputScore, setInputScore] = useState<string>('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>('double_out');

  // ... (その他のロジックは残す)

  // 🚨 UI描画を強制するため、最も簡略化された return 文に変更
  // 画面が真っ暗な原因は、この return の前のどこかでアプリが停止しているためです。
  return (
    <div className="min-h-screen bg-dart-black p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-dart-cream mb-6">Darts Checkout Master</h1>
      <p className="text-white">最終テスト: UIが表示されています。</p>
      
      {/* 画面が表示されるか確認するため、Keypadのみを表示 */}
      <Keypad
        inputScore={inputScore}
        onKeyPress={() => {}} // ダミー関数
        onDelete={() => {}}
        onClear={() => {}}
      />
    </div>
  );
};

export default App;
