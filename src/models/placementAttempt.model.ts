import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type PlacementLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

type PlacementResponse = {
  question: string;

  transcript: string;

  fluencyScore: number;

  pronunciationScore: number;

  accuracyScore?: number;

  prosodyScore?: number;
};

export interface IPlacementAttempt
  extends Document {
  userId: mongoose.Types.ObjectId;

  responses: PlacementResponse[];

  grammarScore: number;

  vocabularyScore: number;

  communicationScore: number;

  fluencyScore: number;

  pronunciationScore: number;

  overallScore: number;

  cefrLevel: PlacementLevel;

  strengths: string[];

  improvements: string[];

  summary: string;

  createdAt: Date;

  updatedAt: Date;
}

const responseSchema =
  new Schema(
    {
      question: {
        type: String,

        required: true,
      },

      transcript: {
        type: String,

        required: true,
      },

      fluencyScore: {
        type: Number,

        default: 0,
      },

      pronunciationScore: {
        type: Number,

        default: 0,
      },

      accuracyScore:
        Number,

      prosodyScore:
        Number,
    },
    {
      _id: false,
    }
  );

const placementAttemptSchema =
  new Schema<IPlacementAttempt>(
    {
      userId: {
        type: Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      responses: {
        type: [
          responseSchema,
        ],

        required: true,
      },

      grammarScore: {
        type: Number,

        required: true,
      },

      vocabularyScore: {
        type: Number,

        required: true,
      },

      communicationScore: {
        type: Number,

        required: true,
      },

      fluencyScore: {
        type: Number,

        required: true,
      },

      pronunciationScore: {
        type: Number,

        required: true,
      },

      overallScore: {
        type: Number,

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

        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

placementAttemptSchema.index({
  userId: 1,

  createdAt: -1,
});

const PlacementAttempt: Model<IPlacementAttempt> =
  mongoose.models.PlacementAttempt ||
  mongoose.model<IPlacementAttempt>(
    "PlacementAttempt",
    placementAttemptSchema
  );

export default PlacementAttempt;