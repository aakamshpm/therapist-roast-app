import React, { useState, useEffect } from "react";
import type { FooterProps } from "../types";

const Footer: React.FC<FooterProps> = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState(42069); // Fake visitor counter
  const [showCredits, setShowCredits] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Randomly increment visitor counter for fake realism
      if (Math.random() < 0.1) {
        setVisitorCount((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getCurrentYear = () => new Date().getFullYear();

  const getRandomFooterMessage = () => {
    const messages = [
      "Destroying lives since 2024 💀",
      "Your feelings were hurt here ⚰️",
      "Making therapy worse, one roast at a time 🔥",
      "Certified to ruin your day ✅",
      "No refunds on emotional damage 🚫",
      "Warning: Side effects include reality checks 🚨",
    ];

    // Use current time to get different message every 10 seconds
    const index = Math.floor(Date.now() / 10000) % messages.length;
    return messages[index];
  };

  const handleCreditsToggle = () => {
    setShowCredits(!showCredits);
  };

  return (
    <footer className="wood-panel ugly-border border-t-4 mt-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Left Column - Branding */}
          <div className="space-y-2">
            <h3 className="font-comic text-lg font-bold text-beige">
              !THERAPIST™
            </h3>
            <p className="text-xs font-ugly text-beige/80 leading-relaxed">
              {getRandomFooterMessage()}
            </p>
            <div className="text-xs font-ugly text-beige/60">
              Visitor #{visitorCount.toLocaleString()}
            </div>
          </div>

          {/* Center Column - Quick Stats */}
          <div className="space-y-2">
            <h4 className="font-comic font-bold text-beige text-sm">
              TODAY'S DAMAGE REPORT
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-ugly">
              <div className="bg-hospital-green/30 ugly-border px-2 py-1">
                <div className="font-bold text-wood">
                  💔 {Math.floor(Math.random() * 500) + 100}
                </div>
                <div className="text-wood/80">Feelings Hurt</div>
              </div>
              <div className="bg-toxic-orange/30 ugly-border px-2 py-1">
                <div className="font-bold text-wood">
                  🎭 {Math.floor(Math.random() * 50) + 10}
                </div>
                <div className="text-wood/80">Egos Crushed</div>
              </div>
              <div className="bg-vomit-green/30 ugly-border px-2 py-1">
                <div className="font-bold text-wood">
                  🔥 {Math.floor(Math.random() * 200) + 50}
                </div>
                <div className="text-wood/80">Roasts Served</div>
              </div>
              <div className="bg-hot-pink/30 ugly-border px-2 py-1">
                <div className="font-bold text-wood">💸 ₹0</div>
                <div className="text-wood/80">Real Money</div>
              </div>
            </div>
          </div>

          {/* Right Column - Current Time & Status */}
          <div className="space-y-2">
            <h4 className="font-comic font-bold text-beige text-sm">
              SYSTEM STATUS
            </h4>
            <div className="space-y-1 text-xs font-ugly">
              <div className="flex justify-between items-center">
                <span className="text-beige/80">Server Time:</span>
                <span className="text-hospital-green font-bold">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour12: false,
                    timeZone: "UTC",
                  })}{" "}
                  UTC
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-beige/80">Roast Engine:</span>
                <span className="text-vomit-green font-bold blink">
                  ONLINE ●
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-beige/80">Empathy Module:</span>
                <span className="text-hot-pink font-bold">OFFLINE ✗</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-beige/80">Sarcasm Level:</span>
                <span className="text-toxic-orange font-bold">MAXIMUM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t-2 border-wood/30"></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright & Legal */}
          <div className="text-xs font-ugly text-beige/60 text-center md:text-left">
            <div>
              © {getCurrentYear()} !THERAPIST by{" "}
              <span className="text-toxic-orange font-bold">aakamshpm</span>
            </div>
            <div className="mt-1">
              ⚠️ Not licensed • Not real therapy • Definitely will hurt feelings
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleCreditsToggle}
              className="text-xs px-3 py-1 bg-beige/20 ugly-border font-comic text-beige 
                hover:bg-beige/30 transition-colors"
            >
              {showCredits ? "🙈 Hide" : "🎭 Credits"}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="text-xs px-3 py-1 bg-hospital-green/30 ugly-border font-comic text-wood 
                hover:bg-hospital-green/40 transition-colors"
            >
              🔄 Fresh Hell
            </button>
          </div>
        </div>

        {/* Expandable Credits Section */}
        {showCredits && (
          <div className="mt-6 bg-wood/20 ugly-border p-4 animate-fade-in-up">
            <h4 className="font-comic font-bold text-beige mb-3 text-center">
              🎪 THE CIRCUS BEHIND THE CURTAIN
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-ugly text-beige/80">
              <div>
                <div className="font-bold text-beige mb-1">
                  🤖 AI THERAPIST:
                </div>
                <div>Powered by Google Gemini</div>
                <div>Trained on pure chaos</div>
                <div>Empathy.exe not found</div>
              </div>
              <div>
                <div className="font-bold text-beige mb-1">🎨 UGLY DESIGN:</div>
                <div>90s nostalgia overload</div>
                <div>Comic Sans everywhere</div>
                <div>Colors that hurt your eyes</div>
              </div>
              <div>
                <div className="font-bold text-beige mb-1">⚙️ TECH STACK:</div>
                <div>React + TypeScript</div>
                <div>Tailwind CSS (badly)</div>
                <div>Your tears as database</div>
              </div>
              <div>
                <div className="font-bold text-beige mb-1">🎭 INSPIRATION:</div>
                <div>Every bad therapy session</div>
                <div>90s website disasters</div>
                <div>Your life choices</div>
              </div>
            </div>
            <div className="text-center mt-4 text-xs text-beige/60">
              Made with 💔 and zero empathy by aakamshpm
            </div>
          </div>
        )}

        {/* Scrolling Disclaimer */}
        <div className="mt-6 bg-wood text-beige py-1 overflow-hidden">
          <div className="animate-[scroll_20s_linear_infinite] whitespace-nowrap font-comic text-xs">
            <span className="inline-block px-8">
              🚨 DISCLAIMER: This is satire, not real therapy
            </span>
            <span className="inline-block px-8">
              💀 If you need real help, please seek actual professional therapy
            </span>
            <span className="inline-block px-8">
              🎭 This AI is intentionally mean for entertainment purposes only
            </span>
            <span className="inline-block px-8">
              🔞 May contain brutal honesty and hurt feelings
            </span>
            <span className="inline-block px-8">
              🚨 DISCLAIMER: This is satire, not real therapy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
