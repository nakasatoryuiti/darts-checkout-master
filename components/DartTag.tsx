import React from 'react';
import { DartThrow, SegmentType } from '../types';

interface DartTagProps {
  dart: DartThrow;
}

const DartTag: React.FC<DartTagProps> = ({ dart }) => {
  let bgColor = 'bg-gray-700';
  let textColor = 'text-white';
  let borderColor = 'border-gray-600';

  // Styling based on traditional dartboard colors
  switch (dart.type) {
    case SegmentType.Treble:
      bgColor = 'bg-dart-green'; // Green usually for T20, T19? Actually board alternates, but green stands out for Treble in UI.
      textColor = 'text-white';
      break;
    case SegmentType.Double:
      bgColor = 'bg-dart-red';
      textColor = 'text-white';
      break;
    case SegmentType.DoubleBull:
      bgColor = 'bg-dart-red';
      break;
    case SegmentType.Bull:
      bgColor = 'bg-dart-green';
      break;
    default:
      bgColor = 'bg-gray-800'; // Singles
      textColor = 'text-gray-200';
  }

  // Special override: visually, T20/T18/T12 are often Red, T19/T17 are Green.
  // But for a UI, consistent color coding for multipliers often helps readability more than realism.
  // Let's stick to: Treble = Green, Double = Red, Single = Black/DarkGray for high contrast.

  return (
    <div className={`
      flex items-center justify-center 
      w-12 h-12 sm:w-16 sm:h-16 
      rounded-full border-2 sm:border-4 ${borderColor} ${bgColor} 
      shadow-md shrink-0
    `}>
      <span className={`font-bold text-base sm:text-xl ${textColor} tracking-tighter`}>
        {dart.display}
      </span>
    </div>
  );
};

export default DartTag;