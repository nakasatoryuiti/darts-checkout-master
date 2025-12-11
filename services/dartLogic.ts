import { DartThrow, SegmentType, CheckoutPath, GameMode } from '../types';

// Generate all possible single throws on a dart board
const generateValidThrows = (): DartThrow[] => {
  const throws: DartThrow[] = [];

  // Singles 1-20
  for (let i = 1; i <= 20; i++) {
    throws.push({ score: i, multiplier: 1, type: SegmentType.Single, display: `${i}`, value: i });
  }
  // Doubles 1-20
  for (let i = 1; i <= 20; i++) {
    throws.push({ score: i, multiplier: 2, type: SegmentType.Double, display: `D${i}`, value: i * 2 });
  }
  // Trebles 1-20
  for (let i = 1; i <= 20; i++) {
    throws.push({ score: i, multiplier: 3, type: SegmentType.Treble, display: `T${i}`, value: i * 3 });
  }
  // Bull (25)
  throws.push({ score: 25, multiplier: 1, type: SegmentType.Bull, display: '25', value: 25 });
  // Double Bull (50)
  throws.push({ score: 50, multiplier: 2, type: SegmentType.DoubleBull, display: 'BULL', value: 50 });

  return throws;
};

const ALL_THROWS = generateValidThrows();

/**
 * Calculates all possible checkout paths for a given score and game mode.
 * 
 * Rules:
 * - Single Out: Can finish on any segment.
 * - Master Out: Can finish on Treble, Double, Bull, or Double Bull.
 * - Double Out: Can finish on Double or Double Bull.
 * 
 * Sorting Strategy:
 * 1. Fewer darts is better.
 * 2. Special Rules: 
 *    - Master/Single Out (51-70): Prefer Single + Bull (50).
 *    - Double Out (>=32) or others: Prefer D16.
 * 3. Uniformity: Paths using the same number (e.g. T20, D20) are prioritized.
 * 4. High Value Start: Paths starting with larger numbers are shown first.
 */
export const calculateCheckouts = (target: number, mode: GameMode): CheckoutPath[] => {
  // 1. Determine Max Score and Finishers based on Mode
  let maxScore = 180;
  let finishers = ALL_THROWS;

  if (mode === 'double_out') {
    maxScore = 170;
    finishers = ALL_THROWS.filter(t => t.multiplier === 2 || t.type === SegmentType.DoubleBull);
  } else if (mode === 'master_out') {
    maxScore = 180;
    finishers = ALL_THROWS.filter(t => t.type !== SegmentType.Single);
  } else {
    // Single Out
    maxScore = 180;
    finishers = ALL_THROWS; // Any last dart is okay
  }

  if (target > maxScore || target < 1) return []; // Single out can finish on 1 (S1)

  // Impossible Double Out scores
  if (mode === 'double_out') {
    const impossible = [169, 168, 166, 165, 163, 162, 159];
    if (impossible.includes(target)) return [];
  }

  const paths: CheckoutPath[] = [];

  // --- 1 Dart Checkouts ---
  const oneDart = finishers.find(t => t.value === target);
  if (oneDart) {
    paths.push({ darts: [oneDart], remainder: 0, totalDarts: 1 });
  }

  // --- 2 Dart Checkouts ---
  for (const d1 of ALL_THROWS) {
    const remainder = target - d1.value;
    // For Double/Master Out, remainder must be >= 2 (lowest finisher D1/2). 
    // For Single Out, remainder can be 1 (S1).
    const minRem = mode === 'single_out' ? 1 : 2;
    if (remainder < minRem) continue;

    const validFinishers = finishers.filter(t => t.value === remainder);
    for (const finisher of validFinishers) {
      paths.push({ darts: [d1, finisher], remainder: 0, totalDarts: 2 });
    }
  }

  // --- 3 Dart Checkouts ---
  // Optimization: Only run if target is high enough or we want options
  for (const d1 of ALL_THROWS) {
    const r1 = target - d1.value;
    const minRem = mode === 'single_out' ? 1 : 2;
    // Optimization: Max 2-dart finish is 120 (T20+T20) or 100 (DB+DB) or 110 (T20+DB)
    // If r1 is too big, we can't finish in 2 more darts. Max 2 darts = 120 (T20x2).
    if (r1 < minRem || r1 > 120) continue;

    for (const d2 of ALL_THROWS) {
      const r2 = r1 - d2.value;
      if (r2 < minRem) continue;

      const validFinishers = finishers.filter(t => t.value === r2);
      for (const finisher of validFinishers) {
        paths.push({ darts: [d1, d2, finisher], remainder: 0, totalDarts: 3 });
      }
    }
  }

  // --- Sorting Logic ---
  return paths.sort((a, b) => {
    // 1. Total Darts ASC (Fewest is best)
    if (a.totalDarts !== b.totalDarts) {
      return a.totalDarts - b.totalDarts;
    }

    // 2. Special Rule for Master/Single Out in 51-70 range: Prefer Single + Bull (50)
    // This prioritizes "Single -> Bull" arrangements commonly used in Soft Darts.
    if ((mode === 'master_out' || mode === 'single_out') && target >= 51 && target <= 70) {
        const isBullFinish = (p: CheckoutPath) => p.darts[p.darts.length - 1].value === 50;
        const startsWithSingle = (p: CheckoutPath) => p.darts[0].type === SegmentType.Single;

        const aBull = isBullFinish(a);
        const bBull = isBullFinish(b);

        if (aBull && !bBull) return -1;
        if (!aBull && bBull) return 1;

        // If both end in Bull, prefer the one starting with Single (S# -> Bull) over others (D# -> Bull)
        if (aBull && bBull) {
            const aSingle = startsWithSingle(a);
            const bSingle = startsWithSingle(b);
            if (aSingle && !bSingle) return -1;
            if (!aSingle && bSingle) return 1;
        }
    }

    // 3. Prefer D16 Finish (Strategic Preference)
    // D16 is Double 16, value 32. 
    // This handles "If score >= 32, prefer D16" because for score < 32, no path ends in value 32.
    // Note: If the Bull rule above applied, it returns early. This only applies if not 51-70 Master/Single Out Bull scenario.
    const isD16 = (p: CheckoutPath) => {
        const last = p.darts[p.darts.length - 1];
        return last.value === 32 && last.type === SegmentType.Double;
    };
    
    const aD16 = isD16(a);
    const bD16 = isD16(b);

    if (aD16 && !bD16) return -1;
    if (!aD16 && bD16) return 1;

    // 4. Uniformity (Same Number Priority)
    // Check if all darts in the path use the same base score number (e.g. 20, D20, T20 are all '20')
    const isUniform = (path: CheckoutPath) => {
      const baseScore = path.darts[0].score;
      return path.darts.every(d => d.score === baseScore);
    };
    
    const aUniform = isUniform(a);
    const bUniform = isUniform(b);

    if (aUniform && !bUniform) return -1;
    if (!aUniform && bUniform) return 1;

    // 5. First Dart Value DESC (Big numbers first)
    // Compare dart by dart
    for (let i = 0; i < Math.min(a.darts.length, b.darts.length); i++) {
      if (a.darts[i].value !== b.darts[i].value) {
        return b.darts[i].value - a.darts[i].value;
      }
    }
    
    // 6. If values identical, prefer higher multipliers for first dart (T20 > S20? Handled by value usually)
    if (a.darts[0].multiplier !== b.darts[0].multiplier) {
      return b.darts[0].multiplier - a.darts[0].multiplier;
    }

    return 0;
  });
};