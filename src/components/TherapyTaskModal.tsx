import React, { useState, useEffect } from "react";
import type { TherapyTaskProps } from "../types";

const TherapyTaskModal: React.FC<TherapyTaskProps> = ({
  task,
  onComplete,
  onSkip,
  isVisible,
}) => {
  const [taskResponse, setTaskResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second timer
  const [showTimer, setShowTimer] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isVisible && task) {
      setTaskResponse("");
      setIsSubmitting(false);
      setTimeLeft(30);
      setShowTimer(true);
    }
  }, [isVisible, task]);

  // Countdown timer effect
  useEffect(() => {
    if (!showTimer || !isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowTimer(false);
          // Auto-skip when timer runs out
          setTimeout(() => onSkip(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer, isVisible, onSkip]);

  if (!isVisible || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskResponse.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Fake processing delay with random message
    const processingMessages = [
      "Analyzing your pathetic response...",
      "Computing cringe levels...",
      "Preparing brutal feedback...",
      "Judging your life choices...",
      "Processing disappointment...",
    ];

    setTimeout(() => {
      setIsSubmitting(false);
      onComplete(taskResponse.trim());
    }, 2000);
  };

  const handleSkip = () => {
    setShowTimer(false);
    onSkip();
  };

  const getTaskIcon = () => {
    const icons = ["📝", "🎯", "💀", "🎭", "🔥", "💣", "⚡", "🚨"];
    // Use task ID to get consistent icon
    const index = task.id.charCodeAt(0) % icons.length;
    return icons[index];
  };

  const getRandomEncouragement = () => {
    const encouragements = [
      "Come on, disappoint me!",
      "This should be easy for you!",
      "You've made worse decisions!",
      "Just embarrass yourself already!",
      "Your failure is inevitable!",
      "Let's get this over with!",
      "Prove how hopeless you are!",
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="wood-panel ugly-border max-w-lg w-full mx-4 p-6 relative animate-fade-in-up">
        {/* Timer Bar */}
        {showTimer && (
          <div className="absolute top-0 left-0 right-0 h-2 bg-wood/30 overflow-hidden">
            <div
              className="h-full bg-toxic-orange transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 mt-2">
          <div className="text-4xl mb-2 animate-bounce-annoying">
            {getTaskIcon()}
          </div>
          <h2 className="font-comic text-xl font-bold text-beige">
            THERAPY TASK ACTIVATED!
          </h2>
          <p className="font-ugly text-sm text-beige/80 mt-1">
            Complete this to prove you're not completely hopeless
          </p>

          {/* Timer Display */}
          {showTimer && (
            <div
              className={`mt-3 font-comic font-bold text-lg ${
                timeLeft <= 10
                  ? "text-hot-pink animate-pulse"
                  : "text-toxic-orange"
              }`}
            >
              ⏰ {timeLeft}s remaining
            </div>
          )}
        </div>

        {/* Task Content */}
        <div className="bg-beige/90 ugly-border p-4 mb-6">
          <h3 className="font-comic font-bold text-wood mb-3 text-center">
            YOUR PATHETIC TASK:
          </h3>
          <p className="font-comic text-wood text-center leading-relaxed">
            {task.prompt}
          </p>
        </div>

        {/* Response Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-comic font-bold text-beige mb-2">
              Your Response: {getRandomEncouragement()}
            </label>

            {task.expectedResponse ? (
              // Simple text input for exact responses
              <input
                type="text"
                value={taskResponse}
                onChange={(e) => setTaskResponse(e.target.value)}
                placeholder="Type exactly what's asked... if you can read"
                className="w-full p-3 font-comic text-wood bg-hospital-green ugly-border 
                  placeholder-wood/60 focus:outline-none focus:ring-2 focus:ring-hot-pink
                  disabled:opacity-50"
                maxLength={100}
                disabled={isSubmitting || !showTimer}
                autoFocus
              />
            ) : (
              // Textarea for longer responses
              <textarea
                value={taskResponse}
                onChange={(e) => setTaskResponse(e.target.value)}
                placeholder="Spill your embarrassing details here... the more pathetic, the better!"
                className="w-full p-3 font-comic text-wood bg-hospital-green ugly-border 
                  placeholder-wood/60 focus:outline-none focus:ring-2 focus:ring-hot-pink
                  disabled:opacity-50 resize-none"
                rows={4}
                maxLength={300}
                disabled={isSubmitting || !showTimer}
                autoFocus
              />
            )}

            <div className="text-xs text-beige/60 text-right font-ugly mt-1">
              {taskResponse.length}/{task.expectedResponse ? "100" : "300"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="retro-button flex-1 py-3 px-4 font-comic font-bold text-sm 
                bg-gray-500 hover:bg-gray-600 disabled:opacity-50"
            >
              🙄 I'M TOO PATHETIC
            </button>

            <button
              type="submit"
              disabled={!taskResponse.trim() || isSubmitting || !showTimer}
              className={`retro-button flex-1 py-3 px-4 font-comic font-bold text-sm
                ${
                  !taskResponse.trim() || isSubmitting || !showTimer
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-vomit-green hover:bg-vomit-green/80"
                }
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="animate-spin">{getTaskIcon()}</span>
                  <span>JUDGING...</span>
                </span>
              ) : (
                "🎯 SUBMIT FAILURE"
              )}
            </button>
          </div>
        </form>

        {/* Progress Indicator */}
        <div className="mt-4 text-center">
          <div className="text-xs font-ugly text-beige/60">
            Complete tasks to unlock more creative insults!
          </div>
          <div className="flex justify-center space-x-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  Math.random() < 0.6 ? "bg-vomit-green" : "bg-wood/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-6 bg-hot-pink/20 ugly-border p-3 text-center">
          <p className="font-comic text-xs text-beige">
            💡 <strong>TIP:</strong> The more honest you are, the more I can
            hurt you! It's a win-win... well, win-lose for you! 😈
          </p>
        </div>
      </div>
    </div>
  );
};

export default TherapyTaskModal;
