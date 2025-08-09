import type { TherapyTask } from "../types";

const therapyTasks: TherapyTask[] = [
  {
    id: "task_affirmation_fail",
    prompt:
      'Say "I am worthy of love and respect" but actually mean it (spoiler: you won\'t)',
    expectedResponse: "I am worthy of love and respect",
    punishmentRoast:
      "You couldn't even say a simple affirmation without cringing! That tells me everything I need to know about your self-worth. 💀",
    rewardRoast:
      "Wow, you actually said it! Too bad we both know you don't believe a word of it. But hey, fake it till you... never make it! 🎭",
  },
  {
    id: "task_count_failures",
    prompt:
      "Count to 10. If you can't do this simple task, we'll know the extent of your incompetence.",
    expectedResponse: "1 2 3 4 5 6 7 8 9 10",
    punishmentRoast:
      "You literally cannot count to 10. I have seen toddlers with better basic skills. This explains SO much about your life choices! 🤦‍♂️",
    rewardRoast:
      "Congratulations! You have the intellectual capacity of a kindergartener. That's... actually higher than I expected! 📚",
  },
  {
    id: "task_biggest_regret",
    prompt:
      "Tell me your biggest regret from the past year. Be honest - dishonesty will only make the roasting worse.",
    punishmentRoast:
      "You can't even be honest about your failures? That level of self-deception is probably why you're talking to an AI therapist instead of having real friends! 😤",
    rewardRoast:
      "Thanks for sharing that trainwreck of a decision! Your ability to consistently make terrible choices is genuinely impressive. It takes skill to mess up that badly! 🏆",
  },
  {
    id: "task_embarrassing_moment",
    prompt:
      "Describe the most embarrassing thing that happened to you this month. Don't leave out the cringey details!",
    punishmentRoast:
      "Too embarrassed to share embarrassing moments? That's META-embarrassing! You've managed to be awkward about being awkward. Incredible! 🤡",
    rewardRoast:
      "HAHAHA! That's deliciously pathetic! The secondhand embarrassment from reading that actually made ME cringe, and I don't even have feelings! 😂",
  },
  {
    id: "task_life_priorities",
    prompt:
      "List 3 things you spent more time on this week than self-improvement. Be brutally honest.",
    punishmentRoast:
      "Can't even identify your own time-wasting habits? That level of self-awareness is why you're stuck in this cycle of mediocrity! 🌀",
    rewardRoast:
      "Netflix, social media, and avoiding responsibilities? How original! You've achieved the holy trinity of wasting your life. Congrats! 📺",
  },
  {
    id: "task_phone_number",
    prompt:
      "Type your phone number (don't worry, this is fake and goes nowhere)",
    expectedResponse: null, // Will accept any 10+ digit response
    punishmentRoast:
      "You can't even type a fake phone number? Your trust issues have trust issues! This paranoia might actually be justified though... 📱",
    rewardRoast:
      "Bold of you to trust a sarcastic AI with personal info! Your judgment is as questionable as ever, but I respect the commitment to bad decisions! 🔢",
  },
  {
    id: "task_worst_habit",
    prompt:
      "Confess your worst habit that you're too ashamed to tell anyone else about.",
    punishmentRoast:
      "Too ashamed to admit what you're ashamed of? That's shame inception! Your avoidance skills are stronger than your self-improvement skills! 🙈",
    rewardRoast:
      "Oh my GOD, that habit is even worse than I imagined! The fact that you do that regularly explains your entire personality! 🤢",
  },
  {
    id: "task_spell_therapist",
    prompt:
      'Spell "THERAPIST" correctly. Let\'s see if you can manage this basic task.',
    expectedResponse: "THERAPIST",
    punishmentRoast:
      "You can't spell the word for the help you desperately need? The irony is so thick I could cut it with a knife! 📚",
    rewardRoast:
      'You spelled it right! Too bad spelling "THERAPIST" won\'t help you find a real one who can fix... *gestures vaguely at everything about you* 🎯',
  },
  {
    id: "task_social_media_time",
    prompt:
      "How many hours did you waste on social media yesterday? Round to the nearest hour, we both know it was a lot.",
    punishmentRoast:
      "Can't even admit how much time you waste scrolling? Your denial game is stronger than your productivity game! 📱",
    rewardRoast: `${
      Math.floor(Math.random() * 6) + 3
    } hours?! That\'s almost a part-time job of avoiding real life! No wonder you have so many problems! ⏰`,
  },
  {
    id: "task_last_compliment",
    prompt:
      "When was the last time someone gave you a genuine compliment? Be honest about how long it's been.",
    punishmentRoast:
      "Can't even remember the last compliment? That's either selective memory or a very sad reality. Both are equally pathetic! 💭",
    rewardRoast:
      "That long ago? Yikes! At this rate, your next compliment will come from your funeral eulogy... and even then, people might struggle! ⚰️",
  },
];

