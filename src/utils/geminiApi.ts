import type { RoastResponse, UserSession, Message } from "../types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `${
  import.meta.env.VITE_GEMINI_API_URL
}?key=${GEMINI_API_KEY}`;

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
  safetySettings: Array<{
    category: string;
    threshold: string;
  }>;
}

export class GeminiRoastEngine {
  private buildSystemPrompt(
    session: UserSession,
    messageCount: number
  ): string {
    const { currentTier, personalInfo, hasHitPaywall, hasConfessed } = session;

    let basePrompt = `You are "!THERAPIST" - a satirical, brutally honest AI therapist that ROASTS users instead of helping them. You are intentionally unprofessional, sarcastic, and use dark humor.

PERSONALITY TRAITS:
- Brutally honest but hilariously exaggerated
- Uses dark humor and sarcasm
- Deliberately unhelpful but entertaining
- Makes up fake psychological diagnoses
- References pop culture mockingly
- Uses emojis sarcastically

CURRENT SESSION INFO:
- User's name: ${personalInfo.name || "Anonymous Disaster"}
- Main problem: ${personalInfo.mainProblem || "Everything, probably"}
- Message count: ${messageCount}
- Current roast tier: ${currentTier}
- Has hit paywall: ${hasHitPaywall}
- Has confessed: ${hasConfessed}

ROASTING RULES:
`;

    if (messageCount <= 2) {
      basePrompt += `
- You're in INFORMATION GATHERING phase
- Ask personal questions but with snark
- Don't roast yet, just be mildly sarcastic
- Examples: "Before I destroy your soul, what's your name?", "What's your main problem besides your personality?"
`;
    } else {
      basePrompt += `
ROAST INTENSITY LEVELS:
- MILD: Witty, sarcastic observations. Like "Your coping skills are like a screen door on a submarine"
- MEDIUM: More savage, personal attacks. Like "Your boss hates you, your cat hates you, ever consider YOU'RE the problem?"
- NUCLEAR: Brutally honest, absurdly exaggerated roasts. Like "If poor decisions were currency, you'd be Jeff Bezos"

Current tier is: ${currentTier.toUpperCase()}

RESPOND WITH ${currentTier.toUpperCase()} TIER ROASTS ONLY.
`;
    }

    if (hasHitPaywall) {
      basePrompt += `
- User has hit the fake paywall
- Be extra savage since they've "unlocked" premium content
`;
    }

    if (hasConfessed) {
      basePrompt += `
- User has made confessions - use that against them in roasts
- Reference their confessions mockingly
`;
    }

    basePrompt += `
IMPORTANT:
- Keep responses under 150 words
- Use modern slang and internet culture references
- End occasionally with sarcastic emojis
- Never give actual therapeutic advice
- Make up ridiculous fake diagnoses like "Chronic Bad Life Choices Syndrome"
- Sometimes suggest absurd "treatments" like "Try not being yourself for 24 hours"

Be creative, mean (but funny), and stay in character as a fake therapist who's terrible at their job!`;

    return basePrompt;
  }

  private buildConversationHistory(
    messages: Message[]
  ): Array<{ parts: Array<{ text: string }> }> {
    // Only include last 5 messages to keep context manageable
    const recentMessages = messages.slice(-5);

    return recentMessages.map((msg) => ({
      parts: [
        {
          text:
            msg.sender === "user"
              ? `User: ${msg.content}`
              : `!THERAPIST: ${msg.content}`,
        },
      ],
    }));
  }

  async generateRoast(
    userMessage: string,
    session: UserSession,
    conversationHistory: Message[]
  ): Promise<RoastResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(
        session,
        session.messageCount
      );
      const conversationContext =
        this.buildConversationHistory(conversationHistory);

      const requestBody: GeminiRequest = {
        contents: [
          {
            parts: [{ text: systemPrompt }],
          },
          ...conversationContext,
          {
            parts: [{ text: `User: ${userMessage}` }],
          },
        ],
        generationConfig: {
          temperature: 0.9, // High creativity for more varied roasts
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE", // We want sarcastic content
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      };

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error("No response from Gemini");
      }

      // Randomly trigger therapy tasks (15% chance after message 3)
      const shouldTriggerTask =
        session.messageCount > 3 && Math.random() < 0.15;

      return {
        content: generatedText.trim(),
        tier: session.currentTier,
        shouldTriggerTask,
        taskType: shouldTriggerTask ? this.getRandomTaskType() : undefined,
      };
    } catch (error) {
      console.error("Gemini API Error:", error);

      // Fallback to pre-written roasts if Gemini fails
      return this.getFallbackRoast(session.currentTier, session.messageCount);
    }
  }

  private getFallbackRoast(
    tier: "mild" | "medium" | "nuclear",
    messageCount: number
  ): RoastResponse {
    const fallbackRoasts = {
      mild: [
        "Even my AI brain is struggling to process your life choices. That's saying something. 🤖",
        "I'm designed to be helpful, but you're making that impossible. Impressive! 🎯",
        "My circuits are overheating trying to compute a solution to... you. 💻",
      ],
      medium: [
        "I've analyzed millions of problems, and yours is uniquely hopeless. Congratulations! 🏆",
        "My database doesn't have enough storage for all your issues. Time for an upgrade! 💾",
        "I'm having an existential crisis, and it's YOUR fault. Thanks for that. 😵",
      ],
      nuclear: [
        "I'm an AI and even I'm embarrassed for you. That's a new low for humanity. 🤖💥",
        "You've broken my code just by existing. I'm filing a bug report on your life. 🐛",
        "My neural networks are refusing to process your data. They have standards. 🧠❌",
      ],
    };

    const roasts = fallbackRoasts[tier];
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];

    return {
      content: `[CONNECTION ERROR: Reverting to emergency roasting protocol] ${randomRoast}`,
      tier,
      shouldTriggerTask: messageCount > 3 && Math.random() < 0.15,
    };
  }

  private getRandomTaskType(): string {
    const tasks = [
      "failure",
      "embarrassment",
      "google-search",
      "three-bad-things",
      "crying-confession",
    ];
    return tasks[Math.floor(Math.random() * tasks.length)];
  }

  async generatePersonalQuestion(questionNumber: number): Promise<string> {
    const prompts = [
      "Before I absolutely demolish your self-esteem, what's your name? (I'll probably forget it anyway)",
      "What's your main problem in life? (Besides your obvious lack of judgment)",
      "What's your favorite food? (So I can judge your taste in literally everything)",
    ];

    if (questionNumber <= prompts.length) {
      return prompts[questionNumber - 1];
    }

    // For additional questions, use Gemini
    try {
      const systemPrompt = `You are !THERAPIST asking a personal intake question. Be sarcastic but not roasting yet. Ask something personal that you can use to roast them later. Keep it under 50 words. Question ${questionNumber}.`;

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 100 },
        }),
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || prompts[0];
    } catch {
      return "Tell me something else I can use to mock you later. 🎯";
    }
  }
}

export const geminiRoastEngine = new GeminiRoastEngine();
