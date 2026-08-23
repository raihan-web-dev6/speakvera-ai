export type LessonQuizQuestion = {
  question: string;

  options: string[];

  answerIndex: number;

  explanation: string;
};

export type LessonVocabulary = {
  word: string;

  meaning: string;

  example: string;
};

export type LessonGrammar = {
  title: string;

  explanation: string;

  examples: string[];

  check: LessonQuizQuestion;
};

export type LessonListening = {
  title: string;

  text: string;

  question: string;
};

export type EverydayLessonContent = {
  day: number;

  title: string;

  objective: string;

  grammar: LessonGrammar;

  vocabulary: LessonVocabulary[];

  listening: LessonListening;

  speakingPrompt: string;

  quiz: LessonQuizQuestion[];
};