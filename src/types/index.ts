// ==================== CORE DATA TYPES ====================

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  roastTier?: "mild" | "medium" | "nuclear";
  isTask?: boolean;
  taskId?: string;
  isPaywallResponse?: boolean;
}

export interface UserSession {
  id: string;
  username: string;
  messageCount: number;
  hasHitPaywall: boolean;
  hasConfessed: boolean;
  hasPaid: boolean;
  currentTier: "mild" | "medium" | "nuclear";
  sessionStarted: Date;
  lastActivity: Date;
  personalInfo: {
    name?: string;
    mainProblem?: string;
    favoriteFood?: string;
    additionalInfo?: Record<string, string>;
  };
  completedTasks: string[];
  currentTask?: string;
}

export interface TherapyTask {
  id: string;
  prompt: string;
  expectedResponse?: string;
  punishmentRoast: string;
  rewardRoast?: string;
  isCompleted?: boolean;
}

export interface PaywallPrompt {
  type: "payment" | "confession" | "both";
  message: string;
  confessionPrompt?: string;
  paymentAmount?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface RoastResponse {
  content: string;
  tier: "mild" | "medium" | "nuclear";
  shouldTriggerTask?: boolean;
  taskType?: string;
  isPaywallResponse?: boolean;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    index: number;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback?: {
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
}

export interface GeminiRequest {
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

// ==================== APP STATE ====================

export interface AppState {
  session: UserSession | null;
  messages: Message[];
  currentPaywallPrompt: PaywallPrompt | null;
  currentTask: TherapyTask | null;
  isLoading: boolean;
  showPaywall: boolean;
  showTask: boolean;
  isTyping: boolean;
}

// ==================== COMPONENT PROPS ====================

export interface HeaderProps {
  session: UserSession | null;
}

export interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  session: UserSession | null;
}

export interface MessageBubbleProps {
  message: Message;
  isLatest: boolean;
}

export interface PaywallModalProps {
  prompt: PaywallPrompt | null;
  onPayment: () => void;
  onConfession: (confession: string) => void;
  onDismiss: () => void;
  isVisible: boolean;
}

export interface TherapyTaskProps {
  task: TherapyTask | null;
  onComplete: (response: string) => void;
  onSkip: () => void;
  isVisible: boolean;
}

export interface LoadingScreenProps {
  message?: string;
  isVisible: boolean;
}

export interface FooterProps {
  // Empty for now, but ready for future props
}

// ==================== UTILITY TYPES ====================

export type RoastTier = "mild" | "medium" | "nuclear";
export type MessageSender = "user" | "ai";
export type PaywallType = "payment" | "confession" | "both";

// ==================== ENVIRONMENT TYPES ====================

declare global {
  interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
