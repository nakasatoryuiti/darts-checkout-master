export enum SegmentType {
  Single = 'S',
  Double = 'D',
  Treble = 'T',
  Bull = 'B', // 25
  DoubleBull = 'DB' // 50
}

export type GameMode = 'double_out' | 'master_out' | 'single_out';

export interface DartThrow {
  score: number;
  multiplier: 1 | 2 | 3;
  type: SegmentType;
  display: string;
  value: number; // The actual subtracted value (e.g., T20 = 60)
}

export interface CheckoutPath {
  darts: DartThrow[];
  remainder: number;
  totalDarts: number;
}

export interface CoachAdvice {
  score: number;
  advice: string;
}