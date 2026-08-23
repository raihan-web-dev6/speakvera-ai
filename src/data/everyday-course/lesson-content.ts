import type {
  EverydayLessonContent,
  LessonQuizQuestion,
  LessonVocabulary,
} from "@/types/lesson";

type LessonSeed = {
  day: number;

  title: string;

  objective: string;

  grammar: {
    title: string;

    explanation: string;

    examples: string[];

    check: LessonQuizQuestion;
  };

  vocabulary: LessonVocabulary[];

  listening: {
    title: string;

    text: string;

    question: string;
  };

  speakingPrompt: string;
};

const lessons: LessonSeed[] = [
  // ==============================
  // MODULE 1 — SPEAKING FOUNDATIONS
  // ==============================

  {
    day: 1,

    title: "Introduce Yourself",

    objective:
      "Learn how to introduce yourself clearly and confidently.",

    grammar: {
      title: "Using am, is and are",

      explanation:
        "Use am with I, is with he/she/it, and are with you/we/they.",

      examples: [
        "I am a student.",
        "My name is Raihan.",
        "We are learning English.",
      ],

      check: {
        question:
          "Choose the correct sentence.",

        options: [
          "I is a student.",
          "I am a student.",
          "I are a student.",
        ],

        answerIndex: 1,

        explanation:
          'We use "am" with "I".',
      },
    },

    vocabulary: [
      {
        word: "introduce",

        meaning:
          "to tell someone who you are",

        example:
          "Let me introduce myself.",
      },

      {
        word: "hometown",

        meaning:
          "the town or city where you grew up",

        example:
          "My hometown is Karachi.",
      },

      {
        word: "currently",

        meaning:
          "at the present time",

        example:
          "I am currently studying English.",
      },
    ],

    listening: {
      title:
        "Listen to an introduction",

      text:
        "Hello, my name is Adam. I am twenty years old and I live in Manchester. I am currently studying computer science. In my free time, I enjoy football and reading.",

      question:
        "What is Adam studying?",
    },

    speakingPrompt:
      "Introduce yourself. Talk about your name, where you live, what you do, and one thing you enjoy.",
  },

  {
    day: 2,

    title: "Talk About Your Daily Routine",

    objective:
      "Describe the things you normally do each day.",

    grammar: {
      title:
        "Present simple",

      explanation:
        "Use the present simple for routines, habits and things that happen regularly.",

      examples: [
        "I wake up at seven.",
        "She goes to school every morning.",
        "We usually eat dinner at eight.",
      ],

      check: {
        question:
          "Which sentence describes a routine correctly?",

        options: [
          "I am wake up at seven every day.",
          "I wake up at seven every day.",
          "I waking up at seven every day.",
        ],

        answerIndex: 1,

        explanation:
          "For a regular routine with I, use the base verb: wake.",
      },
    },

    vocabulary: [
      {
        word: "usually",

        meaning:
          "most of the time",

        example:
          "I usually drink tea in the morning.",
      },

      {
        word: "routine",

        meaning:
          "a regular way of doing things",

        example:
          "My morning routine starts at seven.",
      },

      {
        word: "prepare",

        meaning:
          "to get something ready",

        example:
          "I prepare breakfast before work.",
      },
    ],

    listening: {
      title:
        "A normal morning",

      text:
        "Sara usually wakes up at six thirty. She takes a shower, prepares breakfast and leaves home at eight. She starts work at nine.",

      question:
        "What time does Sara start work?",
    },

    speakingPrompt:
      "Describe your normal weekday from morning until evening.",
  },

  {
    day: 3,

    title: "Talk About Family and Friends",

    objective:
      "Describe important people in your life.",

    grammar: {
      title:
        "Possessive adjectives",

      explanation:
        "Use my, your, his, her, our and their to show who something belongs to.",

      examples: [
        "My brother is friendly.",
        "Her name is Emma.",
        "Their house is nearby.",
      ],

      check: {
        question:
          "Choose the correct sentence.",

        options: [
          "She brother is kind.",
          "Her brother is kind.",
          "Hers brother is kind.",
        ],

        answerIndex: 1,

        explanation:
          'Use the possessive adjective "her" before a noun.',
      },
    },

    vocabulary: [
      {
        word: "supportive",

        meaning:
          "helpful and encouraging",

        example:
          "My parents are very supportive.",
      },

      {
        word: "relative",

        meaning:
          "a member of your family",

        example:
          "Many of my relatives live nearby.",
      },

      {
        word: "close",

        meaning:
          "having a strong relationship",

        example:
          "I am very close to my sister.",
      },
    ],

    listening: {
      title:
        "Meet Daniel's family",

      text:
        "Daniel lives with his parents and younger sister. He is very close to his sister because they enjoy many of the same activities.",

      question:
        "Why is Daniel close to his sister?",
    },

    speakingPrompt:
      "Describe one person in your family or one close friend.",
  },

  {
    day: 4,

    title: "Likes and Dislikes",

    objective:
      "Explain what you enjoy and what you do not enjoy.",

    grammar: {
      title:
        "Like + ing",

      explanation:
        "After verbs such as like, love, enjoy and dislike, we often use a verb ending in -ing.",

      examples: [
        "I enjoy reading.",
        "She likes cooking.",
        "They dislike waiting.",
      ],

      check: {
        question:
          "Choose the most natural sentence.",

        options: [
          "I enjoy to swim.",
          "I enjoy swimming.",
          "I enjoy swim.",
        ],

        answerIndex: 1,

        explanation:
          'After "enjoy", use the -ing form.',
      },
    },

    vocabulary: [
      {
        word: "prefer",

        meaning:
          "to like one thing more than another",

        example:
          "I prefer tea to coffee.",
      },

      {
        word: "hobby",

        meaning:
          "an activity you do for enjoyment",

        example:
          "Photography is my favourite hobby.",
      },

      {
        word: "interested",

        meaning:
          "wanting to learn more about something",

        example:
          "I am interested in technology.",
      },
    ],

    listening: {
      title:
        "Free-time activities",

      text:
        "Mia loves travelling and taking photographs. She also enjoys cooking, but she dislikes watching sports on television.",

      question:
        "What does Mia dislike?",
    },

    speakingPrompt:
      "Talk about three things you enjoy and one thing you dislike.",
  },

  {
    day: 5,

    title: "Talk About Your Weekend",

    objective:
      "Combine simple sentences to talk naturally about recent activities.",

    grammar: {
      title:
        "Connecting ideas with and, but and because",

      explanation:
        "Use and to add information, but to show contrast and because to give a reason.",

      examples: [
        "I stayed home and watched a film.",
        "I wanted to go out, but it was raining.",
        "I relaxed because I was tired.",
      ],

      check: {
        question:
          "Which word gives a reason?",

        options: [
          "and",
          "but",
          "because",
        ],

        answerIndex: 2,

        explanation:
          '"Because" introduces a reason.',
      },
    },

    vocabulary: [
      {
        word: "relax",

        meaning:
          "to rest and become less stressed",

        example:
          "I relax on Sunday evenings.",
      },

      {
        word: "spend",

        meaning:
          "to use time doing something",

        example:
          "I spend weekends with my family.",
      },

      {
        word: "occasionally",

        meaning:
          "sometimes, but not often",

        example:
          "I occasionally go to the cinema.",
      },
    ],

    listening: {
      title:
        "A busy weekend",

      text:
        "On Saturday, Leo met his friends and played football. On Sunday, he stayed home because he needed to finish some work.",

      question:
        "Why did Leo stay home on Sunday?",
    },

    speakingPrompt:
      "Tell me what you usually do on weekends and explain why you enjoy it.",
  },

  // ==============================
  // MODULE 2 — EVERYDAY GRAMMAR
  // ==============================

  {
    day: 6,

    title: "Present Simple",

    objective:
      "Use the present simple accurately when talking about habits and facts.",

    grammar: {
      title:
        "Third-person -s",

      explanation:
        "With he, she and it, most present-simple verbs take -s or -es.",

      examples: [
        "I work from home.",
        "She works from home.",
        "He watches television.",
      ],

      check: {
        question:
          "Choose the correct sentence.",

        options: [
          "He work every day.",
          "He works every day.",
          "He working every day.",
        ],

        answerIndex: 1,

        explanation:
          'With "he", the verb normally takes -s.',
      },
    },

    vocabulary: [
      {
        word: "habit",
        meaning: "something you do regularly",
        example: "Reading before bed is a good habit.",
      },
      {
        word: "regularly",
        meaning: "often and in a repeated way",
        example: "I exercise regularly.",
      },
      {
        word: "schedule",
        meaning: "a plan of activities and times",
        example: "My schedule is busy today.",
      },
    ],

    listening: {
      title: "A working day",

      text:
        "Tom works in a bank. He starts at nine and finishes at five. He usually takes the train to work.",

      question:
        "How does Tom usually travel to work?",
    },

    speakingPrompt:
      "Describe three habits you have during a normal week.",
  },

  {
    day: 7,

    title: "Present Continuous",

    objective:
      "Talk about actions happening now or around the present time.",

    grammar: {
      title:
        "am/is/are + verb-ing",

      explanation:
        "Use the present continuous for actions happening now or temporary situations.",

      examples: [
        "I am studying now.",
        "She is talking on the phone.",
        "They are staying with friends this week.",
      ],

      check: {
        question:
          "Choose the correct present continuous sentence.",

        options: [
          "She talking now.",
          "She is talking now.",
          "She talks now at this moment.",
        ],

        answerIndex: 1,

        explanation:
          "Present continuous uses be + verb-ing.",
      },
    },

    vocabulary: [
      {
        word: "currently",
        meaning: "at the present time",
        example: "I am currently working on a project.",
      },
      {
        word: "temporary",
        meaning: "lasting for only a limited time",
        example: "This is a temporary job.",
      },
      {
        word: "moment",
        meaning: "a short period of time",
        example: "I am busy at the moment.",
      },
    ],

    listening: {
      title: "What's happening?",

      text:
        "Anna is sitting in a café. She is drinking coffee and waiting for her friend. Her friend is travelling by bus.",

      question:
        "Who is Anna waiting for?",
    },

    speakingPrompt:
      "Describe what you and the people around you are doing right now.",
  },

  {
    day: 8,

    title: "Past Simple",

    objective:
      "Describe completed events in the past.",

    grammar: {
      title:
        "Past simple verbs",

      explanation:
        "Use the past simple for completed actions. Regular verbs normally use -ed; irregular verbs change form.",

      examples: [
        "I visited my friend yesterday.",
        "She went to the market.",
        "We watched a film.",
      ],

      check: {
        question:
          "Choose the correct past form of go.",

        options: [
          "goed",
          "went",
          "going",
        ],

        answerIndex: 1,

        explanation:
          '"Went" is the irregular past form of "go".',
      },
    },

    vocabulary: [
      {
        word: "yesterday",
        meaning: "the day before today",
        example: "I studied yesterday.",
      },
      {
        word: "recently",
        meaning: "not long ago",
        example: "I recently visited Lahore.",
      },
      {
        word: "experience",
        meaning: "something that happens to you",
        example: "It was an interesting experience.",
      },
    ],

    listening: {
      title: "Yesterday",

      text:
        "Yesterday, Nina finished work early. She met a friend, ate dinner at a restaurant and returned home at ten.",

      question:
        "Where did Nina eat dinner?",
    },

    speakingPrompt:
      "Tell a short story about something you did yesterday.",
  },

  {
    day: 9,

    title: "Future Plans",

    objective:
      "Talk about plans and predictions.",

    grammar: {
      title:
        "Going to and will",

      explanation:
        "Use going to for plans and intentions. Will is often used for predictions and decisions made at the moment.",

      examples: [
        "I am going to study tonight.",
        "We are going to travel next month.",
        "I think it will rain tomorrow.",
      ],

      check: {
        question:
          "Which sentence clearly describes an existing plan?",

        options: [
          "I am going to visit my uncle tomorrow.",
          "I visited my uncle tomorrow.",
          "I visiting my uncle tomorrow.",
        ],

        answerIndex: 0,

        explanation:
          '"Going to" is commonly used for planned future actions.',
      },
    },

    vocabulary: [
      {
        word: "plan",
        meaning: "something you intend to do",
        example: "My plan is to study abroad.",
      },
      {
        word: "goal",
        meaning: "something you want to achieve",
        example: "My goal is to speak English confidently.",
      },
      {
        word: "expect",
        meaning: "to think something will happen",
        example: "I expect the journey will take two hours.",
      },
    ],

    listening: {
      title: "Plans for next year",

      text:
        "Alex is going to finish university next year. After graduation, he plans to find a job and move to another city.",

      question:
        "What does Alex plan to do after graduation?",
    },

    speakingPrompt:
      "Describe three things you are going to do in the next twelve months.",
  },

  {
    day: 10,

    title: "Questions and Negatives",

    objective:
      "Form clear present-simple questions and negative sentences.",

    grammar: {
      title:
        "Do, does, don't and doesn't",

      explanation:
        "Use do/does to form present-simple questions and don't/doesn't for negatives.",

      examples: [
        "Do you like coffee?",
        "Does she work here?",
        "He doesn't drive.",
      ],

      check: {
        question:
          "Choose the correct question.",

        options: [
          "Does he likes football?",
          "Does he like football?",
          "Do he like football?",
        ],

        answerIndex: 1,

        explanation:
          'After "does", use the base verb.',
      },
    },

    vocabulary: [
      {
        word: "question",
        meaning: "a sentence used to ask for information",
        example: "Can I ask you a question?",
      },
      {
        word: "answer",
        meaning: "a response to a question",
        example: "I know the answer.",
      },
      {
        word: "clarify",
        meaning: "to make something easier to understand",
        example: "Could you clarify your question?",
      },
    ],

    listening: {
      title: "Getting to know someone",

      text:
        "Do you live near here? Do you work or study? What do you normally do in your free time?",

      question:
        "How many questions did you hear?",
    },

    speakingPrompt:
      "Imagine you have just met someone. Ask five questions you would use to get to know them.",
  },

  // ==============================
  // MODULE 3 — VOCABULARY
  // ==============================

  {
    day: 11,

    title: "Describe People",

    objective:
      "Use stronger adjectives to describe personality and appearance.",

    grammar: {
      title:
        "Adjective + noun",

      explanation:
        "Adjectives usually come before nouns or after the verb be.",

      examples: [
        "She is friendly.",
        "He is a reliable person.",
        "They are very patient.",
      ],

      check: {
        question:
          "Choose the natural sentence.",

        options: [
          "She is person friendly.",
          "She is a friendly person.",
          "She friendly is person.",
        ],

        answerIndex: 1,

        explanation:
          "An adjective normally comes before the noun it describes.",
      },
    },

    vocabulary: [
      {
        word: "reliable",
        meaning: "someone you can trust",
        example: "My friend is very reliable.",
      },
      {
        word: "patient",
        meaning: "able to wait calmly",
        example: "A good teacher should be patient.",
      },
      {
        word: "outgoing",
        meaning: "friendly and comfortable meeting people",
        example: "My cousin is very outgoing.",
      },
    ],

    listening: {
      title: "My best friend",

      text:
        "My best friend is outgoing, reliable and very patient. He enjoys meeting new people and always helps me when I need advice.",

      question:
        "What three qualities describe the speaker's friend?",
    },

    speakingPrompt:
      "Describe someone you admire and explain their personality.",
  },

  {
    day: 12,

    title: "Places and Directions",

    objective:
      "Describe locations and give simple directions.",

    grammar: {
      title:
        "Prepositions of place",

      explanation:
        "Use words such as next to, opposite, between and near to explain location.",

      examples: [
        "The bank is next to the café.",
        "The park is opposite the school.",
        "The shop is between two restaurants.",
      ],

      check: {
        question:
          "If the café is directly across the road from the bank, it is ___ the bank.",

        options: [
          "inside",
          "opposite",
          "between",
        ],

        answerIndex: 1,

        explanation:
          '"Opposite" means facing something from the other side.',
      },
    },

    vocabulary: [
      {
        word: "intersection",
        meaning: "a place where roads meet",
        example: "Turn left at the intersection.",
      },
      {
        word: "opposite",
        meaning: "on the other side facing something",
        example: "The hotel is opposite the station.",
      },
      {
        word: "nearby",
        meaning: "not far away",
        example: "There is a pharmacy nearby.",
      },
    ],

    listening: {
      title: "Finding the library",

      text:
        "Walk straight for two blocks, turn right at the traffic lights, and you will see the library opposite the park.",

      question:
        "What is opposite the library?",
    },

    speakingPrompt:
      "Give directions from your home to a nearby shop, school or landmark.",
  },

  {
    day: 13,

    title: "Food and Restaurants",

    objective:
      "Talk about food and order politely in a restaurant.",

    grammar: {
      title:
        "I'd like and could I have",

      explanation:
        "Use I'd like or could I have to make polite requests.",

      examples: [
        "I'd like a coffee, please.",
        "Could I have the menu?",
        "I'd like to order the chicken.",
      ],

      check: {
        question:
          "Which is the most polite restaurant request?",

        options: [
          "Give me water.",
          "Could I have some water, please?",
          "Water now.",
        ],

        answerIndex: 1,

        explanation:
          '"Could I have...?" is a polite request form.',
      },
    },

    vocabulary: [
      {
        word: "recommend",
        meaning: "to suggest something good",
        example: "What dish do you recommend?",
      },
      {
        word: "menu",
        meaning: "a list of available food and drinks",
        example: "Could I see the menu?",
      },
      {
        word: "portion",
        meaning: "an amount of food served to one person",
        example: "The portion was quite large.",
      },
    ],

    listening: {
      title: "Ordering lunch",

      text:
        "I'd like the grilled chicken, please. Could I also have a glass of water? For dessert, I'll have the chocolate cake.",

      question:
        "What does the customer order for dessert?",
    },

    speakingPrompt:
      "Imagine you are at a restaurant. Order a complete meal politely.",
  },

  {
    day: 14,

    title: "Work and Study",

    objective:
      "Explain what you do and talk about responsibilities.",

    grammar: {
      title:
        "Have to and need to",

      explanation:
        "Use have to and need to for responsibilities and necessary actions.",

      examples: [
        "I have to finish my assignment.",
        "She needs to attend a meeting.",
        "We have to arrive on time.",
      ],

      check: {
        question:
          "Choose the correct sentence.",

        options: [
          "I have finish my work.",
          "I have to finish my work.",
          "I having to finish my work.",
        ],

        answerIndex: 1,

        explanation:
          "Use have to + base verb.",
      },
    },

    vocabulary: [
      {
        word: "responsibility",
        meaning: "something you are expected to do",
        example: "Managing customers is one of my responsibilities.",
      },
      {
        word: "deadline",
        meaning: "the time by which work must be finished",
        example: "The deadline is Friday.",
      },
      {
        word: "assignment",
        meaning: "a piece of work given to a student",
        example: "I submitted my assignment yesterday.",
      },
    ],

    listening: {
      title: "A busy student",

      text:
        "Lena has two assignments this week. She needs to finish one by Wednesday and the other by Friday, so she is studying every evening.",

      question:
        "Why is Lena studying every evening?",
    },

    speakingPrompt:
      "Describe your work or studies and explain your main responsibilities.",
  },

  {
    day: 15,

    title: "Travel Vocabulary",

    objective:
      "Talk about journeys, transport and travel experiences.",

    grammar: {
      title:
        "By + transport",

      explanation:
        "Use by with most forms of transport: by bus, by train, by plane. Say on foot when walking.",

      examples: [
        "I travel by bus.",
        "We went by plane.",
        "She came on foot.",
      ],

      check: {
        question:
          "Choose the correct phrase.",

        options: [
          "by train",
          "with train",
          "on train transport",
        ],

        answerIndex: 0,

        explanation:
          'Use "by" with forms of transport.',
      },
    },

    vocabulary: [
      {
        word: "destination",
        meaning: "the place you are travelling to",
        example: "Dubai was our final destination.",
      },
      {
        word: "departure",
        meaning: "the act or time of leaving",
        example: "Our departure time is nine.",
      },
      {
        word: "journey",
        meaning: "the act of travelling from one place to another",
        example: "The journey took four hours.",
      },
    ],

    listening: {
      title: "A train journey",

      text:
        "Our train departed at seven in the morning. The journey took three hours, and we arrived at our destination just before ten.",

      question:
        "How long did the journey take?",
    },

    speakingPrompt:
      "Describe a journey you remember well.",
  },

  // ==============================
  // MODULE 4 — CONVERSATIONS
  // ==============================

  {
    day: 16,

    title: "At a Café",

    objective:
      "Handle a simple café conversation confidently.",

    grammar: {
      title:
        "Can I...? / Could I...?",

      explanation:
        "Can I and could I are useful for asking for things or permission. Could I sounds slightly more polite.",

      examples: [
        "Can I have a coffee?",
        "Could I sit here?",
        "Could I have the bill, please?",
      ],

      check: {
        question:
          "Which sentence is a polite request?",

        options: [
          "Coffee!",
          "Could I have a coffee, please?",
          "You give coffee.",
        ],

        answerIndex: 1,

        explanation:
          '"Could I have..." is polite and natural.',
      },
    },

    vocabulary: [
      {
        word: "bill",
        meaning: "a document showing how much you must pay",
        example: "Could we have the bill?",
      },
      {
        word: "available",
        meaning: "ready to be used or bought",
        example: "Is this table available?",
      },
      {
        word: "takeaway",
        meaning: "food or drink taken away rather than consumed there",
        example: "I'd like a coffee to take away.",
      },
    ],

    listening: {
      title: "Coffee order",

      text:
        "Could I have a medium latte and a cheese sandwich, please? I'll have them here. That's everything, thank you.",

      question:
        "Is the customer taking the order away?",
    },

    speakingPrompt:
      "Role-play ordering drinks and food at a café.",
  },

  {
    day: 17,

    title: "Shopping",

    objective:
      "Ask about price, size and availability while shopping.",

    grammar: {
      title:
        "How much / how many",

      explanation:
        "Use how much with prices and uncountable nouns. Use how many with countable plural nouns.",

      examples: [
        "How much is this shirt?",
        "How much water do you need?",
        "How many bags do you have?",
      ],

      check: {
        question:
          "Which question asks about price?",

        options: [
          "How many is this shirt?",
          "How much is this shirt?",
          "How price this shirt?",
        ],

        answerIndex: 1,

        explanation:
          '"How much is...?" asks about price.',
      },
    },

    vocabulary: [
      {
        word: "refund",
        meaning: "money returned after returning an item",
        example: "Can I get a refund?",
      },
      {
        word: "receipt",
        meaning: "proof that you paid for something",
        example: "Please keep your receipt.",
      },
      {
        word: "discount",
        meaning: "a reduction in price",
        example: "This jacket has a twenty percent discount.",
      },
    ],

    listening: {
      title: "Buying shoes",

      text:
        "These shoes are forty pounds, but there is a ten percent discount today. We also have them in black and brown.",

      question:
        "What discount is available?",
    },

    speakingPrompt:
      "Imagine you are buying clothes. Ask about price, size and colour.",
  },

  {
    day: 18,

    title: "Health and the Doctor",

    objective:
      "Explain basic symptoms and understand simple health advice.",

    grammar: {
      title:
        "Should and shouldn't",

      explanation:
        "Use should to give advice and shouldn't to say something is not a good idea.",

      examples: [
        "You should rest.",
        "You should drink more water.",
        "You shouldn't work today.",
      ],

      check: {
        question:
          "Your friend is very tired. Which advice is appropriate?",

        options: [
          "You should rest.",
          "You should to rest.",
          "You resting should.",
        ],

        answerIndex: 0,

        explanation:
          "Use should + base verb.",
      },
    },

    vocabulary: [
      {
        word: "symptom",
        meaning: "a sign that you may be ill",
        example: "A headache can be a symptom.",
      },
      {
        word: "appointment",
        meaning: "an arranged time to meet a professional",
        example: "I have a doctor's appointment.",
      },
      {
        word: "recover",
        meaning: "to become healthy again",
        example: "It took a week to recover.",
      },
    ],

    listening: {
      title: "Doctor's advice",

      text:
        "You have a mild cold. You should rest, drink plenty of water and avoid strenuous exercise for a few days.",

      question:
        "What should the patient avoid?",
    },

    speakingPrompt:
      "Imagine you are talking to a doctor. Explain how you feel and ask for advice.",
  },

  {
    day: 19,

    title: "Phone Conversations",

    objective:
      "Handle basic telephone conversations.",

    grammar: {
      title:
        "Could you...?",

      explanation:
        "Use could you to make polite requests during phone conversations.",

      examples: [
        "Could you repeat that?",
        "Could you speak more slowly?",
        "Could you leave a message?",
      ],

      check: {
        question:
          "You did not hear someone clearly. What should you say?",

        options: [
          "Repeat!",
          "Could you repeat that, please?",
          "You repeat me.",
        ],

        answerIndex: 1,

        explanation:
          '"Could you repeat that?" is polite and natural.',
      },
    },

    vocabulary: [
      {
        word: "available",
        meaning: "free and able to talk or meet",
        example: "Is Mr Smith available?",
      },
      {
        word: "message",
        meaning: "information left for someone",
        example: "Can I leave a message?",
      },
      {
        word: "connection",
        meaning: "the communication link during a phone call",
        example: "The connection is poor.",
      },
    ],

    listening: {
      title: "Leaving a message",

      text:
        "I'm afraid Sarah isn't available right now. Would you like to leave a message? Yes, please ask her to call me this afternoon.",

      question:
        "When should Sarah call back?",
    },

    speakingPrompt:
      "Role-play calling a company and asking to speak to someone who is unavailable.",
  },

  {
    day: 20,

    title: "Asking for Help",

    objective:
      "Ask for assistance clearly and politely.",

    grammar: {
      title:
        "Would you mind...?",

      explanation:
        "Would you mind is a polite way to request help. It is commonly followed by verb-ing.",

      examples: [
        "Would you mind helping me?",
        "Would you mind opening the door?",
        "Would you mind explaining that again?",
      ],

      check: {
        question:
          "Choose the correct phrase.",

        options: [
          "Would you mind help me?",
          "Would you mind helping me?",
          "Would mind you helping?",
        ],

        answerIndex: 1,

        explanation:
          '"Would you mind" is followed by the -ing form.',
      },
    },

    vocabulary: [
      {
        word: "assistance",
        meaning: "help",
        example: "Thank you for your assistance.",
      },
      {
        word: "explain",
        meaning: "to make something clear",
        example: "Could you explain this rule?",
      },
      {
        word: "appreciate",
        meaning: "to be thankful for something",
        example: "I really appreciate your help.",
      },
    ],

    listening: {
      title: "Help with a machine",

      text:
        "Excuse me, would you mind showing me how this machine works? Of course. Press this button first and then select your option.",

      question:
        "What should the person do first?",
    },

    speakingPrompt:
      "Describe a situation where you need help and politely ask someone for assistance.",
  },

  // ==============================
  // MODULE 5 — LISTENING & DELIVERY
  // ==============================

  {
    day: 21,

    title: "Word Stress",

    objective:
      "Notice stressed syllables in common English words.",

    grammar: {
      title:
        "Content words",

      explanation:
        "Important nouns, verbs, adjectives and adverbs usually carry more stress in spoken English.",

      examples: [
        "I NEED a NEW LAPTOP.",
        "She BOUGHT a BEAUTIFUL DRESS.",
        "We WORK in LONDON.",
      ],

      check: {
        question:
          "Which type of word is commonly stressed?",

        options: [
          "Important nouns and verbs",
          "Every article equally",
          "Only the word 'the'",
        ],

        answerIndex: 0,

        explanation:
          "Content words such as nouns and main verbs usually carry stress.",
      },
    },

    vocabulary: [
      {
        word: "stress",
        meaning: "extra emphasis given to a sound or word",
        example: "The stress is on the first syllable.",
      },
      {
        word: "syllable",
        meaning: "a unit of pronunciation within a word",
        example: "Computer has three syllables.",
      },
      {
        word: "emphasis",
        meaning: "special importance given to something",
        example: "Put emphasis on the key word.",
      },
    ],

    listening: {
      title: "Important words",

      text:
        "I really NEED to FINISH this PROJECT by FRIDAY because the CLIENT is WAITING.",

      question:
        "Which words sound most important in the sentence?",
    },

    speakingPrompt:
      "Say five sentences and deliberately emphasize the most important words.",
  },

  {
    day: 22,

    title: "Sentence Stress",

    objective:
      "Make sentences sound more natural by stressing key information.",

    grammar: {
      title:
        "Strong and weak words",

      explanation:
        "English speakers often stress important information while small grammar words are spoken more lightly.",

      examples: [
        "I WANT to BUY a CAR.",
        "She WENT to the STORE.",
        "We NEED more TIME.",
      ],

      check: {
        question:
          "In 'I NEED more TIME', which words usually receive the strongest stress?",

        options: [
          "I and more",
          "need and time",
          "every word equally",
        ],

        answerIndex: 1,

        explanation:
          "The meaning-carrying words NEED and TIME usually receive stronger stress.",
      },
    },

    vocabulary: [
      {
        word: "rhythm",
        meaning: "a repeated pattern of strong and weak sounds",
        example: "English has a strong speech rhythm.",
      },
      {
        word: "natural",
        meaning: "normal and not forced",
        example: "Her English sounds natural.",
      },
      {
        word: "highlight",
        meaning: "to make something especially noticeable",
        example: "Stress can highlight important information.",
      },
    ],

    listening: {
      title: "Stress changes meaning",

      text:
        "I didn't say HE stole the money. I said his brother did.",

      question:
        "Which word is emphasized to correct the listener?",
    },

    speakingPrompt:
      "Say the sentence 'I didn't say she bought the blue car' several times, stressing a different word each time.",
  },

  {
    day: 23,

    title: "Connected Speech",

    objective:
      "Understand why spoken English sounds different from carefully separated words.",

    grammar: {
      title:
        "Linking words",

      explanation:
        "In natural speech, the end of one word often connects smoothly to the beginning of the next.",

      examples: [
        "turn_off",
        "pick_it_up",
        "an_apple",
      ],

      check: {
        question:
          "What often happens in natural connected speech?",

        options: [
          "Every word is separated by a long pause.",
          "Words can link smoothly together.",
          "Speakers remove every vowel.",
        ],

        answerIndex: 1,

        explanation:
          "Natural speech frequently links neighbouring sounds and words.",
      },
    },

    vocabulary: [
      {
        word: "link",
        meaning: "to connect things together",
        example: "Try to link these two words.",
      },
      {
        word: "smooth",
        meaning: "continuous without sudden stops",
        example: "Her speech sounds smooth.",
      },
      {
        word: "pause",
        meaning: "a short stop while speaking",
        example: "Use a short pause between ideas.",
      },
    ],

    listening: {
      title: "Natural speech",

      text:
        "Can you pick it up on your way home and bring it over when you arrive?",

      question:
        "Which groups of words may naturally link together?",
    },

    speakingPrompt:
      "Practice saying common phrases such as 'pick it up', 'turn it off' and 'go away' smoothly.",
  },

  {
    day: 24,

    title: "Listening for Key Information",

    objective:
      "Identify important details without trying to understand every word.",

    grammar: {
      title:
        "Question words",

      explanation:
        "Who, what, when, where, why and how help you identify the type of information you need.",

      examples: [
        "When does it start?",
        "Where is the meeting?",
        "How much does it cost?",
      ],

      check: {
        question:
          "Which question word asks about time?",

        options: [
          "Where",
          "When",
          "Who",
        ],

        answerIndex: 1,

        explanation:
          '"When" asks about time.',
      },
    },

    vocabulary: [
      {
        word: "detail",
        meaning: "a small piece of information",
        example: "Listen for important details.",
      },
      {
        word: "identify",
        meaning: "to recognise or find something",
        example: "Identify the speaker's main point.",
      },
      {
        word: "specific",
        meaning: "exact and clearly defined",
        example: "Listen for specific information.",
      },
    ],

    listening: {
      title: "Meeting information",

      text:
        "The meeting will take place on Thursday at three thirty in Room 204. Please bring your project notes.",

      question:
        "When and where is the meeting?",
    },

    speakingPrompt:
      "Give someone instructions containing a date, time, place and one thing they need to bring.",
  },

  {
    day: 25,

    title: "Listening to Opinions",

    objective:
      "Recognise when people agree, disagree or express uncertainty.",

    grammar: {
      title:
        "Opinion phrases",

      explanation:
        "Use phrases such as I think, in my opinion, I agree and I'm not sure to express your position.",

      examples: [
        "I think it's a good idea.",
        "In my opinion, we need more time.",
        "I'm not sure I agree.",
      ],

      check: {
        question:
          "Which phrase expresses uncertainty?",

        options: [
          "I'm not sure.",
          "I completely agree.",
          "Definitely.",
        ],

        answerIndex: 0,

        explanation:
          '"I\'m not sure" communicates uncertainty.',
      },
    },

    vocabulary: [
      {
        word: "opinion",
        meaning: "a personal belief or view",
        example: "What is your opinion?",
      },
      {
        word: "agree",
        meaning: "to have the same opinion",
        example: "I agree with you.",
      },
      {
        word: "disagree",
        meaning: "to have a different opinion",
        example: "I respectfully disagree.",
      },
    ],

    listening: {
      title: "Different opinions",

      text:
        "I think working from home is convenient. I agree that it's convenient, but I sometimes miss talking to colleagues in person.",

      question:
        "What disadvantage does the second speaker mention?",
    },

    speakingPrompt:
      "Give your opinion about working or studying from home.",
  },

  // ==============================
  // MODULE 6 — REAL-LIFE ENGLISH
  // ==============================

  {
    day: 26,

    title: "Basic Job Interview",

    objective:
      "Answer common interview questions clearly.",

    grammar: {
      title:
        "Present perfect for experience",

      explanation:
        "Use have/has + past participle to talk about experience without focusing on a specific past time.",

      examples: [
        "I have worked with customers.",
        "I have completed several projects.",
        "She has studied marketing.",
      ],

      check: {
        question:
          "Choose the correct present perfect sentence.",

        options: [
          "I have worked in sales.",
          "I have work in sales.",
          "I has worked in sales.",
        ],

        answerIndex: 0,

        explanation:
          "Use have + past participle with I.",
      },
    },

    vocabulary: [
      {
        word: "experience",
        meaning: "knowledge gained through doing something",
        example: "I have experience in customer service.",
      },
      {
        word: "strength",
        meaning: "a skill or quality you are good at",
        example: "Communication is one of my strengths.",
      },
      {
        word: "opportunity",
        meaning: "a chance to do something",
        example: "This job is a great opportunity.",
      },
    ],

    listening: {
      title: "Interview answer",

      text:
        "I have worked on several team projects. One of my main strengths is communication, and I enjoy learning new skills.",

      question:
        "What strength does the candidate mention?",
    },

    speakingPrompt:
      "Answer: Tell me about yourself and explain one of your strengths.",
  },

  {
    day: 27,

    title: "Hotel Check-In",

    objective:
      "Handle a hotel check-in conversation.",

    grammar: {
      title:
        "I have a reservation",

      explanation:
        "Use have with reservation or booking when explaining your accommodation arrangements.",

      examples: [
        "I have a reservation.",
        "The booking is under Tariq.",
        "Could I check in, please?",
      ],

      check: {
        question:
          "What is a natural phrase at hotel reception?",

        options: [
          "I have a reservation.",
          "I am reservation.",
          "Reservation has me.",
        ],

        answerIndex: 0,

        explanation:
          '"I have a reservation" is the standard structure.',
      },
    },

    vocabulary: [
      {
        word: "reservation",
        meaning: "an arrangement to keep a room or seat for you",
        example: "I have a reservation for two nights.",
      },
      {
        word: "reception",
        meaning: "the hotel desk where guests receive assistance",
        example: "Ask at reception.",
      },
      {
        word: "vacancy",
        meaning: "an available room",
        example: "Do you have any vacancies tonight?",
      },
    ],

    listening: {
      title: "Checking in",

      text:
        "Good evening. I have a reservation for three nights under the name Ahmed Khan. Certainly. May I see your passport, please?",

      question:
        "How many nights is the guest staying?",
    },

    speakingPrompt:
      "Role-play checking into a hotel and asking about breakfast and Wi-Fi.",
  },

  {
    day: 28,

    title: "At the Airport",

    objective:
      "Understand and use common airport language.",

    grammar: {
      title:
        "Must and mustn't",

      explanation:
        "Use must for strong requirements and mustn't for things that are prohibited.",

      examples: [
        "You must show your passport.",
        "Passengers must arrive early.",
        "You mustn't leave your bag unattended.",
      ],

      check: {
        question:
          "Which phrase means something is prohibited?",

        options: [
          "must",
          "mustn't",
          "might",
        ],

        answerIndex: 1,

        explanation:
          '"Mustn\'t" expresses prohibition.',
      },
    },

    vocabulary: [
      {
        word: "boarding",
        meaning: "the process of getting onto a plane",
        example: "Boarding begins at six.",
      },
      {
        word: "gate",
        meaning: "the airport area where passengers enter a plane",
        example: "Our flight leaves from Gate 12.",
      },
      {
        word: "delay",
        meaning: "a situation where something happens later than planned",
        example: "The flight has a thirty-minute delay.",
      },
    ],

    listening: {
      title: "Airport announcement",

      text:
        "Flight 214 to Dubai has been delayed by forty minutes. Passengers should remain near Gate 18.",

      question:
        "How long is the flight delayed?",
    },

    speakingPrompt:
      "Imagine your flight is delayed. Ask airport staff for information about the new departure time.",
  },

  {
    day: 29,

    title: "Complaints and Problems",

    objective:
      "Explain a problem politely and ask for a solution.",

    grammar: {
      title:
        "There seems to be...",

      explanation:
        "Phrases such as there seems to be and I'm afraid are useful for making complaints politely.",

      examples: [
        "There seems to be a problem.",
        "I'm afraid this isn't what I ordered.",
        "Could you help me resolve this?",
      ],

      check: {
        question:
          "Which complaint sounds most polite?",

        options: [
          "This is terrible!",
          "There seems to be a problem with my order.",
          "You did everything wrong.",
        ],

        answerIndex: 1,

        explanation:
          "Indirect language makes complaints more polite.",
      },
    },

    vocabulary: [
      {
        word: "issue",
        meaning: "a problem",
        example: "There is an issue with my order.",
      },
      {
        word: "resolve",
        meaning: "to solve a problem",
        example: "Could you help resolve this issue?",
      },
      {
        word: "replacement",
        meaning: "something given instead of a damaged or incorrect item",
        example: "I'd like a replacement, please.",
      },
    ],

    listening: {
      title: "Wrong order",

      text:
        "I'm afraid I ordered the vegetarian meal, but this contains chicken. I'm very sorry. I'll bring you the correct meal immediately.",

      question:
        "What was wrong with the order?",
    },

    speakingPrompt:
      "Make a polite complaint about receiving the wrong product or service.",
  },

  {
    day: 30,

    title: "Appointments and Plans",

    objective:
      "Arrange and change appointments.",

    grammar: {
      title:
        "Would + time suit you?",

      explanation:
        "Use would...suit you, are you available, and could we reschedule when arranging meetings.",

      examples: [
        "Would Tuesday suit you?",
        "Are you available at three?",
        "Could we reschedule the meeting?",
      ],

      check: {
        question:
          "You need to change a meeting. What can you say?",

        options: [
          "Could we reschedule the meeting?",
          "Meeting change now.",
          "You meeting different.",
        ],

        answerIndex: 0,

        explanation:
          '"Could we reschedule..." is clear and polite.',
      },
    },

    vocabulary: [
      {
        word: "reschedule",
        meaning: "to arrange something for a different time",
        example: "Can we reschedule our meeting?",
      },
      {
        word: "available",
        meaning: "free at a particular time",
        example: "I'm available after four.",
      },
      {
        word: "confirm",
        meaning: "to state that an arrangement is definite",
        example: "Please confirm the appointment.",
      },
    ],

    listening: {
      title: "Changing a meeting",

      text:
        "I'm afraid I can't meet on Monday. Would Wednesday afternoon suit you? Yes, three o'clock would be perfect.",

      question:
        "When will the new meeting take place?",
    },

    speakingPrompt:
      "Arrange an appointment with someone, then suggest changing the time.",
  },

  // ==============================
  // MODULE 7 — FLUENCY TRAINING
  // ==============================

  {
    day: 31,

    title: "Speak Without Overthinking",

    objective:
      "Keep speaking even when you cannot immediately remember a word.",

    grammar: {
      title:
        "Filler and thinking phrases",

      explanation:
        "Natural thinking phrases can give you time without completely stopping your answer.",

      examples: [
        "Let me think for a moment.",
        "That's an interesting question.",
        "What I mean is...",
      ],

      check: {
        question:
          "Which phrase can naturally give you thinking time?",

        options: [
          "Let me think for a moment.",
          "I stop English now.",
          "No word.",
        ],

        answerIndex: 0,

        explanation:
          "Short thinking phrases help maintain conversational flow.",
      },
    },

    vocabulary: [
      {
        word: "hesitate",
        meaning: "to pause because you are unsure",
        example: "Try not to hesitate for too long.",
      },
      {
        word: "express",
        meaning: "to communicate an idea",
        example: "I want to express my opinion clearly.",
      },
      {
        word: "flow",
        meaning: "smooth continuous movement or speech",
        example: "Keep the conversation flowing.",
      },
    ],

    listening: {
      title: "Thinking naturally",

      text:
        "That's an interesting question. Let me think for a moment. I suppose the main reason is that technology saves people a lot of time.",

      question:
        "Which phrase gives the speaker time to think?",
    },

    speakingPrompt:
      "Speak for one minute about your favourite place without stopping completely.",
  },

  {
    day: 32,

    title: "Tell a Story",

    objective:
      "Organise a story with a clear beginning, middle and ending.",

    grammar: {
      title:
        "Sequence words",

      explanation:
        "Use first, then, after that, eventually and finally to organise events.",

      examples: [
        "First, we arrived at the station.",
        "Then, we bought our tickets.",
        "Finally, the train arrived.",
      ],

      check: {
        question:
          "Which word is useful for introducing the final event?",

        options: [
          "Finally",
          "Because",
          "Although",
        ],

        answerIndex: 0,

        explanation:
          '"Finally" introduces the last event in a sequence.',
      },
    },

    vocabulary: [
      {
        word: "eventually",
        meaning: "in the end, after some time",
        example: "Eventually, we found the hotel.",
      },
      {
        word: "suddenly",
        meaning: "quickly and unexpectedly",
        example: "Suddenly, it started raining.",
      },
      {
        word: "fortunately",
        meaning: "luckily",
        example: "Fortunately, nobody was hurt.",
      },
    ],

    listening: {
      title: "A missed train",

      text:
        "First, we left home late. Then our taxi got stuck in traffic. Eventually we reached the station, but unfortunately the train had already left.",

      question:
        "Why did they miss the train?",
    },

    speakingPrompt:
      "Tell a short story about a surprising or memorable day.",
  },

  {
    day: 33,

    title: "Give Stronger Opinions",

    objective:
      "Develop opinions instead of giving one-sentence answers.",

    grammar: {
      title:
        "Opinion + reason + example",

      explanation:
        "A strong spoken answer often contains your opinion, a reason and an example.",

      examples: [
        "I think exercise is important because it improves health. For example, walking every day can reduce stress.",
        "In my view, online learning is useful because it is flexible.",
      ],

      check: {
        question:
          "Which answer is best developed?",

        options: [
          "Yes.",
          "I like it.",
          "I think it is useful because it saves time, especially for busy students.",
        ],

        answerIndex: 2,

        explanation:
          "The third answer contains an opinion and supporting reason.",
      },
    },

    vocabulary: [
      {
        word: "perspective",
        meaning: "a particular way of thinking about something",
        example: "From my perspective, the change is positive.",
      },
      {
        word: "benefit",
        meaning: "an advantage",
        example: "One benefit is greater flexibility.",
      },
      {
        word: "drawback",
        meaning: "a disadvantage",
        example: "The main drawback is the cost.",
      },
    ],

    listening: {
      title: "Opinion about cities",

      text:
        "In my view, living in a large city offers many opportunities. However, one major drawback is the high cost of housing.",

      question:
        "What drawback does the speaker mention?",
    },

    speakingPrompt:
      "Do you prefer living in a large city or a small town? Give reasons and an example.",
  },

  {
    day: 34,

    title: "Compare Choices",

    objective:
      "Compare two options naturally.",

    grammar: {
      title:
        "Comparatives",

      explanation:
        "Use comparative forms such as better, cheaper, easier and more convenient when comparing two things.",

      examples: [
        "Trains are faster than buses.",
        "This option is more convenient.",
        "Working from home can be cheaper.",
      ],

      check: {
        question:
          "Choose the correct comparative.",

        options: [
          "more easier",
          "easier",
          "most easy than",
        ],

        answerIndex: 1,

        explanation:
          'The comparative of "easy" is "easier".',
      },
    },

    vocabulary: [
      {
        word: "advantage",
        meaning: "a positive feature",
        example: "One advantage is lower cost.",
      },
      {
        word: "alternative",
        meaning: "another possible choice",
        example: "We need an alternative solution.",
      },
      {
        word: "convenient",
        meaning: "easy and suitable for your situation",
        example: "Online shopping is convenient.",
      },
    ],

    listening: {
      title: "Train or car?",

      text:
        "Driving is more flexible, but travelling by train is often more relaxing. For long journeys, I usually prefer the train.",

      question:
        "Why does the speaker prefer trains for long journeys?",
    },

    speakingPrompt:
      "Compare studying online with studying in a classroom.",
  },

  {
    day: 35,

    title: "Explain Your Reasons",

    objective:
      "Build longer answers using reasons and results.",

    grammar: {
      title:
        "Because, since, therefore and so",

      explanation:
        "Use because and since for reasons, and therefore or so for results.",

      examples: [
        "I stayed home because I was tired.",
        "The weather was bad, so we cancelled the trip.",
        "It was expensive; therefore, I didn't buy it.",
      ],

      check: {
        question:
          "Complete: It was raining, ___ we stayed inside.",

        options: [
          "so",
          "although",
          "unless",
        ],

        answerIndex: 0,

        explanation:
          '"So" introduces the result.',
      },
    },

    vocabulary: [
      {
        word: "reason",
        meaning: "why something happens",
        example: "There are several reasons for my decision.",
      },
      {
        word: "result",
        meaning: "what happens because of something",
        example: "As a result, sales increased.",
      },
      {
        word: "therefore",
        meaning: "for that reason",
        example: "It was late; therefore, we went home.",
      },
    ],

    listening: {
      title: "Changing jobs",

      text:
        "I wanted more opportunities to learn, so I decided to change jobs. The new position is challenging, but I am developing many new skills.",

      question:
        "Why did the speaker change jobs?",
    },

    speakingPrompt:
      "Describe an important decision you made and explain the reasons behind it.",
  },

  // ==============================
  // MODULE 8 — ADVANCED CONVERSATION
  // ==============================

  {
    day: 36,

    title: "Discuss Social Issues",

    objective:
      "Discuss a broad issue using balanced arguments.",

    grammar: {
      title:
        "On the one hand / on the other hand",

      explanation:
        "Use these phrases to introduce two different sides of an argument.",

      examples: [
        "On the one hand, cars are convenient.",
        "On the other hand, they contribute to pollution.",
      ],

      check: {
        question:
          "Which phrase introduces a contrasting side of an argument?",

        options: [
          "On the other hand",
          "For example only",
          "At yesterday",
        ],

        answerIndex: 0,

        explanation:
          '"On the other hand" introduces an opposing perspective.',
      },
    },

    vocabulary: [
      {
        word: "impact",
        meaning: "a strong effect",
        example: "Technology has a major impact on society.",
      },
      {
        word: "society",
        meaning: "people living together in an organised community",
        example: "Education benefits society.",
      },
      {
        word: "challenge",
        meaning: "a difficult problem",
        example: "Pollution is a global challenge.",
      },
    ],

    listening: {
      title: "Cars in cities",

      text:
        "On the one hand, private cars are convenient. On the other hand, heavy traffic causes pollution and makes city centres less pleasant.",

      question:
        "What two problems are mentioned?",
    },

    speakingPrompt:
      "Should cities encourage people to use public transport instead of private cars?",
  },

  {
    day: 37,

    title: "Agree and Disagree Politely",

    objective:
      "Express disagreement without sounding rude.",

    grammar: {
      title:
        "Soft disagreement",

      explanation:
        "Use phrases such as I see your point, but... or I'm not sure I completely agree to soften disagreement.",

      examples: [
        "I see your point, but I think there is another issue.",
        "I'm not sure I completely agree.",
        "That's true to some extent, however...",
      ],

      check: {
        question:
          "Which phrase expresses polite disagreement?",

        options: [
          "You're completely wrong.",
          "I see your point, but I have a different view.",
          "No.",
        ],

        answerIndex: 1,

        explanation:
          "Acknowledging the other person's view softens disagreement.",
      },
    },

    vocabulary: [
      {
        word: "reasonable",
        meaning: "fair and sensible",
        example: "That seems like a reasonable argument.",
      },
      {
        word: "viewpoint",
        meaning: "a way of thinking about something",
        example: "I understand your viewpoint.",
      },
      {
        word: "partially",
        meaning: "not completely",
        example: "I partially agree.",
      },
    ],

    listening: {
      title: "Different views",

      text:
        "I understand why you prefer online classes, but I think face-to-face lessons provide better interaction. That's a fair point, although online learning is more flexible.",

      question:
        "What advantage of online learning is mentioned?",
    },

    speakingPrompt:
      "Respond politely to this statement: Social media does more harm than good.",
  },

  {
    day: 38,

    title: "Technology and Society",

    objective:
      "Discuss modern technology using more advanced vocabulary.",

    grammar: {
      title:
        "Present perfect for change",

      explanation:
        "The present perfect is useful when discussing changes from the past until now.",

      examples: [
        "Technology has changed communication.",
        "Online shopping has become more common.",
        "AI has created new opportunities.",
      ],

      check: {
        question:
          "Choose the correct sentence.",

        options: [
          "Technology has changed our lives.",
          "Technology have changed our lives.",
          "Technology has change our lives.",
        ],

        answerIndex: 0,

        explanation:
          "Use has + past participle with singular technology.",
      },
    },

    vocabulary: [
      {
        word: "innovation",
        meaning: "a new idea, method or technology",
        example: "AI is driving innovation.",
      },
      {
        word: "privacy",
        meaning: "the right to keep personal information protected",
        example: "Online privacy is important.",
      },
      {
        word: "automate",
        meaning: "to make a process work automatically",
        example: "Companies automate repetitive tasks.",
      },
    ],

    listening: {
      title: "Technology changes",

      text:
        "Technology has made communication faster and more convenient. However, it has also created new concerns about privacy and the way personal information is collected.",

      question:
        "What concern does the speaker mention?",
    },

    speakingPrompt:
      "How has technology changed everyday life? Discuss both benefits and problems.",
  },

  {
    day: 39,

    title: "Goals and the Future",

    objective:
      "Speak confidently about ambitions and long-term plans.",

    grammar: {
      title:
        "Hope to / would like to / aim to",

      explanation:
        "These structures are useful for describing goals and ambitions.",

      examples: [
        "I hope to improve my English.",
        "I'd like to travel more.",
        "I aim to build my own business.",
      ],

      check: {
        question:
          "Choose the correct structure.",

        options: [
          "I hope improve English.",
          "I hope to improve English.",
          "I hope improving to English.",
        ],

        answerIndex: 1,

        explanation:
          '"Hope" is commonly followed by to + verb.',
      },
    },

    vocabulary: [
      {
        word: "ambition",
        meaning: "a strong desire to achieve something",
        example: "My ambition is to become an engineer.",
      },
      {
        word: "achieve",
        meaning: "to successfully reach a goal",
        example: "I want to achieve my goals.",
      },
      {
        word: "progress",
        meaning: "development or improvement over time",
        example: "I have made good progress.",
      },
    ],

    listening: {
      title: "Future ambition",

      text:
        "Over the next five years, I hope to develop my professional skills and eventually start my own company. I know it will take time, but I am determined to achieve this goal.",

      question:
        "What is the speaker's long-term goal?",
    },

    speakingPrompt:
      "Describe where you hope to be five years from now and how you plan to reach your goals.",
  },

  {
    day: 40,

    title: "Final Course Review",

    objective:
      "Combine everything you have learned before your final speaking assessment.",

    grammar: {
      title:
        "Build complete answers",

      explanation:
        "Strong spoken answers include clear grammar, relevant vocabulary, connected ideas, reasons and examples.",

      examples: [
        "In my opinion, learning English is valuable because it creates more opportunities.",
        "One of my main goals is to become more confident when speaking.",
        "Over the last forty days, I have become more comfortable expressing my ideas.",
      ],

      check: {
        question:
          "Which answer is the most developed?",

        options: [
          "English is good.",
          "Yes, I like English.",
          "I enjoy learning English because it helps me communicate with more people and gives me access to new opportunities.",
        ],

        answerIndex: 2,

        explanation:
          "A developed answer contains an idea, reason and supporting detail.",
      },
    },

    vocabulary: [
      {
        word: "confidence",
        meaning: "belief in your own ability",
        example: "My speaking confidence has improved.",
      },
      {
        word: "improvement",
        meaning: "a change that makes something better",
        example: "I can see a clear improvement.",
      },
      {
        word: "achievement",
        meaning: "something successfully completed",
        example: "Finishing the course is a great achievement.",
      },
    ],

    listening: {
      title: "Course reflection",

      text:
        "Improving a language takes consistent practice. Small daily improvements may seem slow, but over time they build stronger vocabulary, better grammar and greater speaking confidence.",

      question:
        "What does the speaker say creates improvement over time?",
    },

    speakingPrompt:
      "Reflect on your English journey. Describe what has improved, what remains difficult, and what you want to achieve next.",
  },
];

function createVocabularyQuiz(
  vocabulary: LessonVocabulary[]
): LessonQuizQuestion[] {
  const first =
    vocabulary[0];

  const second =
    vocabulary[1];

  const third =
    vocabulary[2];

  return [
    {
      question:
        `What does "${first.word}" mean?`,

      options: [
        first.meaning,
        second.meaning,
        third.meaning,
      ],

      answerIndex: 0,

      explanation:
        `${first.word}: ${first.meaning}`,
    },

    {
      question:
        `Which sentence correctly uses "${second.word}"?`,

      options: [
        second.example,
        first.example,
        third.example,
      ],

      answerIndex: 0,

      explanation:
        `Example: ${second.example}`,
    },
  ];
}

export const everydayLessonContent:
  EverydayLessonContent[] =
  lessons.map(
    (lesson) => ({
      ...lesson,

      quiz: [
        lesson.grammar.check,

        ...createVocabularyQuiz(
          lesson.vocabulary
        ),
      ],
    })
  );

export function getEverydayLessonContent(
  day: number
) {
  return (
    everydayLessonContent.find(
      (lesson) =>
        lesson.day === day
    ) || null
  );
}