import React, { useState, useEffect } from "react";
import type { LoadingScreenProps } from "../types";

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  isVisible,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [dots, setDots] = useState("");

  const loadingMessages = [
    "Analyzing your life choices...",
    "Computing level of desperation...",
    "Loading roasting algorithms...",
    "Calibrating sarcasm levels...",
    "Preparing emotional damage...",
    "Initializing brutal honesty mode...",
    "Buffering your inevitable breakdown...",
    "Loading therapy.exe... ERROR 404: Help not found",
    "Scanning for remaining self-esteem...",
    "Warming up the insult generator...",
  ];

  const progressMessages = [
    "Please wait while we destroy your confidence...",
    "This is taking longer than your last relationship...",
    "Still loading... unlike your life, this actually works...",
    "Hang tight! This is more reliable than your coping mechanisms...",
    "Loading... At least SOMETHING in your life is making progress...",
  ];

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    // Animate progress bar (but make it go backwards sometimes for the lols)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Sometimes go backwards because why not
        if (Math.random() < 0.1) {
          return Math.max(0, prev - Math.random() * 20);
        }

        const increment = Math.random() * 15;
        const newProgress = prev + increment;

        // Don't let it complete (stay under 95%)
        return Math.min(95, newProgress);
      });
    }, 300);

    // Change loading message periodically
    const messageInterval = setInterval(() => {
      if (Math.random() < 0.7) {
        const randomMessage =
          loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        setCurrentMessage(randomMessage);
      } else {
        const randomProgress =
          progressMessages[Math.floor(Math.random() * progressMessages.length)];
        setCurrentMessage(randomProgress);
      }
    }, 2000);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-wood bg-opacity-95">
      <div className="wood-panel ugly-border p-8 max-w-md w-full mx-4 text-center">
        {/* Retro Computer Icon */}
        <div className="mb-6">
          <div className="text-6xl mb-2">💻</div>
          <div className="font-comic text-lg font-bold text-beige">
            !THERAPIST LOADING SYSTEM
          </div>
          <div className="font-ugly text-xs text-beige/80">
            Version 1.0 - Now with 50% more emotional damage!
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="mb-6">
          <div className="bg-hospital-green ugly-border h-8 relative overflow-hidden">
            {/* Actual Progress Bar */}
            <div
              className="fake-loading h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />

            {/* Progress Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center font-comic font-bold text-wood text-sm">
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Fake Memory Usage */}
          <div className="mt-2 text-xs font-ugly text-beige/80">
            Memory Usage: {Math.round(progress * 1.2)}MB / Your Self-Worth: 0MB
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-4">
          <div className="font-comic text-beige font-bold">
            {currentMessage}
            {dots}
          </div>
        </div>

        {/* Spinning Loader */}
        <div className="mb-4">
          <div className="text-4xl animate-spin-wrong inline-block">🎭</div>
        </div>

        {/* Fake System Messages */}
        <div className="bg-black/50 p-3 text-left font-mono text-xs text-hospital-green max-h-20 overflow-hidden">
          <div>Loading roast_engine.dll... OK</div>
          <div>Loading sarcasm_module.exe... OK</div>
          <div>Loading empathy_simulator.dll... FAILED</div>
          <div>Loading brutal_honesty.sys... OK</div>
          <div>Checking for feelings... NONE FOUND</div>
          <div>Initializing emotional_damage.exe...</div>
          <div className="blink">█</div>
        </div>

        {/* Warning Messages */}
        <div className="mt-4 text-xs font-comic text-toxic-orange">
          ⚠️ Warning: May cause irreversible damage to ego ⚠️
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
