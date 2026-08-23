import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type AssessmentCEFR =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

type AssessmentResponse = {
  question: string;

  transcript: string;

  pronunciationScore: number;

  fluencyScore: number;

  accuracyScore?: number;

  prosodyScore?: number;
};

export interface IAssessmentAttempt extends Document {
  userId: mongoose.Types.ObjectId;

  responses: AssessmentResponse[];

  grammarScore: number;

  vocabularyScore: number;

  communicationScore: number;

  fluencyScore: number;

  pronunciationScore: number;

  overallScore: number;

  cefrLevel: AssessmentCEFR;

  passed: boolean;

  certificateEligible: boolean;

  strengths: string[];

  improvements: string[];

  feedback: {
    grammar: string;

    vocabulary: string;

    communication: string;

    summary: string;
  };

  completedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

const responseSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },

    transcript: {
      type: String,
      required: true,
    },

    pronunciationScore: {
      type: Number,
      default: 0,
    },

    fluencyScore: {
      type: Number,
      default: 0,
    },

    accuracyScore: Number,

    prosodyScore: Number,
  },
  {
    _id: false,
  }
);

const assessmentAttemptSchema =
  new Schema<IAssessmentAttempt>(
    {
      userId: {
        type: Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      responses: {
        type: [responseSchema],

        required: true,
      },

      grammarScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },

      vocabularyScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },

      communicationScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },

      fluencyScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },

      pronunciationScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },

      overallScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },

      cefrLevel: {
        type: String,

        enum: [
          "A1",
          "A2",
          "B1",
          "B2",
          "C1",
          "C2",
        ],

        required: true,
      },

      passed: {
        type: Boolean,
        default: false,
      },

      certificateEligible: {
        type: Boolean,
        default: false,
      },

      strengths: {
        type: [String],
        default: [],
      },

      improvements: {
        type: [String],
        default: [],
      },

      feedback: {
        grammar: String,

        vocabulary: String,

        communication: String,

        summary: String,
      },

      completedAt: {
        type: Date,

        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

assessmentAttemptSchema.index({
  userId: 1,
  createdAt: -1,
});

const AssessmentAttempt: Model<IAssessmentAttempt> =
  mongoose.models.AssessmentAttempt ||
  mongoose.model<IAssessmentAttempt>(
    "AssessmentAttempt",
    assessmentAttemptSchema
  );

export default AssessmentAttempt;