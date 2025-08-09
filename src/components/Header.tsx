import React from "react";
import type { UserSession } from "../types";

interface HeaderProps {
  session: UserSession | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionInfo = () => {
    if (!session) return "No Active Session";

    const duration = Math.floor(
      (Date.now() - session.sessionStarted.getTime()) / (1000 * 60)
    );
    return `${duration}min of emotional damage`;
  };

  return (
    <header className="wood-panel ugly-border border-b-4">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl sm:text-4xl font-comic font-black text-toxic-orange animate-bounce-annoying">
                !THERAPIST
              </h1>
              <p className="text-[10px] sm:text-xs font-ugly text-wood -mt-1 tracking-widest">
                ™ DEFINITELY NOT LICENSED ™
              </p>
            </div>

            {/* Fake Certificate Badge */}
            <div className="fake-certificate text-xs p-2 max-w-[120px] hidden md:block">
              <div className="font-bold text-wood">CERTIFIED</div>
              <div className="text-[8px] text-wood/80">
                Professional Roaster
              </div>
              <div className="text-[6px] text-wood/60">Est. 2024</div>
            </div>
          </div>

          {/* Session Info */}
          <div className="text-center sm:text-right">
            <div className="bg-hospital-green ugly-border px-2 sm:px-3 py-1 mb-2">
              <div className="font-comic text-xs sm:text-sm font-bold text-wood">
                SESSION: {session?.personalInfo.name || "Anonymous"}
              </div>
              <div className="font-ugly text-[10px] sm:text-xs text-wood/80">
                {getSessionInfo()}
              </div>
            </div>

            {/* Live Clock */}
            <div className="bg-puke-yellow ugly-border px-2 sm:px-3 py-1 font-comic text-xs font-bold text-wood">
              🕐 {getCurrentTime()}
              <span className="blink ml-1">●</span>
            </div>

            {/* Session Stats */}
            {session && (
              <div className="mt-2 flex flex-wrap justify-center sm:justify-end gap-1 sm:gap-2 text-xs">
                <span className="bg-vomit-green px-1 sm:px-2 py-1 ugly-border font-comic text-wood">
                  💬 {session.messageCount}
                </span>
                <span
                  className={`px-1 sm:px-2 py-1 ugly-border font-comic text-wood ${
                    session.currentTier === "mild"
                      ? "bg-hospital-green"
                      : session.currentTier === "medium"
                      ? "bg-toxic-orange"
                      : "bg-hot-pink animate-pulse"
                  }`}
                >
                  🔥 {session.currentTier.toUpperCase()}
                </span>
                {session.hasPaid && (
                  <span className="bg-beige px-1 sm:px-2 py-1 ugly-border font-comic text-wood">
                    💸 PAID
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scrolling Marquee */}
        <div className="mt-2 sm:mt-4 bg-wood text-beige py-1 overflow-hidden">
          <div className="animate-[scroll_20s_linear_infinite] whitespace-nowrap font-comic text-xs sm:text-sm">
            <span className="inline-block px-4 sm:px-8">
              🚨 WARNING: This is NOT real therapy! 🚨
            </span>
            <span className="inline-block px-4 sm:px-8">
              💀 Your feelings will be hurt! 💀
            </span>
            <span className="inline-block px-4 sm:px-8">
              🎭 For entertainment purposes only! 🎭
            </span>
            <span className="inline-block px-4 sm:px-8">
              🔞 May contain traces of brutal honesty! 🔞
            </span>
            <span className="inline-block px-4 sm:px-8">
              🚨 WARNING: This is NOT real therapy! 🚨
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
