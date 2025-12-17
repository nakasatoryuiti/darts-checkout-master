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

  return (
    <div className="min-h-screen bg-[#111] text-gray-100 font-sans pb-10">
      {/* Header */}
      <header className="bg-dart-black border-b border-gray-800 p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-dart-red w-6 h-6" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-dart-red to-dart-green bg-clip-text text-transparent hidden sm:block">
              Checkout Master
            </h1>
            <h1 className="text-xl font-bold bg-gradient-to-r from-dart-red to-dart-green bg-clip-text text-transparent sm:hidden">
              DartsMaster
            </h1>
          </div>
          {isValidScore && (
            <div className="text-xs sm:text-sm text-gray-400 bg-gray-900 px-2 py-1 rounded">
              {paths.length} Ways
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 flex flex-col items-center">
        
        {/* Mode Selector */}
        <div className="w-full mb-6 p-1 bg-gray-900 rounded-lg flex gap-1 relative overflow-hidden border border-gray-800">
           <ModeButton 
             active={gameMode === 'single_out'} 
             onClick={() => handleModeChange('single_out')}
             label="Single Out"
             icon={<ArrowUp01 size={16} />}
           />
           <ModeButton 
             active={gameMode === 'master_out'} 
             onClick={() => handleModeChange('master_out')}
             label="Master Out"
             icon={<Hexagon size={16} />}
           />
           <ModeButton 
             active={gameMode === 'double_out'} 
             onClick={() => handleModeChange('double_out')}
             label="Double Out"
             icon={<Crosshair size={16} />}
           />
        </div>

        {/* Score Display */}
        <div className="mb-6 w-full flex flex-col items-center">
            <div className="text-gray-400 text-xs sm:text-sm mb-1 uppercase tracking-widest font-semibold text-center">
              残りスコア ({gameMode === 'double_out' ? 'Double' : gameMode === 'master_out' ? 'Master' : 'Single'})
            </div>
            <div className={`
              text-7xl sm:text-8xl font-black tabular-nums tracking-tight transition-colors duration-300
              ${inputScore ? 'text-white' : 'text-gray-700'}
            `}>
              {inputScore || '0'}
            </div>
        </div>

        {/* Keypad */}
        <div className="w-full mb-8">
           <Keypad onKeyPress={handleKeyPress} onDelete={handleDelete} onClear={handleClear} />
        </div>

        {/* AI Advice Section */}
        {isValidScore && (
           <div className="w-full mb-8">
             {!advice && !loadingAdvice ? (
                <button 
                  onClick={handleGetAdvice}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-700 text-purple-100 font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(88,28,135,0.4)]"
                >
                  <BrainCircuit size={20} />
                  AIコーチに戦略を聞く
                </button>
             ) : (
                <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-sm uppercase tracking-wider">
                       {loadingAdvice ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                       {loadingAdvice ? 'AI思考中...' : 'Pro Coach Advice'}
                    </div>
                    <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                      {loadingAdvice ? '盤面を分析しています...' : advice}
                    </p>
                </div>
             )}
           </div>
        )}

        {/* Results List */}
        {isValidScore && paths.length === 0 ? (
           <div className="text-center py-10 opacity-50">
             <p className="text-xl font-semibold">チェックアウトできません</p>
             <p className="text-sm mt-2">（このルールでは上がれません）</p>
           </div>
        ) : (
          <div className="w-full space-y-8">
            
            {/* 1 Dart Finishes */}
            {groupedPaths[1].length > 0 && (
              <section>
                 <h2 className="text-dart-gold font-bold mb-4 flex items-center gap-2 text-lg border-b border-gray-800 pb-2">
                   <Trophy size={18} /> 1本上がり (Best)
                 </h2>
                 <div className="grid gap-3">
                   {groupedPaths[1].map((path, idx) => (
                     <CheckoutRow key={`1-${idx}`} path={path} />
                   ))}
                 </div>
              </section>
            )}

            {/* 2 Dart Finishes */}
            {groupedPaths[2].length > 0 && (
              <section>
                 <h2 className="text-dart-green font-bold mb-4 flex items-center gap-2 text-lg border-b border-gray-800 pb-2">
                   2本アレンジ
                 </h2>
                 <div className="grid gap-3">
                   {groupedPaths[2].slice(0, 20).map((path, idx) => (
                     <CheckoutRow key={`2-${idx}`} path={path} />
                   ))}
                   {groupedPaths[2].length > 20 && (
                     <p className="text-center text-xs text-gray-500 italic">他 {groupedPaths[2].length - 20} 通り...</p>
                   )}
                 </div>
              </section>
            )}

            {/* 3 Dart Finishes */}
            {groupedPaths[3].length > 0 && (
              <section>
                 <h2 className="text-blue-400 font-bold mb-4 flex items-center gap-2 text-lg border-b border-gray-800 pb-2">
                   3本アレンジ (Full House)
                 </h2>
                 <div className="grid gap-3">
                   {groupedPaths[3].slice(0, 50).map((path, idx) => (
                     <CheckoutRow key={`3-${idx}`} path={path} />
                   ))}
                    {groupedPaths[3].length > 50 && (
                     <p className="text-center text-xs text-gray-500 italic">他 {groupedPaths[3].length - 50} 通り...</p>
                   )}
                 </div>
              </section>
            )}
            
          </div>
        )}
      </main>
    </div>
  );
};

const ModeButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`
      flex-1 py-2 px-1 rounded-md text-xs sm:text-sm font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all
      ${active 
        ? 'bg-gradient-to-br from-dart-red to-red-700 text-white shadow-lg shadow-red-900/50 scale-[1.02]' 
        : 'text-gray-400 hover:text-white hover:bg-gray-800'}
    `}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden">{label.split(' ')[0]}</span>
  </button>
);

// Helper Component for a single row
const CheckoutRow: React.FC<{ path: CheckoutPath }> = ({ path }) => {
  // Check if uniform for styling highlight
  const isUniform = path.darts.length > 1 && path.darts.every(d => d.score === path.darts[0].score);

  return (
    <div className={`
      relative rounded-xl p-4 flex items-center justify-between shadow-sm transition-all
      ${isUniform 
        ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-dart-gold/40' 
        : 'bg-[#1e1e1e] border border-gray-800/50 hover:border-gray-600'}
    `}>
       {isUniform && (
         <div className="absolute -top-2 -right-2">
            <span className="bg-dart-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-lg">
              SAME {path.darts[0].score}
            </span>
         </div>
       )}
       <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center sm:justify-start">
          {path.darts.map((dart, i) => (
            <React.Fragment key={i}>
              <DartTag dart={dart} />
              {i < path.darts.length - 1 && (
                <div className="w-4 h-1 bg-gray-700 rounded-full hidden sm:block opacity-50"></div>
              )}
            </React.Fragment>
          ))}
       </div>
    </div>
  );
};

export default App;