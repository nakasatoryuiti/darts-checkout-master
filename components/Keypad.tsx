import React from 'react';
import { Delete } from 'lucide-react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onDelete, onClear }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0'];

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto mt-2 sm:mt-4">
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => k === 'C' ? onClear() : onKeyPress(k)}
          className={`
            h-12 sm:h-14 rounded-lg font-bold text-lg sm:text-xl transition-all active:scale-95 touch-manipulation
            ${k === 'C' 
              ? 'bg-red-900/50 text-red-200 hover:bg-red-900/70' 
              : 'bg-gray-800 text-white hover:bg-gray-700 shadow-sm border-b-2 sm:border-b-4 border-gray-900'}
          `}
        >
          {k}
        </button>
      ))}
      <button
        onClick={onDelete}
        className="h-12 sm:h-14 rounded-lg flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 shadow-sm border-b-2 sm:border-b-4 border-gray-900 active:scale-95 active:border-b-0 active:translate-y-1 transition-all touch-manipulation"
      >
        <Delete size={20} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default Keypad;