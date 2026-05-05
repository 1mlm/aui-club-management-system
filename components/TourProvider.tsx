"use client";

import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Joyride, STATUS } = require("react-joyride");

const TOUR_STEPS = [
  {
    target: "body",
    content: (
      <div className="space-y-2">
        <p className="text-base font-semibold">Welcome to AUI Clubs 👋</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Discover student clubs, join communities, and stay connected with what's
          happening on campus. Let's take a quick look around.
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: "[data-sidebar='sidebar']",
    content: (
      <div className="space-y-2">
        <p className="text-sm font-semibold">Navigation</p>
        <p className="text-sm leading-relaxed">
          Browse clubs, check your dashboard, and access the SQL query simulator from here.
          Your joined clubs appear below once you're a member.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "a[href='/clubs']",
    content: (
      <div className="space-y-2">
        <p className="text-sm font-semibold">Browse Clubs</p>
        <p className="text-sm leading-relaxed">
          Explore all active clubs. Filter by color, search by name, and sort by member count or creation date.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "a[href='/dashboard']",
    content: (
      <div className="space-y-2">
        <p className="text-sm font-semibold">Your Dashboard</p>
        <p className="text-sm leading-relaxed">
          See your clubs, recent announcements from clubs you follow, and the status of your join requests — all in one place.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "a[href='/queries']",
    content: (
      <div className="space-y-2">
        <p className="text-sm font-semibold">SQL Simulator</p>
        <p className="text-sm leading-relaxed">
          Run live SQL queries against the club database. Great for exploring the schema or verifying data.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "main",
    content: (
      <div className="space-y-2">
        <p className="text-sm font-semibold">You're all set!</p>
        <p className="text-sm leading-relaxed">
          Start by browsing clubs and joining the ones that interest you. Club board members can post announcements and manage requests.
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
];

const tourStyles = {
  options: {
    zIndex: 10000,
    primaryColor: "hsl(var(--primary))",
    backgroundColor: "hsl(var(--popover))",
    textColor: "hsl(var(--popover-foreground))",
    arrowColor: "hsl(var(--popover))",
    overlayColor: "rgba(0,0,0,0.55)",
    width: 340,
  },
  tooltip: {
    borderRadius: "12px",
    padding: "18px 20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    border: "1px solid hsl(var(--border))",
    fontFamily: "inherit",
  },
  tooltipTitle: {
    display: "none",
  },
  tooltipContent: {
    padding: "0",
  },
  tooltipFooter: {
    marginTop: "14px",
    gap: "8px",
  },
  buttonNext: {
    backgroundColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
    borderRadius: "8px",
    padding: "7px 18px",
    fontSize: "13px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
  },
  buttonBack: {
    color: "hsl(var(--muted-foreground))",
    background: "transparent",
    borderRadius: "8px",
    padding: "7px 12px",
    fontSize: "13px",
    border: "1px solid hsl(var(--border))",
    marginRight: "4px",
    cursor: "pointer",
  },
  buttonSkip: {
    color: "hsl(var(--muted-foreground))",
    background: "transparent",
    fontSize: "12px",
    padding: "4px 8px",
    cursor: "pointer",
  },
  beacon: {
    display: "none",
  },
};

export function TourProvider() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const handleStartTour = () => setRun(true);
    window.addEventListener("start-tour", handleStartTour);

    const hasSeenTour = localStorage.getItem("has_seen_tour");
    if (!hasSeenTour) {
      const t = setTimeout(() => setRun(true), 1500);
      return () => {
        clearTimeout(t);
        window.removeEventListener("start-tour", handleStartTour);
      };
    }

    return () => window.removeEventListener("start-tour", handleStartTour);
  }, []);

  const handleCallback = (data: { status: string }) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem("has_seen_tour", "true");
    }
  };

  const JoyrideAny = Joyride as React.ElementType;

  return (
    <JoyrideAny
      steps={TOUR_STEPS}
      run={run}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      disableOverlayClose
      callback={handleCallback}
      styles={tourStyles}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next →",
        skip: "Skip tour",
      }}
    />
  );
}
