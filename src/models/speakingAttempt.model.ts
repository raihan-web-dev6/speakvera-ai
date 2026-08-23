import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type SpeakingCourseType =
  | "EVERYDAY_ENGLISH"
  | "IELTS"
  | "ASSESSMENT";

type GrammarMistake = {
  original: string;

  corrected: string;

  explanation: string;
};

type VocabularySuggestion = {
  original: string;

  better: string;

  reason: string;
};

export interface ISpeakingAttempt
  extends Document {
  userId:
    mongoose.Types.ObjectId;

  courseType:
    SpeakingCourseType;

  lessonDay?:
    number;

  question:
    string;

  transcript:
    string;

  improvedAnswer?:
    string;

  grammarScore:
    number;

  vocabularyScore:
    number;

  answerQualityScore:
    number;

  deliveryScore:
    number;

  fluencyScore:
    number;

  speechConfidence:
    number;

  wordsPerMinute:
    number;

  pronunciationScore:
    number;

  overallScore:
    number;

  feedback: {
    grammarMistakes:
      GrammarMistake[];

    vocabularySuggestions:
      VocabularySuggestion[];

    strengths:
      string[];

    improvements:
      string[];

    shortFeedback:
      string;
  };

  durationSeconds:
    number;

  /*
   * ===================================================
   * SECURITY
   * ===================================================
   */

  receiptId?:
    string;

  serverVerified:
    boolean;

  scoreSource:
    | "LEGACY"
    | "SERVER_AI";

  scoreVersion:
    string;

  createdAt:
    Date;

  updatedAt:
    Date;
}

const grammarMistakeSchema =
  new Schema(
    {
      original:
        String,

      corrected:
        String,

      explanation:
        String,
    },
    {
      _id:
        false,
    }
  );

const vocabularySuggestionSchema =
  new Schema(
    {
      original:
        String,

      better:
        String,

      reason:
        String,
    },
    {
      _id:
        false,
    }
  );

const speakingAttemptSchema =
  new Schema<ISpeakingAttempt>(
    {
      userId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,

        index:
          true,
      },

      courseType: {
        type:
          String,

        enum: [
          "EVERYDAY_ENGLISH",
          "IELTS",
          "ASSESSMENT",
        ],

        required:
          true,
      },

      lessonDay: {
        type:
          Number,

        min:
          1,

        max:
          40,
      },

      question: {
        type:
          String,

        required:
          true,
      },

      transcript: {
        type:
          String,

        required:
          true,
      },

      improvedAnswer: {
        type:
          String,

        default:
          "",
      },

      grammarScore: {
        type:
          Number,

        min:
          0,

        max:
          100,

        required:
          true,
      },

      vocabularyScore: {
        type:
          Number,

        min:
          0,

        max:
          100,

        required:
          true,
      },

      answerQualityScore: {
        type:
          Number,

        min:
          0,

        max:
          100,

        default:
          0,
      },

      deliveryScore: {
        type:
          Number,

        min:
          0,

        max:
          100,

        default:
          0,
      },

      /*
       * Legacy compatibility.
       *
       * Same server-generated
       * delivery proxy.
       */
      fluencyScore: {
        type:
          Number,

        min:
          0,

        max:
          100,

        default:
          0,
      },

      speechConfidence: {
        type:
          Number,

        min:
          0,

        max:
          100,

        default:
          0,
      },

      wordsPerMinute: {
        type:
          Number,

        min:
          0,

        max:
          240,

        default:
          0,
      },

      pronunciationScore: {
        type:
          Number,

        min:
          0,

        max:
          100,

        default:
          0,
      },

      overallScore: {
        type:
          Number,

        min:
          0,

        max:
          100,

        required:
          true,
      },

      feedback: {
        grammarMistakes: {
          type: [
            grammarMistakeSchema,
          ],

          default:
            [],
        },

        vocabularySuggestions: {
          type: [
            vocabularySuggestionSchema,
          ],

          default:
            [],
        },

        strengths: {
          type: [
            String,
          ],

          default:
            [],
        },

        improvements: {
          type: [
            String,
          ],

          default:
            [],
        },

        shortFeedback: {
          type:
            String,

          default:
            "",
        },
      },

      durationSeconds: {
        type:
          Number,

        min:
          0,

        max:
          300,

        default:
          0,
      },

      /*
       * =================================================
       * SECURITY
       * =================================================
       */

      receiptId: {
        type:
          String,

        trim:
          true,
      },

      serverVerified: {
        type:
          Boolean,

        default:
          false,

        index:
          true,
      },

      scoreSource: {
        type:
          String,

        enum: [
          "LEGACY",
          "SERVER_AI",
        ],

        default:
          "LEGACY",
      },

      scoreVersion: {
        type:
          String,

        default:
          "legacy",
      },
    },

    {
      timestamps:
        true,
    }
  );

/*
 * =====================================================
 * INDEXES
 * =====================================================
 */

speakingAttemptSchema.index({
  userId:
    1,

  createdAt:
    -1,
});

speakingAttemptSchema.index({
  userId:
    1,

  courseType:
    1,

  lessonDay:
    1,
});

/*
 * One signed receipt can produce
 * only one speaking attempt.
 *
 * sparse:true means old attempts
 * without receiptId are allowed.
 */

speakingAttemptSchema.index(
  {
    receiptId:
      1,
  },
  {
    unique:
      true,

    sparse:
      true,
  }
);

const SpeakingAttempt:
  Model<ISpeakingAttempt> =
  mongoose.models
    .SpeakingAttempt ||
  mongoose.model<ISpeakingAttempt>(
    "SpeakingAttempt",

    speakingAttemptSchema
  );

export default SpeakingAttempt;