"use client";

import { useEffect, useState } from "react";
import { Joyride, STATUS } from "react-joyride";

const TOUR_STEPS: any[] = [
  {
    target: "body",
    content: "Welcome to the AUI Club Management System! Let's take a quick tour.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: "[data-sidebar='sidebar']",
    content: "This is the main navigation. You can explore clubs, manage users, or run SQL queries here.",
    placement: "right",
  },
  {
    target: "a[href='/queries']",
    content: "The SQL Simulator lets you experiment with the database directly. Perfect for checking schemas!",
    placement: "right",
  },
  {
    target: "main",
    content: "This is where all the action happens. Feel free to explore!",
    placement: "left",
  }
];

export function TourProvider() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const handleStartTour = () => setRun(true);
    window.addEventListener("start-tour", handleStartTour);
    
    // Check if we should auto-start the tour for new users
    const hasSeenTour = localStorage.getItem("has_seen_tour");
    if (!hasSeenTour) {
       // Optional: Delay the initial tour slightly
       const t = setTimeout(() => setRun(true), 1500);
       return () => {
         clearTimeout(t);
         window.removeEventListener("start-tour", handleStartTour);
       }
    }

    return () => window.removeEventListener("start-tour", handleStartTour);
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("has_seen_tour", "true");
    }
  };

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#0f172a", // slate-900
          zIndex: 10000,
        },
      }}
    />
  );
}
