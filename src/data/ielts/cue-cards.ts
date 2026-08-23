export type IeltsCueCard = {
  id: string;
  title: string;
  prompt: string;
  points: string[];
};

export const ieltsCueCards: IeltsCueCard[] = [
  {
    id: "inspiring-person",

    title: "Describe a person who inspired you",

    prompt:
      "Describe a person who has inspired you.",

    points: [
      "who this person is",
      "how you know this person",
      "what qualities this person has",
      "and explain why this person inspired you",
    ],
  },

  {
    id: "memorable-journey",

    title: "Describe a memorable journey",

    prompt:
      "Describe a journey that you remember well.",

    points: [
      "where you went",
      "who you travelled with",
      "what happened during the journey",
      "and explain why you remember it",
    ],
  },

  {
    id: "useful-skill",

    title: "Describe a useful skill",

    prompt:
      "Describe a useful skill that you learned.",

    points: [
      "what the skill is",
      "when you learned it",
      "how you learned it",
      "and explain why it is useful to you",
    ],
  },

  {
    id: "favorite-place",

    title: "Describe a place you enjoy visiting",

    prompt:
      "Describe a place that you enjoy visiting.",

    points: [
      "where the place is",
      "how often you visit it",
      "what you do there",
      "and explain why you enjoy visiting it",
    ],
  },

  {
    id: "important-decision",

    title: "Describe an important decision",

    prompt:
      "Describe an important decision that you made.",

    points: [
      "what the decision was",
      "when you made it",
      "why you made it",
      "and explain how it affected you",
    ],
  },

  {
    id: "interesting-book",

    title: "Describe an interesting book",

    prompt:
      "Describe a book that you found interesting.",

    points: [
      "what the book was",
      "when you read it",
      "what it was about",
      "and explain why you found it interesting",
    ],
  },
];