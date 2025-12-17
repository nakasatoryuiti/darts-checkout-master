import React, { useState, useMemo } from 'react';
import { calculateCheckouts } from './services/dartLogic';
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

  const score = parseInt(inputScore, 10);
  const isValidScore = !isNaN(score) && score > 0 && score <= 240;

  const paths: CheckoutPath[] = useMemo(() => {
    if (!isValidScore) return [];
    return calculateCheckouts(score, gameMode);
  }, [score, isValidScore, gameMode]);

  const handleKeyPress = (key: string) => {
    if (inputScore.length >= 3) return;
    const newScore = inputScore + key;
    if (parseInt(newScore, 10) > 240) return; 
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

  const handleGetAdvice = async () => {
    if (!isValidScore) return;
    setLoadingAdvice(true);
    const result = await getDartsAdvice(score, gameMode);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  const groupedPaths = useMemo(() => {
    const groups: { [key: number]: CheckoutPath[] } = { 1: [], 2: [], 3: [] };
    paths.forEach(p => {
      if (groups[p.totalDarts]) groups[p.totalDarts].push(p);
    });
    return groups;
  }, [paths]);

  return (
    <div className="min-h-screen bg-neutral-950 p-4 sm:p-8 flex flex-col items-center font-sans text-neutral-100">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-red-600/20 rounded-2xl mb-2">
            <Target className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">DARTS CHECKOUT</h1>
          <p className="text-neutral-400 text-sm font-medium">Master your finish from 1 to 240</p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          {(['double_out', 'master_out'] as GameMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setGameMode(mode)}
              className={`py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                gameMode === mode ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {mode.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Score Display */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Hexagon className="w-20 h-20" />
          </div>
          <div className="relative">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Current Score</label>
            <div className="text-6xl font-black text-white mt-1 tabular-nums">
              {inputScore || '000'}
            </div>
          </div>
        </div>

        {/* Keypad */}
        <Keypad onKeyPress={handleKeyPress} onDelete={handleDelete} onClear={handleClear} inputScore={inputScore} />

        {/* AI Advice Button */}
        {isValidScore && (
          <button
            onClick={handleGetAdvice}
            disabled={loadingAdvice}
            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/20"
          >
            {loadingAdvice ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
            {loadingAdvice ? 'ANALYZING...' : 'GET AI ADVICE'}
          </button>
        )}

        {/* Advice Result */}
        {advice && (
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-3">
              <div className="mt-1"><BrainCircuit className="w-5 h-5 text-blue-400" /></div>
              <p className="text-sm leading-relaxed text-blue-100">{advice}</p>
            </div>
          </div>
        )}

        {/* Checkout Paths */}
        <div className="space-y-4 pt-4">
          {[1, 2, 3].map((num) => (
            groupedPaths[num].length > 0 && (
              <div key={num} className="space-y-3">
                <div className="flex items-center gap-2 text-neutral-500">
                  <div className="h-px flex-1 bg-neutral-800"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{num} Dart Finish</span>
                  <div className="h-px flex-1 bg-neutral-800"></div>
                </div>
                <div className="space-y-2">
                  {groupedPaths[num].map((path, idx) => (
                    <div key={idx} className="bg-neutral-900/50 border border-neutral-800 p-3 rounded-xl flex items-center justify-between group hover:border-neutral-700 transition-colors">
                      <div className="flex gap-2">
                        {path.darts.map((dart, dIdx) => (
                          <DartTag key={dIdx} dart={dart} />
                        ))}
                      </div>
                      <div className="text-[10px] font-bold text-neutral-600 group-hover:text-neutral-400">
                        {path.method}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;