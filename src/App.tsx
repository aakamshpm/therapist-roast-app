import { useState, useEffect, useRef } from "react";
import type {
  AppState,
  UserSession,
  Message,
  PaywallPrompt,
  TherapyTask,
} from "./types";
import {
  createNewSession,
  loadSession,
  loadMessages,
  addMessage,
  updateSession,
  getWelcomeBackMessage,
  isReturningUser,
} from "./utils/sessionManager";
import { geminiRoastEngine } from "./utils/geminiApi";
import {
  shouldTriggerPaywall,
  generatePaywallPrompt,
  handlePaywallResponse,
} from "./utils/paywallLogic";
import {
  getRandomTask,
  checkTaskResponse,
  getTaskResponseRoast,
} from "./utils/taskPrompts";

import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import PaywallModal from "./components/PaywallModal";
import TherapyTaskModal from "./components/TherapyTaskModal";
import LoadingScreen from "./components/LoadingScreen";
import Footer from "./components/Footer";

function App() {
  const [appState, setAppState] = useState<AppState>({
    session: null,
    messages: [],
    currentPaywallPrompt: null,
    currentTask: null,
    isLoading: false,
    showPaywall: false,
    showTask: false,
    isTyping: false,
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize app on mount with initial loading
  useEffect(() => {
    // Show loader for 2 seconds before initializing
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      initializeApp();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const initializeApp = async () => {
    setAppState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Try to load existing session
      let session = loadSession();
      let messages = loadMessages();

      if (!session) {
        // Create new session
        session = createNewSession("aakamshpm");
        messages = [];

        // Add welcome message
        const welcomeMessage =
          "Welcome to !THERAPIST - where your problems get worse, but at least you'll laugh about it! 💀🎭\n\nI'm your definitely-not-licensed AI therapist, and I'm here to make your day worse in the most entertaining way possible.\n\nLet's start...";

        messages = addMessage(messages, welcomeMessage, "ai");

        // Ask the single opening question
        setTimeout(() => {
          askOpeningQuestion();
        }, 2000);
      } else {
        // Returning user
        if (isReturningUser(session)) {
          const welcomeBack = getWelcomeBackMessage(session);
          messages = addMessage(messages, welcomeBack, "ai");
        }
      }

      setAppState((prev) => ({
        ...prev,
        session,
        messages,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to initialize app:", error);
      // Fallback to new session
      const session = createNewSession("aakamshpm");
      setAppState((prev) => ({
        ...prev,
        session,
        messages: [],
        isLoading: false,
      }));
    }
  };

  const askOpeningQuestion = async () => {
    if (!appState.session) return;

    setAppState((prev) => ({ ...prev, isTyping: true }));

    try {
      // Generate a proper therapeutic opening question
      const openingQuestion = await geminiRoastEngine.generateOpeningQuestion();

      setTimeout(() => {
        setAppState((prev) => ({
          ...prev,
          messages: addMessage(prev.messages, openingQuestion, "ai"),
          isTyping: false,
        }));
      }, 1500);
    } catch (error) {
      console.error("Failed to generate opening question:", error);
      // Fallback opening question (like a real therapist would ask)
      const fallbackQuestion =
        "So, what brings you here today? What's been weighing on your mind lately?";

      setTimeout(() => {
        setAppState((prev) => ({
          ...prev,
          messages: addMessage(prev.messages, fallbackQuestion, "ai"),
          isTyping: false,
        }));
      }, 1500);
    }
  };

  const handleUserMessage = async (message: string) => {
    if (!appState.session || appState.isLoading) return;

    // Add user message
    const updatedMessages = addMessage(appState.messages, message, "user");
    const updatedSession = updateSession(appState.session, {
      messageCount: appState.session.messageCount + 1,
    });

    setAppState((prev) => ({
      ...prev,
      messages: updatedMessages,
      session: updatedSession,
      isTyping: true,
    }));

    // Store the first response as main problem for context
    if (updatedSession.messageCount === 1) {
      const personalInfo = { ...updatedSession.personalInfo };
      personalInfo.mainProblem = message;
      const sessionWithInfo = updateSession(updatedSession, { personalInfo });
      setAppState((prev) => ({ ...prev, session: sessionWithInfo }));
    }

    // Check for paywall trigger
    if (
      shouldTriggerPaywall(
        updatedSession.messageCount,
        updatedSession.hasHitPaywall
      )
    ) {
      setTimeout(() => {
        const paywallPrompt = generatePaywallPrompt(updatedSession);
        setAppState((prev) => ({
          ...prev,
          currentPaywallPrompt: paywallPrompt,
          showPaywall: true,
          isTyping: false,
        }));
      }, 1500);
      return;
    }

    // Generate roast + follow-up question response
    try {
      const roastWithFollowUp =
        await geminiRoastEngine.generateRoastWithFollowUp(
          message,
          updatedSession,
          updatedMessages
        );

      setTimeout(() => {
        const messagesWithRoast = addMessage(
          updatedMessages,
          roastWithFollowUp.content,
          "ai",
          { roastTier: roastWithFollowUp.tier }
        );

        setAppState((prev) => ({
          ...prev,
          messages: messagesWithRoast,
          isTyping: false,
        }));

        // Trigger therapy task if needed
        if (roastWithFollowUp.shouldTriggerTask) {
          setTimeout(() => {
            const task = getRandomTask();
            setAppState((prev) => ({
              ...prev,
              currentTask: task,
              showTask: true,
            }));
          }, 3000);
        }
      }, 2000);
    } catch (error) {
      console.error("Failed to generate response:", error);

      setTimeout(() => {
        const errorMessage =
          "Even my AI brain is struggling to process your existence. That's... actually impressive in the worst way possible. 🤖💥\n\nBut seriously, what else is going wrong in your life?";
        setAppState((prev) => ({
          ...prev,
          messages: addMessage(updatedMessages, errorMessage, "ai"),
          isTyping: false,
        }));
      }, 2000);
    }
  };

  const handlePaywallPayment = () => {
    if (!appState.session) return;

    const response = handlePaywallResponse(
      "pay",
      appState.session,
      appState.currentPaywallPrompt!,
      true
    );

    const updatedSession = updateSession(
      appState.session,
      response.updateSession
    );
    const updatedMessages = addMessage(
      appState.messages,
      response.roastResponse,
      "ai",
      { isPaywallResponse: true }
    );

    setAppState((prev) => ({
      ...prev,
      session: updatedSession,
      messages: updatedMessages,
      showPaywall: false,
      currentPaywallPrompt: null,
    }));
  };

  const handlePaywallConfession = (confession: string) => {
    if (!appState.session || !appState.currentPaywallPrompt) return;

    const response = handlePaywallResponse(
      confession,
      appState.session,
      appState.currentPaywallPrompt
    );

    const updatedSession = updateSession(
      appState.session,
      response.updateSession
    );
    let updatedMessages = addMessage(appState.messages, confession, "user");
    updatedMessages = addMessage(
      updatedMessages,
      response.roastResponse,
      "ai",
      { isPaywallResponse: true }
    );

    setAppState((prev) => ({
      ...prev,
      session: updatedSession,
      messages: updatedMessages,
      showPaywall: false,
      currentPaywallPrompt: null,
    }));
  };

  const handleTaskComplete = (response: string) => {
    if (!appState.currentTask || !appState.session) return;

    const isCompleted = checkTaskResponse(appState.currentTask, response);
    const roastResponse = getTaskResponseRoast(
      appState.currentTask,
      response,
      isCompleted
    );

    let updatedMessages = addMessage(appState.messages, response, "user");
    updatedMessages = addMessage(updatedMessages, roastResponse, "ai");

    const completedTasks = isCompleted
      ? [...appState.session.completedTasks, appState.currentTask.id]
      : appState.session.completedTasks;

    const updatedSession = updateSession(appState.session, { completedTasks });

    setAppState((prev) => ({
      ...prev,
      session: updatedSession,
      messages: updatedMessages,
      showTask: false,
      currentTask: null,
    }));
  };

  const handleTaskSkip = () => {
    if (!appState.currentTask || !appState.session) return;

    const skipRoast =
      "Can't even complete a simple task? This explains SO much about your life. Moving on... 🙄\n\nWhat other failures would you like to discuss?";
    const updatedMessages = addMessage(appState.messages, skipRoast, "ai");

    setAppState((prev) => ({
      ...prev,
      messages: updatedMessages,
      showTask: false,
      currentTask: null,
    }));
  };

  // const scrollToBottom = () => {
  //   // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // Show initial loading screen
  if (isInitialLoading) {
    return (
      <LoadingScreen
        message="Initializing emotional destruction engine..."
        isVisible={true}
      />
    );
  }

  // Show regular loading screen
  if (appState.isLoading) {
    return (
      <LoadingScreen
        message="Preparing your emotional destruction..."
        isVisible={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hot-pink via-ugly-teal to-puke-yellow flex flex-col">
      <div className="min-h-screen wood-panel flex flex-col">
        <Header session={appState.session} />

        <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
          <div className="flex-1 flex flex-col w-full">
            <ChatWindow
              messages={appState.messages}
              onSendMessage={handleUserMessage}
              isTyping={appState.isTyping}
              session={appState.session}
            />
            <div ref={messagesEndRef} />
          </div>
        </main>

        <Footer />

        {/* Modals */}
        <PaywallModal
          prompt={appState.currentPaywallPrompt}
          onPayment={handlePaywallPayment}
          onConfession={handlePaywallConfession}
          onDismiss={() =>
            setAppState((prev) => ({ ...prev, showPaywall: false }))
          }
          isVisible={appState.showPaywall}
        />

        <TherapyTaskModal
          task={appState.currentTask}
          onComplete={handleTaskComplete}
          onSkip={handleTaskSkip}
          isVisible={appState.showTask}
        />
      </div>
    </div>
  );
}

export default App;
