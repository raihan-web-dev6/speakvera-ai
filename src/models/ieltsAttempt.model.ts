import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

type IeltsResponse = {
  part: 1 | 2 | 3;

  question: string;

  transcript: string;

  pronunciationScore?: number;
  fluencyScore?: number;
};

export interface IIeltsAttempt
  extends Document {
  userId: mongoose.Types.ObjectId;

  responses: IeltsResponse[];

  fluencyBand: number;

  lexicalBand: number;

  grammarBand: number;

  pronunciationBand: number;

  overallBand: number;

  strengths: string[];

  improvements: string[];

  feedback: {
    fluency: string;

    vocabulary: string;

    grammar: string;

    pronunciation: string;

    summary: string;
  };

  completedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const responseSchema =
  new Schema(
    {
      part: {
        type: Number,
        enum: [1, 2, 3],
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

      pronunciationScore:
        Number,

      fluencyScore: Number,
    },
    {
      _id: false,
    }
  );

const ieltsAttemptSchema =
  new Schema<IIeltsAttempt>(
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

      fluencyBand: {
        type: Number,

        min: 0,

        max: 9,

        required: true,
      },

      lexicalBand: {
        type: Number,

        min: 0,

        max: 9,

        required: true,
      },

      grammarBand: {
        type: Number,

        min: 0,

        max: 9,

        required: true,
      },

      pronunciationBand: {
        type: Number,

        min: 0,

        max: 9,

        required: true,
      },

      overallBand: {
        type: Number,

        min: 0,

        max: 9,

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

      feedback: {
        fluency: String,

        vocabulary: String,

        grammar: String,

        pronunciation:
          String,

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

ieltsAttemptSchema.index({
  userId: 1,

  createdAt: -1,
});

const IeltsAttempt: Model<IIeltsAttempt> =
  mongoose.models.IeltsAttempt ||
  mongoose.model<IIeltsAttempt>(
    "IeltsAttempt",

    ieltsAttemptSchema
  );

export default IeltsAttempt;