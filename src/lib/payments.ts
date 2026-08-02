// Client-side payment config. The number clients send deposits to.
export const PLATFORM_PHONE = "+250794626004";

// Platform commission taken from each deposit (10%).
export const COMMISSION_RATE = 0.1;

export function platformFee(depositRwf: number): number {
  return Math.round(depositRwf * COMMISSION_RATE);
}

export function workerReceives(depositRwf: number): number {
  return depositRwf - platformFee(depositRwf);
}
