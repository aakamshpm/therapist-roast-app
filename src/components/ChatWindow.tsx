import React, { useState, useRef, useEffect } from "react";
import type { ChatWindowProps } from "../types";
import MessageBubble from "./MessageBubble";

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isTyping,
  session,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Disable input when typing
  useEffect(() => {
    setIsInputDisabled(isTyping);
  }, [isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMessage.trim() && !isInputDisabled) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Submit on Enter (but not Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const getPlaceholderText = () => {
    if (isTyping) return "!THERAPIST is typing something brutal...";
    if (!session) return "Loading your personal hell...";

    const placeholders = [
      "Type your problems here (I'll make them worse)...",
      "What fresh disaster shall we discuss?",
      "Share your latest bad life choice...",
      "Tell me something I can mock you for...",
      "Spill your emotional baggage here...",
      "What's broken in your life today?",
      "Type here to continue your downward spiral...",
      "Share your feelings (so I can crush them)...",
    ];

    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  const getInputIcon = () => {
    if (isTyping) return "⏳";
    if (inputMessage.trim()) return "🚀";
    return "💬";
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-300px)]">
      {/* Chat Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] bg-beige/20 ugly-border"
        style={{
          scrollBehavior: "smooth",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Welcome Message for Empty Chat */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="font-comic text-2xl font-bold text-wood mb-2">
              Welcome to Your Personal Hell!
            </h2>
            <p className="font-ugly text-wood/80 max-w-md mx-auto">
              I'm !THERAPIST, your definitely-not-licensed AI therapist. I'm
              here to make your problems worse in the most entertaining way
              possible!
            </p>
            <div className="mt-4 animate-bounce">
              <span className="text-sm font-comic text-toxic-orange">
                Start typing to begin your emotional destruction! 💀
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLatest={index === messages.length - 1}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
              {/* AI Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-hot-pink ugly-border flex items-center justify-center text-lg animate-pulse">
                🤖
              </div>

              <div className="message-bubble-ai p-3">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-wood rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-wood rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-wood rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <div className="text-xs text-wood/60 mt-1 font-comic">
                  Preparing your emotional damage...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 wood-panel ugly-border border-t-4">
        {/* Session Status Bar */}
        {session && (
          <div className="mb-3 flex justify-between items-center text-xs font-comic">
            <div className="flex space-x-4">
              <span className="text-wood/80">
                Messages: {session.messageCount}
              </span>
              <span
                className={`font-bold ${
                  session.currentTier === "mild"
                    ? "text-hospital-green"
                    : session.currentTier === "medium"
                    ? "text-toxic-orange"
                    : "text-hot-pink"
                }`}
              >
                Roast Level: {session.currentTier.toUpperCase()}
              </span>
            </div>

            <div className="flex space-x-2 text-wood/60">
              {session.hasHitPaywall && <span>💸</span>}
              {session.hasConfessed && <span>🤐</span>}
              {session.hasPaid && <span>🎪</span>}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isInputDisabled}
              placeholder={getPlaceholderText()}
              className={`w-full px-4 py-3 font-comic text-wood bg-hospital-green ugly-border 
                placeholder-wood/60 focus:outline-none focus:ring-2 focus:ring-hot-pink
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isInputDisabled ? "animate-pulse" : ""}
              `}
              maxLength={500}
            />

            {/* Character Counter */}
            <div className="absolute right-2 bottom-1 text-xs font-ugly text-wood/40">
              {inputMessage.length}/500
            </div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || isInputDisabled}
            className={`retro-button px-6 py-3 font-comic font-bold 
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                !inputMessage.trim() || isInputDisabled
                  ? "bg-gray-400"
                  : "bg-toxic-orange hover:bg-toxic-orange/80"
              }
            `}
          >
            <span className="flex items-center space-x-2">
              <span>{getInputIcon()}</span>
              <span>{isTyping ? "WAIT" : "ROAST"}</span>
            </span>
          </button>
        </form>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {!isInputDisabled && inputMessage.length === 0 && (
            <>
              <button
                onClick={() => setInputMessage("I need help with my life")}
                className="text-xs px-3 py-1 bg-vomit-green ugly-border font-comic text-wood hover:bg-vomit-green/80"
              >
                💀 Help me
              </button>
              <button
                onClick={() => setInputMessage("I made a terrible decision")}
                className="text-xs px-3 py-1 bg-hospital-green ugly-border font-comic text-wood hover:bg-hospital-green/80"
              >
                🤦‍♂️ Bad choice
              </button>
              <button
                onClick={() =>
                  setInputMessage("I'm having relationship problems")
                }
                className="text-xs px-3 py-1 bg-puke-yellow ugly-border font-comic text-wood hover:bg-puke-yellow/80"
              >
                💔 Love issues
              </button>
              <button
                onClick={() => setInputMessage("I hate my job")}
                className="text-xs px-3 py-1 bg-beige ugly-border font-comic text-wood hover:bg-beige/80"
              >
                😤 Work sucks
              </button>
            </>
          )}
        </div>

        {/* Fake Disclaimer */}
        <div className="mt-3 text-xs text-wood/40 font-ugly text-center">
          ⚠️ Warning: This AI will hurt your feelings ⚠️ | Not actual therapy |
          Entertainment only
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
