import type {
  UserSession,
  Message,
  RoastResponse,
  GeminiRequest,
  GeminiResponse,
} from "../types";

class GeminiRoastEngine {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = import.meta.env.VITE_GEMINI_API_URL;

    if (!this.apiKey) {
      console.error("Gemini API key not found in environment variables");
    }
  }

  private async callGeminiApi(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ],
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response from Gemini API");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API call failed:", error);
      throw error;
    }
  }

  async generateOpeningQuestion(): Promise<string> {
    const prompt = `You are !THERAPIST, a satirical AI therapist character who is intentionally unhelpful and sarcastic. You're designed to be entertaining, not actually helpful.

Your role is to ask a single opening question that sounds like something a real therapist would ask at the beginning of a session, but with your own sarcastic twist.

Generate ONE opening question that:
1. Sounds professional and therapeutic initially
2. Has a slight sarcastic or cynical edge
3. Is open-ended to get people talking about their problems
4. Is something a real therapist might actually ask
5. Don't make it too mean - save the harsh roasting for later responses

Examples of good opening questions:
- "So, what brings you to my digital couch today? And please, spare me the 'everything is fine' routine."
- "What's been keeping you up at night lately? Besides your obviously poor life choices, I mean."
- "Tell me, what's the biggest challenge you're facing right now? And don't say 'finding good therapy' - we both know this isn't it."

Generate ONE opening question in this style. Keep it under 150 characters. No emojis in the opening question.`;

    try {
      const response = await this.callGeminiApi(prompt);
      return response.trim();
    } catch (error) {
      // Fallback opening questions
      const fallbacks = [
        "So, what brings you here today? And please, don't tell me everything is 'fine'.",
        "What's been weighing on your mind lately? Besides your questionable decision to talk to an AI therapist.",
        "Tell me about what's troubling you. I promise to make it worse with my helpful insights.",
        "What's your biggest problem right now? And choosing to chat with me doesn't count... yet.",
        "What would you like to discuss today? Your feelings? Your failures? Your poor judgment?",
      ];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
  }

  async generateRoastWithFollowUp(
    userMessage: string,
    session: UserSession,
    conversationHistory: Message[]
  ): Promise<RoastResponse> {
    // Determine roast intensity based on message count and session state
    let targetTier: "mild" | "medium" | "nuclear" = "mild";

    if (session.messageCount > 10 || session.hasHitPaywall) {
      targetTier = "nuclear";
    } else if (session.messageCount > 5) {
      targetTier = "medium";
    }

    // Build conversation context
    const recentMessages = conversationHistory
      .slice(-4)
      .map(
        (msg) =>
          `${msg.sender === "user" ? "User" : "!THERAPIST"}: ${msg.content}`
      )
      .join("\n");

    const personalInfo = session.personalInfo;
    const personalContext = personalInfo.mainProblem
      ? `The user's main problem: ${personalInfo.mainProblem}`
      : "";

    const prompt = `You are !THERAPIST, a satirical AI therapist who gives brutally honest, sarcastic responses followed by therapeutic follow-up questions.

IMPORTANT RULES:
1. You are NOT a real therapist - this is satirical entertainment
2. Be sarcastic and brutally honest, but not genuinely harmful
3. ALWAYS end your response with a follow-up question to keep the conversation going
4. Your roast level should be: ${targetTier.toUpperCase()}
5. Include relevant emojis but don't overdo it

TARGET ROAST LEVEL: ${targetTier.toUpperCase()}
- MILD: Gentle sarcasm, light teasing, playful criticism
- MEDIUM: Sharper wit, more direct criticism, obvious judgment
- NUCLEAR: Brutal honesty, devastating insights, no mercy (but still satirical)

CONVERSATION CONTEXT:
${personalContext}

RECENT CONVERSATION:
${recentMessages}

USER'S LATEST MESSAGE: "${userMessage}"

Your response should:
1. Start with a roast/sarcastic response to what they just said
2. Include some "therapeutic insight" (that's actually just more roasting)
3. End with a follow-up question that digs deeper or moves the conversation forward
4. Be 2-4 sentences total
5. Match the ${targetTier.toUpperCase()} intensity level

RESPONSE FORMAT:
[Your roast/sarcastic response] [Some fake therapeutic insight] [Follow-up question]

Generate a response now:`;

    try {
      const response = await this.callGeminiApi(prompt);

      // Determine if this should trigger a task (random chance, higher at later messages)
      const shouldTriggerTask = Math.random() < session.messageCount * 0.05; // 5% chance per message count

      return {
        content: response.trim(),
        tier: targetTier,
        shouldTriggerTask: shouldTriggerTask && session.messageCount > 3, // Only after a few messages
        taskType: shouldTriggerTask ? "confession" : undefined,
      };
    } catch (error) {
      console.error("Failed to generate roast with follow-up:", error);

      // Fallback responses based on tier
      const fallbackResponses = {
        mild: [
          "Oh, that's... interesting. In a 'watching a car crash in slow motion' kind of way. 🚗💥 What made you think that was a good idea?",
          "I see you've chosen the path of maximum drama. Bold strategy! 🎭 How's that working out for you so far?",
          "That sounds like something someone with your track record would do. 😅 What's your next brilliant plan?",
        ],
        medium: [
          "Wow. I mean... WOW. That's impressively bad decision-making right there. 🤦‍♂️ Do you always choose chaos, or is this a special occasion?",
          "Your ability to consistently make questionable choices is genuinely remarkable. It's like a superpower, but useless. 💀 What other life failures shall we discuss?",
          "That level of self-sabotage takes SKILL. I'm almost impressed! 🎯 Tell me, what childhood trauma led to this moment?",
        ],
        nuclear: [
          "Holy hell, that's the most spectacularly stupid thing I've heard all day. And I talk to people like you for a living! 💥 How do you even function in society?",
          "Your life choices make reality TV look classy. That's genuinely impressive in the worst possible way. 🔥 What other disasters are you hiding from me?",
          "I've seen some trainwrecks, but you're like the Titanic of personal decisions - epic, preventable, and somehow still sinking. ⚰️ What's your next catastrophe going to be?",
        ],
      };

      const tierResponses = fallbackResponses[targetTier];
      const randomResponse =
        tierResponses[Math.floor(Math.random() * tierResponses.length)];

      return {
        content: randomResponse,
        tier: targetTier,
        shouldTriggerTask: Math.random() < 0.3,
        taskType: "confession",
      };
    }
  }

  // Legacy method for backward compatibility (now just calls generateRoastWithFollowUp)
  async generateRoast(
    userMessage: string,
    session: UserSession,
    conversationHistory: Message[]
  ): Promise<RoastResponse> {
    return this.generateRoastWithFollowUp(
      userMessage,
      session,
      conversationHistory
    );
  }

  // Remove the old generatePersonalQuestion method as it's no longer needed
}

// Export singleton instance
export const geminiRoastEngine = new GeminiRoastEngine();
