// App.tsx
import React, { useState, useMemo } from 'react';
import { calculateCheckouts } from './services/dartLogic';
// import { getDartsAdvice } from './services/geminiService'; // 🚨 コメントアウトを維持または確認
import { getDartsAdvice } from './services/geminiService';
import DartTag from './components/DartTag';
import Keypad from './components/Keypad';
import { CheckoutPath, GameMode } from './types';
import { Target, Trophy, BrainCircuit, Loader2, ArrowUp01, Crosshair, Hexagon } from 'lucide-react';

const App: React.FC = () => {
  const [inputScore, setInputScore] = useState<string>('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>('double_out');

  // Derive number from input
  const score = parseInt(inputScore, 10);
  
  // Validation limit depends on mode roughly, but let's cap at 180 for UI input safety
  const isValidScore = !isNaN(score) && score > 0 && score <= 240;

  // Memoize calculation
  const paths: CheckoutPath[] = useMemo(() => {
    if (!isValidScore) return [];
    return calculateCheckouts(score, gameMode);
  }, [score, isValidScore, gameMode]);

  // Handle Keypad Input
  const handleKeyPress = (key: string) => {
    if (inputScore.length >= 3) return; // Max 3 digits
    const newScore = inputScore + key;
    if (parseInt(newScore, 10) > 240) return; // Prevent > 180
    setInputScore(newScore);
    setAdvice(null);
  };

  const handleDelete = () => {
    setInputScore((prev) => prev.slice(0, -1));
    setAdvice(null);
  };

  const handleClear = () => {
    setInputScore('');
    setAdvice(null);
  };

  // Handler for AI Advice
  const handleGetAdvice = async () => {
    if (!isValidScore) return;
    setLoadingAdvice(true);
    const result = await getDartsAdvice(score, gameMode);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  // Group paths
  const groupedPaths = useMemo(() => {
    const groups: { [key: number]: CheckoutPath[] } = { 1: [], 2: [], 3: [] };
    paths.forEach(p => {
      if (groups[p.totalDarts]) groups[p.totalDarts].push(p);
    });
    return groups;
  }, [paths]);

  // Handle Mode Switch
  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setAdvice(null); // Reset advice as context changed
  };

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
