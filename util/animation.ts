import type { CSSProperties } from "react";

export function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function toSigned(range: number, rand: () => number) {
  return (rand() * 2 - 1) * range;
}

export function getClubFloatStyle(clubId: number): CSSProperties {
  const rand = seededRandom(clubId * 7919);
  const duration = 9 + rand() * 7;
  const delay = -(rand() * duration);
  const direction = rand() > 0.5 ? "alternate" : "alternate-reverse";

  const fx1 = toSigned(6, rand);
  const fx2 = toSigned(10, rand);
  const fx3 = toSigned(7, rand);
  const fx4 = toSigned(9, rand);
  const fy1 = -(7 + rand() * 8);
  const fy2 = -(10 + rand() * 10);
  const fy3 = -(8 + rand() * 9);
  const fy4 = -(5 + rand() * 7);
  const fr1 = toSigned(3, rand);
  const fr2 = toSigned(5, rand);
  const fr3 = toSigned(4, rand);
  const fr4 = toSigned(3, rand);
  const fs1 = 1 + toSigned(0.03, rand);
  const fs2 = 1 + toSigned(0.035, rand);
  const fs3 = 1 + toSigned(0.03, rand);
  const fs4 = 1 + toSigned(0.02, rand);
  const loopDrop = 10 + rand() * 7;

  return {
    animationDuration: `${duration.toFixed(2)}s`,
    animationDelay: `${delay.toFixed(2)}s`,
    animationDirection: direction,
    ["--fx1" as string]: `${fx1.toFixed(2)}px`,
    ["--fx2" as string]: `${fx2.toFixed(2)}px`,
    ["--fx3" as string]: `${fx3.toFixed(2)}px`,
    ["--fx4" as string]: `${fx4.toFixed(2)}px`,
    ["--fy1" as string]: `${fy1.toFixed(2)}px`,
    ["--fy2" as string]: `${fy2.toFixed(2)}px`,
    ["--fy3" as string]: `${fy3.toFixed(2)}px`,
    ["--fy4" as string]: `${fy4.toFixed(2)}px`,
    ["--fr1" as string]: `${fr1.toFixed(2)}deg`,
    ["--fr2" as string]: `${fr2.toFixed(2)}deg`,
    ["--fr3" as string]: `${fr3.toFixed(2)}deg`,
    ["--fr4" as string]: `${fr4.toFixed(2)}deg`,
    ["--fs1" as string]: fs1.toFixed(3),
    ["--fs2" as string]: fs2.toFixed(3),
    ["--fs3" as string]: fs3.toFixed(3),
    ["--fs4" as string]: fs4.toFixed(3),
    ["--f-loop-drop" as string]: `${loopDrop.toFixed(2)}px`,
  };
}
