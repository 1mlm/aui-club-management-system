import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useMemo, useState } from "react";
import { seededRandom } from "@/util/animation";
import type { Hugeicon } from "@/util/hugeicons";

const SLOW_REFERENCE_ICON_COUNT = 2;
const SLOW_REFERENCE_MIDPOINT_MS = 17500;
const FAST_REFERENCE_ICON_COUNT = 10;
const FAST_REFERENCE_MIDPOINT_MS = 4000;

const HOLD_JITTER_RATIO = 0.14;
const HOLD_MIN_FLOOR_MS = 2500;
const HOLD_MAX_CEILING_MS = 24000;

const HOLD_CURVE_A =
  (SLOW_REFERENCE_MIDPOINT_MS - FAST_REFERENCE_MIDPOINT_MS) /
  (1 / SLOW_REFERENCE_ICON_COUNT - 1 / FAST_REFERENCE_ICON_COUNT);
const HOLD_CURVE_B =
  SLOW_REFERENCE_MIDPOINT_MS - HOLD_CURVE_A / SLOW_REFERENCE_ICON_COUNT;

export const ICON_SWAP_MS = 560;

const ICON_STAGE_CLASSNAME = "icon-slide-stage size-10";
const ICON_ENTER_CLASSNAME =
  "icon-slide-layer icon-slide-incoming icon-slide-enter";
const ICON_EXIT_CLASSNAME =
  "icon-slide-layer icon-slide-outgoing icon-slide-exit";

const ICON_STAGE_STYLE: CSSProperties = {
  ["--icon-swap-ms" as string]: `${ICON_SWAP_MS}ms`,
};

type RotationState = {
  activeIndex: number;
  outgoingIndex: number | null;
  transitionKey: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTargetHoldMs(iconCount: number) {
  const safeIconCount = Math.max(iconCount, 2);
  const targetMs = HOLD_CURVE_A / safeIconCount + HOLD_CURVE_B;
  return clamp(targetMs, HOLD_MIN_FLOOR_MS, HOLD_MAX_CEILING_MS);
}

function getHoldDurationRangeMs(iconCount: number) {
  const targetMs = getTargetHoldMs(iconCount);
  const spreadMs = Math.max(650, targetMs * HOLD_JITTER_RATIO);

  const minMs = Math.floor(
    clamp(targetMs - spreadMs, HOLD_MIN_FLOOR_MS, HOLD_MAX_CEILING_MS),
  );
  const maxMs = Math.floor(
    clamp(targetMs + spreadMs, HOLD_MIN_FLOOR_MS, HOLD_MAX_CEILING_MS),
  );

  return {
    minMs: Math.min(minMs, maxMs),
    maxMs: Math.max(minMs, maxMs),
  };
}

function randomIntInRange(min: number, max: number, rand: () => number) {
  return min + Math.floor(rand() * (max - min + 1));
}

export function useDeterministicIconRotation(
  iconValues: Hugeicon[],
  clubId: number,
) {
  const icons = useMemo(
    () => iconValues.filter((icon): icon is Hugeicon => icon.length > 0),
    [iconValues],
  );

  const [state, setState] = useState<RotationState>({
    activeIndex: 0,
    outgoingIndex: null,
    transitionKey: 0,
  });

  useEffect(() => {
    if (icons.length === 0) return;
    if (icons.length === 1) {
      setState({
        activeIndex: 0,
        outgoingIndex: null,
        transitionKey: 0,
      });
      return;
    }

    let isCancelled = false;
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    const rand = seededRandom(clubId * 104729 + icons.length * 37);
    let transitionKey = 0;

    let currentIndex = Math.floor(rand() * icons.length);
    setState({
      activeIndex: currentIndex,
      outgoingIndex: null,
      transitionKey,
    });

    const registerTimeout = (callback: () => void, durationMs: number) => {
      const timeoutId = setTimeout(callback, durationMs);
      timeoutIds.push(timeoutId);
    };

    const scheduleNext = () => {
      const holdDurationRange = getHoldDurationRangeMs(icons.length);
      const holdDurationMs = randomIntInRange(
        holdDurationRange.minMs,
        holdDurationRange.maxMs,
        rand,
      );

      registerTimeout(() => {
        if (isCancelled) return;

        let nextIndex = Math.floor(rand() * icons.length);
        if (nextIndex === currentIndex) {
          nextIndex =
            (nextIndex + 1 + Math.floor(rand() * (icons.length - 1))) %
            icons.length;
        }

        transitionKey += 1;

        const outgoingIndex = currentIndex;
        currentIndex = nextIndex;

        setState({
          activeIndex: currentIndex,
          outgoingIndex,
          transitionKey,
        });

        registerTimeout(() => {
          if (isCancelled) return;
          setState((prev) => ({ ...prev, outgoingIndex: null }));
        }, ICON_SWAP_MS);

        scheduleNext();
      }, holdDurationMs);
    };

    scheduleNext();

    return () => {
      isCancelled = true;
      timeoutIds.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, [clubId, icons]);

  const activeIcon = icons[state.activeIndex] ?? icons[0];
  const outgoingIcon =
    state.outgoingIndex === null ? undefined : icons[state.outgoingIndex];

  const transitionProps: {
    stageProps: HTMLAttributes<HTMLDivElement>;
    incomingIconProps: { className: string };
    outgoingIconProps: { className: string };
  } = {
    stageProps: {
      className: ICON_STAGE_CLASSNAME,
      style: ICON_STAGE_STYLE,
    },
    incomingIconProps: {
      className: ICON_ENTER_CLASSNAME,
    },
    outgoingIconProps: {
      className: ICON_EXIT_CLASSNAME,
    },
  };

  return {
    activeIcon,
    outgoingIcon,
    transitionKey: state.transitionKey,
    transitionProps,
  };
}
