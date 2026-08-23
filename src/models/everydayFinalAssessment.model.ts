import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type FinalAssessmentCEFR =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

export type FinalAssessmentAnswer = {
  questionId: string;

  question: string;

  transcript: string;

  durationSeconds: number;

  deliveryScore: number;

  wordsPerMinute: number;

  speechConfidence: number;
};

export interface IEverydayFinalAssessment
  extends Document {
  userId:
    mongoose.Types.ObjectId;

  answers:
    FinalAssessmentAnswer[];

  grammarScore: number;

  vocabularyScore: number;

  communicationScore: number;

  deliveryScore: number;

  overallScore: number;

  cefrLevel:
    FinalAssessmentCEFR;

  passed: boolean;

  certificateEligible:
    boolean;

  strengths: string[];

  improvements: string[];

  summary: string;

  completedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

const answerSchema =
  new Schema(
    {
      questionId: {
        type: String,

        required: true,
      },

      question: {
        type: String,

        required: true,
      },

      transcript: {
        type: String,

        required: true,
      },

      durationSeconds: {
        type: Number,

        min: 0,

        default: 0,
      },

      deliveryScore: {
        type: Number,

        min: 0,

        max: 100,

        default: 0,
      },

      wordsPerMinute: {
        type: Number,

        min: 0,

        default: 0,
      },

      speechConfidence: {
        type: Number,

        min: 0,

        max: 100,

        default: 0,
      },
    },

    {
      _id: false,
    }
  );

const everydayFinalAssessmentSchema =
  new Schema<IEverydayFinalAssessment>(
    {
      userId: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      answers: {
        type: [
          answerSchema,
        ],

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

      deliveryScore: {
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

        required: true,

        default: false,
      },

      certificateEligible:
        {
          type: Boolean,

          required: true,

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

      summary: {
        type: String,

        default: "",
      },

      completedAt: {
        type: Date,

        default:
          Date.now,
      },
    },

    {
      timestamps: true,
    }
  );

everydayFinalAssessmentSchema.index(
  {
    userId: 1,

    createdAt: -1,
  }
);

const EverydayFinalAssessment: Model<IEverydayFinalAssessment> =
  mongoose.models
    .EverydayFinalAssessment ||
  mongoose.model<IEverydayFinalAssessment>(
    "EverydayFinalAssessment",

    everydayFinalAssessmentSchema
  );

export default EverydayFinalAssessment;