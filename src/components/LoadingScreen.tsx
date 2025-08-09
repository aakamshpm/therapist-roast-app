import { useEffect, useState } from "react";
import type { LoadingScreenProps } from "../types";

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  isVisible,
}) => {
  const [currentMessage, setCurrentMessage] = useState(message || "Loading...");
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const loadingMessages = [
    "Initializing emotional destruction engine...",
    "Loading sarcasm modules...",
    "Calibrating insult generators...",
    "Preparing your personal hell...",
    "Warming up the roast engine...",
    "Disabling empathy protocols...",
    "Loading your worst memories...",
    "Sharpening digital wit...",
    "Preparing premium cringe content...",
    "Charging emotional damage cannons...",
  ];

  const loadingTips = [
    "💡 TIP: This isn't real therapy, obviously",
    "💡 TIP: Your feelings WILL be hurt",
    "💡 TIP: We accept fake payments only",
    "💡 TIP: Confessions unlock premium roasting",
    "💡 TIP: The AI has no chill whatsoever",
    "💡 TIP: Your problems will definitely get worse",
    "💡 TIP: This is satire, not actual help",
    "💡 TIP: Emotional damage is the primary service",
  ];

  useEffect(() => {
    if (!isVisible) return;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Rotate loading messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
      );
    }, 800);

    // Rotate tips
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearInterval(tipInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-hot-pink via-ugly-teal to-puke-yellow flex items-center justify-center">
      <div className="wood-panel ugly-border max-w-lg w-full mx-4 p-8 text-center">
        {/* Main Logo/Icon */}
        <div className="text-8xl mb-6 animate-bounce-slow">🎭</div>

        {/* Title */}
        <h1 className="font-comic text-3xl font-bold text-beige mb-2">
          !THERAPIST™
        </h1>

        <p className="font-ugly text-beige/80 mb-6">
          Definitely Not Licensed Since 2024
        </p>

        {/* Loading Message */}
        <div className="bg-beige/90 ugly-border p-4 mb-6">
          <p className="font-comic text-wood font-bold animate-pulse">
            {currentMessage}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-wood/30 ugly-border h-6 overflow-hidden">
            <div
              className="h-full bg-toxic-orange transition-all duration-300 ease-out flex items-center justify-center"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <span className="text-xs font-comic font-bold text-wood">
                {Math.floor(Math.min(progress, 100))}%
              </span>
            </div>
          </div>
        </div>

        {/* Rotating Tips */}
        <div className="bg-vomit-green/20 ugly-border p-3 mb-4">
          <p className="text-xs font-ugly text-wood animate-fade-in">
            {loadingTips[currentTip]}
          </p>
        </div>

        {/* Fake System Status */}
        <div className="grid grid-cols-2 gap-2 text-xs font-ugly">
          <div className="bg-hospital-green/30 ugly-border p-2">
            <div className="text-wood/80">Roast Engine:</div>
            <div className="text-wood font-bold">ONLINE ✓</div>
          </div>
          <div className="bg-hot-pink/30 ugly-border p-2">
            <div className="text-wood/80">Empathy Module:</div>
            <div className="text-wood font-bold">OFFLINE ✗</div>
          </div>
          <div className="bg-toxic-orange/30 ugly-border p-2">
            <div className="text-wood/80">Sarcasm Level:</div>
            <div className="text-wood font-bold">MAXIMUM</div>
          </div>
          <div className="bg-beige/30 ugly-border p-2">
            <div className="text-wood/80">Your Dignity:</div>
            <div className="text-wood font-bold">LOADING...</div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-xs text-beige/60 font-ugly">
          ⚠️ Warning: Feelings will be hurt ⚠️
          <br />
          Not actual therapy • Entertainment only
        </div>

        {/* Loading Spinner */}
        <div className="mt-4 flex justify-center">
          <div className="animate-spin text-2xl">🎪</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
