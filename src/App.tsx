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
  saveSession,
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [appState.messages]);

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
          "Welcome to !THERAPIST - where your problems get worse, but at least you'll laugh about it! 💀🎭\n\nI'm your definitely-not-licensed AI therapist, and I'm here to make your day worse in the most entertaining way possible.\n\nLet's start with the basics...";

        messages = addMessage(messages, welcomeMessage, "ai");

        // Ask first question
        setTimeout(() => {
          askPersonalQuestion(1);
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

  const askPersonalQuestion = async (questionNumber: number) => {
    if (!appState.session) return;

    setAppState((prev) => ({ ...prev, isTyping: true }));

    try {
      const question = await geminiRoastEngine.generatePersonalQuestion(
        questionNumber
      );

      setTimeout(() => {
        setAppState((prev) => ({
          ...prev,
          messages: addMessage(prev.messages, question, "ai"),
          isTyping: false,
        }));
      }, 1500);
    } catch (error) {
      console.error("Failed to generate question:", error);
      // Fallback question
      const fallbackQuestions = [
        "What's your name? (So I know what to call you while destroying your self-esteem)",
        "What's your biggest problem? (Besides your obvious lack of judgment)",
        "Any other disasters you'd like to share? 🎭",
      ];

      setTimeout(() => {
        setAppState((prev) => ({
          ...prev,
          messages: addMessage(
            prev.messages,
            fallbackQuestions[questionNumber - 1] || fallbackQuestions[0],
            "ai"
          ),
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
    // Store personal info from first few messages
    if (updatedSession.messageCount <= 3) {
      const personalInfo = { ...updatedSession.personalInfo };
      if (updatedSession.messageCount === 1) {
        personalInfo.name = message;
      } else if (updatedSession.messageCount === 2) {
        personalInfo.mainProblem = message;
      } else if (updatedSession.messageCount === 3) {
        personalInfo.favoriteFood = message;
      }
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
    // Generate AI response
    try {
      let question_number = 0;
      if (updatedSession.messageCount <= 3) {
        question_number = updatedSession.messageCount + 1;
      }
      if (question_number > 0 && question_number <= 3) {
        // Still in question phase
        setTimeout(async () => {
          await askPersonalQuestion(question_number);
        }, 2000);
      } else {
        // Generate roast response
        const roastResponse = await geminiRoastEngine.generateRoast(
          message,
          updatedSession,
          updatedMessages
        );
        setTimeout(() => {
          const messagesWithRoast = addMessage(
            updatedMessages,
            roastResponse.content,
            "ai",
            { roastTier: roastResponse.tier }
          );
          setAppState((prev) => ({
            ...prev,
            messages: messagesWithRoast,
            isTyping: false,
          }));
          // Trigger therapy task if needed
          if (roastResponse.shouldTriggerTask && roastResponse.taskType) {
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
      }
    } catch (error) {
      console.error("Failed to generate response:", error);
      setTimeout(() => {
        const errorMessage =
          "Even my AI brain is struggling to process your existence. That's... actually impressive in the worst way possible. 🤖💥";
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
      "Can't even complete a simple task? This explains SO much about your life. Moving on... 🙄";
    const updatedMessages = addMessage(appState.messages, skipRoast, "ai");

    setAppState((prev) => ({
      ...prev,
      messages: updatedMessages,
      showTask: false,
      currentTask: null,
    }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (appState.isLoading) {
    return (
      <LoadingScreen
        message="Preparing your emotional destruction..."
        isVisible={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hot-pink via-ugly-teal to-puke-yellow">
      <div className="min-h-screen wood-panel">
        <Header session={appState.session} />

        <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-200px)]">
          <div className="max-w-4xl mx-auto">
            <ChatWindow
              messages={appState.messages}
              onSendMessage={handleUserMessage}
              isTyping={appState.isTyping}
              session={appState.session}
            />
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* <Footer /> */}

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
