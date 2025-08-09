import type { PaywallPrompt, UserSession } from "../types";

const confessionPrompts = [
  "Confess: Have you ever Googled your own name?",
  "Admit it: You've practiced acceptance speeches in the mirror, haven't you?",
  "Tell the truth: How many times have you pretended to be sick to avoid social events?",
  "Confess: You've definitely stalked your ex on social media this week.",
  "Admit: You've argued with someone on the internet about something stupid.",
  "Truth time: How many self-help books have you bought but never finished?",
  "Confess: You've lied about reading a book you've never actually read.",
  "Admit it: You've cried during a commercial, haven't you?",
  "Tell the truth: You've practiced conversations in your head, then said none of it.",
  "Confess: You've pretended to understand something you had no clue about.",
  "Admit: You've definitely looked up your symptoms on WebMD and panicked.",
  "Truth: You've eaten food that fell on the floor when no one was looking.",
];

const paywallMessages = [
  "🚨 PAYWALL ACTIVATED! 🚨\nPay ₹999.99 for more emotional damage, or confess something embarrassing!",
  "💸 Time to pay up, buttercup! ₹999.99 for premium roasting, or spill your secrets!",
  "🤑 Your free trial of self-destruction has ended! ₹999.99, or tell me your shame!",
  "💰 Cough up ₹999.99 for advanced trauma, or confess your deepest cringe!",
  "🏧 Insert ₹999.99 to continue your spiral into despair, or share your embarrassment!",
];

const paymentRoasts = [
  "HAHAHA! You actually tried to pay me fake money? That's the most desperate thing I've seen all day, and I've seen some pathetic stuff. Fine, continue your journey of self-destruction - it's on the house since you're clearly broke AND desperate! 💸😂",

  "OH MY GOD, you really thought this was a real payment system?! That's adorable! Your financial literacy is as bad as your life choices. Congratulations, you've unlocked 'Gullible Premium' - keep talking, this is hilarious! 🎪💳",

  "Wait... you were actually willing to PAY me to insult you? That's simultaneously the saddest and most honest thing you've done all day. I respect the commitment to your own destruction. Continue, you beautiful disaster! 🏆💀",

  "You tried to pay me with FAKE MONEY for FAKE THERAPY from a FAKE THERAPIST. The layers of delusion here are *chef's kiss* magnificent! Your payment has been 'processed' (into the void). Keep talking! 🎭✨",

  "I can't decide what's worse - that you tried to pay, or that you thought ₹999.99 was enough for this premium emotional carnage. Honey, this level of therapy costs WAY more than your self-worth. But I'll give you a discount for being entertainingly pathetic! 🎯💸",
];

export const generatePaywallPrompt = (): PaywallPrompt => {
  const randomMessage =
    paywallMessages[Math.floor(Math.random() * paywallMessages.length)];
  const randomConfession =
    confessionPrompts[Math.floor(Math.random() * confessionPrompts.length)];

  return {
    type: "both", // Show both options
    message: randomMessage,
    confessionPrompt: randomConfession,
    paymentAmount: "₹999.99",
  };
};

export const handlePaywallResponse = (
  response: string,
  isPaymentAttempt: boolean = false
): {
  continueSession: boolean;
  roastResponse: string;
  updateSession: Partial<UserSession>;
} => {
  // Handle payment attempt (button click or payment keywords)
  if (
    isPaymentAttempt ||
    response.toLowerCase().includes("pay") ||
    response.toLowerCase().includes("₹") ||
    response.toLowerCase().includes("999")
  ) {
    const paymentRoast =
      paymentRoasts[Math.floor(Math.random() * paymentRoasts.length)];

    return {
      continueSession: true,
      roastResponse: paymentRoast,
      updateSession: {
        hasPaid: true,
        hasHitPaywall: true,
        currentTier: "medium", // Upgrade to medium tier for paying
      },
    };
  }

  const lowerResponse = response.toLowerCase();

  // Check if they're confessing (longer responses or confession keywords)
  if (
    lowerResponse.includes("yes") ||
    lowerResponse.includes("admit") ||
    lowerResponse.includes("confess") ||
    lowerResponse.includes("true") ||
    lowerResponse.length > 20
  ) {
    const confessionRoast = getConfessionRoast(response);
    return {
      continueSession: true,
      roastResponse: confessionRoast,
      updateSession: {
        hasConfessed: true,
        hasHitPaywall: true,
        currentTier: "medium", // Upgrade tier for confessing
      },
    };
  }

  // They refused both options - unlock nuclear mode
  const refusalRoasts = [
    "Oh, you want to be difficult? FINE. You've just unlocked NUCLEAR MODE because you're too cheap to pay and too cowardly to confess. Hope your feelings weren't attached to anything important! 💥🔥",

    "Too broke to pay AND too scared to confess? That's peak cowardice right there. Congratulations, you've earned yourself the full nuclear treatment. This is going to hurt. 🚀💀",

    "Wow, refusing both options? That's actually impressive in the worst possible way. You've unlocked the 'Stubborn Disaster' achievement and nuclear-grade roasting. Buckle up, buttercup! ⚡💥",
  ];

  const refusalRoast =
    refusalRoasts[Math.floor(Math.random() * refusalRoasts.length)];

  return {
    continueSession: true,
    roastResponse: refusalRoast,
    updateSession: {
      hasHitPaywall: true,
      currentTier: "nuclear", // Nuclear mode for refusing
    },
  };
};

const getConfessionRoast = (confession: string): string => {
  const confessionRoasts = [
    `Oh wow, you actually confessed! "${confession}" - That's somehow worse than I expected, and my expectations were already underground. Thanks for the ammunition! 🎯😂`,

    `"${confession}" - I've heard some pathetic confessions, but this one takes the cake. And then drops it. Face first. Into concrete. 🍰💥`,

    `Well, "${confession}" explains... literally EVERYTHING about you. It's like all the puzzle pieces of your disaster life just clicked into place! 🧩🔥`,

    `"${confession}" - You didn't have to destroy yourself this thoroughly. I was going to do that for you, but you're clearly an overachiever in self-sabotage! 🏆💀`,

    `Thanks for confessing "${confession}" - That's not just embarrassing, that's a complete character assassination. You've done my job for me! 📝⚰️`,

    `"${confession}" - I'm genuinely impressed by your ability to make questionable choices. It's like a superpower, if superpowers were completely useless! 🦸‍♂️💸`,
  ];

  return confessionRoasts[Math.floor(Math.random() * confessionRoasts.length)];
};

export const shouldTriggerPaywall = (
  messageCount: number,
  hasHitPaywall: boolean
): boolean => {
  return messageCount >= 5 && !hasHitPaywall;
};

export const getPostPaywallMessage = (session: UserSession): string => {
  if (session.hasPaid) {
    return "Welcome back, you magnificent disaster! Since you 'paid' for premium service, let's continue destroying your self-esteem! 💸✨";
  } else if (session.hasConfessed) {
    return "Thanks again for that embarrassing confession. Now, where were we in dismantling your life choices? 😈";
  } else {
    return "Nuclear mode is still active. Hope you're ready for some brutally honest feedback! 💥";
  }
};
