import React, { useState, useEffect } from "react";
import type { PaywallModalProps } from "../types";

const PaywallModal: React.FC<PaywallModalProps> = ({
  prompt,
  onPayment,
  onConfession,
  onDismiss,
  isVisible,
}) => {
  const [confessionText, setConfessionText] = useState("");
  const [showConfessionInput, setShowConfessionInput] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [confessionLoading, setConfessionLoading] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isVisible) {
      setConfessionText("");
      setShowConfessionInput(false);
      setPaymentLoading(false);
      setConfessionLoading(false);
    }
  }, [isVisible]);

  if (!isVisible || !prompt) return null;

  const handlePayment = async () => {
    setPaymentLoading(true);

    // Fake payment processing delay
    setTimeout(() => {
      setPaymentLoading(false);
      onPayment();
    }, 2000);
  };

  const handleConfessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confessionText.trim()) return;

    setConfessionLoading(true);

    // Fake processing delay
    setTimeout(() => {
      setConfessionLoading(false);
      onConfession(confessionText.trim());
    }, 1500);
  };

  const getRandomPaymentMethod = () => {
    const methods = [
      "💳 Credit Card",
      "🏧 Debit Card",
      "📱 UPI",
      "💰 PayPal",
      "🪙 Crypto",
    ];
    return methods[Math.floor(Math.random() * methods.length)];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="wood-panel ugly-border max-w-md w-full mx-4 p-6 relative animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-2xl text-beige hover:text-toxic-orange transition-colors"
          aria-label="Close"
        >
          ❌
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2 animate-bounce-annoying">🚨</div>
          <h2 className="font-comic text-xl font-bold text-beige">
            PAYWALL ACTIVATED!
          </h2>
          <p className="font-ugly text-sm text-beige/80 mt-1">
            Your free trial of emotional damage has expired!
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-beige/90 ugly-border p-4 mb-6">
          <p className="font-comic text-wood text-center font-bold">
            {prompt.message}
          </p>
        </div>

        {/* Payment Option */}
        <div className="mb-4">
          <div className="bg-hospital-green ugly-border p-4 mb-3">
            <h3 className="font-comic font-bold text-wood mb-2 flex items-center">
              💸 OPTION 1: PAY UP, BUTTERCUP!
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-toxic-orange mb-2">
                {prompt.paymentAmount || "₹999.99"}
              </div>
              <p className="text-xs text-wood/80 font-ugly mb-3">
                *Not a real payment system, obviously
              </p>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className={`retro-button w-full py-2 px-4 font-comic font-bold text-sm
                  ${
                    paymentLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-toxic-orange hover:bg-toxic-orange/80"
                  }
                `}
              >
                {paymentLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="animate-spin">💸</span>
                    <span>PROCESSING...</span>
                  </span>
                ) : (
                  <span>💳 {getRandomPaymentMethod()}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Confession Option */}
        <div className="mb-6">
          <div className="bg-hot-pink ugly-border p-4">
            <h3 className="font-comic font-bold text-wood mb-2 flex items-center">
              🤐 OPTION 2: CONFESS YOUR SINS!
            </h3>

            {!showConfessionInput ? (
              <div className="text-center">
                <p className="text-sm text-wood mb-3 font-ugly">
                  {prompt.confessionPrompt ||
                    "Share something embarrassing and unlock premium roasting!"}
                </p>
                <button
                  onClick={() => setShowConfessionInput(true)}
                  className="retro-button w-full py-2 px-4 font-comic font-bold text-sm bg-vomit-green hover:bg-vomit-green/80"
                >
                  😈 I'LL CONFESS
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfessionSubmit} className="space-y-3">
                <textarea
                  value={confessionText}
                  onChange={(e) => setConfessionText(e.target.value)}
                  placeholder="Spill your embarrassing secrets here... (the worse, the better!)"
                  className="w-full p-3 font-comic text-wood bg-beige ugly-border resize-none focus:outline-none focus:ring-2 focus:ring-hot-pink"
                  rows={3}
                  maxLength={200}
                  disabled={confessionLoading}
                />
                <div className="text-xs text-wood/60 text-right font-ugly">
                  {confessionText.length}/200
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowConfessionInput(false)}
                    className="retro-button flex-1 py-2 px-4 font-comic font-bold text-sm bg-gray-400 hover:bg-gray-500"
                  >
                    🙄 NEVERMIND
                  </button>
                  <button
                    type="submit"
                    disabled={!confessionText.trim() || confessionLoading}
                    className={`retro-button flex-1 py-2 px-4 font-comic font-bold text-sm
                      ${
                        !confessionText.trim() || confessionLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-vomit-green hover:bg-vomit-green/80"
                      }
                    `}
                  >
                    {confessionLoading ? (
                      <span className="flex items-center justify-center space-x-1">
                        <span className="animate-spin">🤐</span>
                        <span className="text-xs">JUDGING...</span>
                      </span>
                    ) : (
                      "🤮 CONFESS!"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Refuse Option */}
        <div className="text-center">
          <button
            onClick={onDismiss}
            className="text-sm font-comic text-beige/60 hover:text-toxic-orange underline"
          >
            🚫 I refuse both options (unlock NUCLEAR MODE)
          </button>
        </div>

        {/* Fake Terms */}
        <div className="mt-4 text-xs text-beige/40 font-ugly text-center">
          * By using this fake paywall, you agree to have your feelings hurt
          <br />
          ** No actual money will be processed (obviously)
          <br />
          *** Your confessions will be used against you
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