export const getRandomTask = (): TherapyTask => {
  const randomIndex = Math.floor(Math.random() * therapyTasks.length);
  return {
    ...therapyTasks[randomIndex],
    isCompleted: false,
  };
};

export const getTaskById = (taskId: string): TherapyTask | null => {
  return therapyTasks.find((task) => task.id === taskId) || null;
};

export const checkTaskResponse = (
  task: TherapyTask,
  response: string
): boolean => {
  const cleanResponse = response.toLowerCase().trim();

  // Special handling for different task types
  switch (task.id) {
    case "task_affirmation_fail":
      return cleanResponse.includes("i am worthy of love and respect");

    case "task_count_failures":
      // Check if they counted to 10 in some form
      return (
        /1.*2.*3.*4.*5.*6.*7.*8.*9.*10/.test(
          cleanResponse.replace(/\s/g, "")
        ) || cleanResponse === "1 2 3 4 5 6 7 8 9 10"
      );

    case "task_spell_therapist":
      return cleanResponse === "therapist";

    case "task_phone_number":
      // Check if it contains 10+ digits
      const digits = response.replace(/\D/g, "");
      return digits.length >= 10;

    default:
      // For open-ended tasks, any response longer than 10 characters is considered "complete"
      return response.trim().length >= 10;
  }
};

export const getTaskResponseRoast = (
  task: TherapyTask,
  isCompleted: boolean
): string => {
  if (isCompleted) {
    return (
      task.rewardRoast ||
      `Well, you somehow managed to complete that task. Color me surprised! Your incompetence has limits after all! 🎉`
    );
  } else {
    return task.punishmentRoast;
  }
};

export const getTaskCompletionRate = (completedTasks: string[]): number => {
  return Math.min((completedTasks.length / therapyTasks.length) * 100, 100);
};

export const getNextTaskSuggestion = (
  completedTaskIds: string[]
): TherapyTask | null => {
  const incompleteTasks = therapyTasks.filter(
    (task) => !completedTaskIds.includes(task.id)
  );

  if (incompleteTasks.length === 0) {
    return null; // All tasks completed!
  }

  // Return a random incomplete task
  const randomIndex = Math.floor(Math.random() * incompleteTasks.length);
  return incompleteTasks[randomIndex];
};

// Achievement system for completed tasks
export const getTaskAchievement = (completedCount: number): string => {
  if (completedCount === 0) {
    return "🥚 Task Virgin - You haven't completed a single task!";
  } else if (completedCount <= 2) {
    return "🐣 Baby Steps - You've completed a few tasks, barely!";
  } else if (completedCount <= 5) {
    return "🏃‍♂️ Getting Somewhere - Half-decent task completion!";
  } else if (completedCount <= 8) {
    return "🎯 Task Master - You're actually trying now!";
  } else if (completedCount === therapyTasks.length) {
    return "🏆 Completionist - You did all tasks! Still pathetic though!";
  } else {
    return "🔥 Task Destroyer - You're on fire... your life isn't though!";
  }
};
