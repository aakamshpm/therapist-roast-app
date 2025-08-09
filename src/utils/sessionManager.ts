import type { UserSession, Message } from "../types";

const SESSION_STORAGE_KEY = "therapist_session";
const MESSAGES_STORAGE_KEY = "therapist_messages";

export const createNewSession = (username?: string): UserSession => {
  const sessionId = `session_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  return {
    id: sessionId,
    username: username || "Anonymous Disaster",
    messageCount: 0,
    hasHitPaywall: false,
    hasConfessed: false,
    hasPaid: false,
    currentTier: "mild",
    sessionStarted: new Date(),
    lastActivity: new Date(),
    personalInfo: {},
    completedTasks: [],
  };
};

export const saveSession = (session: UserSession): void => {
  try {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        ...session,
        sessionStarted: session.sessionStarted.toISOString(),
        lastActivity: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error("Failed to save session:", error);
  }
};

export const loadSession = (): UserSession | null => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      sessionStarted: new Date(parsed.sessionStarted),
      lastActivity: new Date(parsed.lastActivity),
    };
  } catch (error) {
    console.error("Failed to load session:", error);
    return null;
  }
};

export const saveMessages = (messages: Message[]): void => {
  try {
    const serializable = messages.map((msg) => ({
      ...msg,
      timestamp: msg.timestamp.toISOString(),
    }));
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error("Failed to save messages:", error);
  }
};

export const loadMessages = (): Message[] => {
  try {
    const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return parsed.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch (error) {
    console.error("Failed to load messages:", error);
    return [];
  }
};

export const updateSession = (
  session: UserSession,
  updates: Partial<UserSession>
): UserSession => {
  const updated = {
    ...session,
    ...updates,
    lastActivity: new Date(),
  };

  saveSession(updated);
  return updated;
};

export const addMessage = (
  messages: Message[],
  content: string,
  sender: "user" | "ai",
  extraData?: Partial<Message>
): Message[] => {
  const newMessage: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    content,
    sender,
    timestamp: new Date(),
    ...extraData,
  };

  const updatedMessages = [...messages, newMessage];
  saveMessages(updatedMessages);
  return updatedMessages;
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
};

export const getWelcomeBackMessage = (session: UserSession): string => {
  const timeSinceLastActivity = Date.now() - session.lastActivity.getTime();
  const hoursAgo = Math.floor(timeSinceLastActivity / (1000 * 60 * 60));

  const welcomeMessages = [
    `Back for more pain, ${session.personalInfo.name || "Anonymous"}? 😈`,
    `Oh look who's returned to their favorite emotional disaster zone! 🎭`,
    `Couldn't stay away, could you? Your masochistic tendencies are showing. 💀`,
    `Welcome back to your personal hell, ${
      session.personalInfo.name || "sweetie"
    }! 🔥`,
    `Miss me? Of course you did. Nobody else roasts you quite like I do! 🎯`,
  ];

  let timeMessage = "";
  if (hoursAgo > 24) {
    timeMessage = ` It's been ${Math.floor(
      hoursAgo / 24
    )} days - did you actually try to improve your life? Cute. 📅`;
  } else if (hoursAgo > 1) {
    timeMessage = ` ${hoursAgo} hours away and you're already back? That's either dedication or desperation. 🕐`;
  } else {
    timeMessage = ` You literally just left! Can't even take a break from being roasted? Wow. ⏰`;
  }

  const baseMessage =
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  return baseMessage + timeMessage;
};

export const isReturningUser = (session: UserSession): boolean => {
  return session.messageCount > 0 && session.personalInfo.name !== undefined;
};
