import React, { useState, useEffect } from "react";
import type { MessageBubbleProps } from "../types";

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLatest }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimestamp, setShowTimestamp] = useState(false);

  useEffect(() => {
    // Animate message appearance
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getRoastTierIcon = () => {
    switch (message.roastTier) {
      case "mild":
        return "🌶️";
      case "medium":
        return "🌶️🌶️";
      case "nuclear":
        return "💀☢️💥";
      default:
        return "";
    }
  };

  const getAiAvatar = () => {
    const avatars = ["🎭", "💀", "😈", "🤖", "🔥", "💥", "😏", "🎪"];
    // Use message ID to get consistent avatar per message
    const index = message.id.charCodeAt(message.id.length - 1) % avatars.length;
    return avatars[index];
  };

  const getUserAvatar = () => {
    return "😔"; // Always sad face for users
  };

  if (message.sender === "user") {
    return (
      <div
        className={`flex justify-end mb-4 ${
          isVisible ? "animate-fade-in-right" : "opacity-0"
        }`}
      >
        <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
          <div className="flex flex-col">
            {/* Message Content */}
            <div
              className="message-bubble-user p-3 shadow-lg cursor-pointer"
              onClick={() => setShowTimestamp(!showTimestamp)}
            >
              <p className="text-sm leading-relaxed break-words">
                {message.content}
              </p>

              {/* Task indicator */}
              {message.isTask && (
                <div className="mt-2 text-xs font-bold text-vomit-green">
                  📝 TASK RESPONSE
                </div>
              )}
            </div>

            {/* Timestamp */}
            {showTimestamp && (
              <div className="text-xs text-wood/60 mt-1 text-right font-ugly">
                {formatTime(message.timestamp)}
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-hospital-green ugly-border flex items-center justify-center text-lg">
            {getUserAvatar()}
          </div>
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div
      className={`flex justify-start mb-4 ${
        isVisible ? "animate-fade-in-left" : "opacity-0"
      }`}
    >
      <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
        {/* AI Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-hot-pink ugly-border flex items-center justify-center text-lg animate-pulse">
          {getAiAvatar()}
        </div>

        <div className="flex flex-col">
          {/* Message Content */}
          <div
            className="message-bubble-ai p-3 shadow-lg cursor-pointer relative"
            onClick={() => setShowTimestamp(!showTimestamp)}
          >
            {/* Roast Tier Indicator */}
            {message.roastTier && (
              <div className="absolute -top-2 -right-2 text-lg animate-bounce-annoying">
                {getRoastTierIcon()}
              </div>
            )}

            <p className="text-sm leading-relaxed break-words">
              {message.content}
            </p>

            {/* Special message types */}
            {message.isPaywallResponse && (
              <div className="mt-2 text-xs font-bold text-toxic-orange">
                💸 PAYWALL RESPONSE
              </div>
            )}

            {/* AI Signature */}
            <div className="mt-2 text-xs text-wood/80 font-ugly italic">
              - !THERAPIST™{" "}
              {message.roastTier
                ? `[${message.roastTier.toUpperCase()} MODE]`
                : ""}
            </div>
          </div>

          {/* Timestamp */}
          {showTimestamp && (
            <div className="text-xs text-wood/60 mt-1 text-left font-ugly">
              {formatTime(message.timestamp)}
            </div>
          )}

          {/* Typing indicator for latest message */}
          {isLatest && (
            <div className="mt-1 text-xs text-wood/60 font-comic">
              !THERAPIST is probably judging you
              <span className="blink">...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
