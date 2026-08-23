import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IDailyUsage
  extends Document {
  userId:
    mongoose.Types.ObjectId;

  /*
   * YYYY-MM-DD
   *
   * Currently UTC.
   */
  dayKey: string;

  speakingSeconds: number;

  aiRequests: number;

  ieltsAttempts: number;

  assessmentAttempts: number;

  createdAt: Date;

  updatedAt: Date;
}

const dailyUsageSchema =
  new Schema<IDailyUsage>(
    {
      userId: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      dayKey: {
        type: String,

        required: true,

        index: true,
      },

      speakingSeconds: {
        type: Number,

        default: 0,

        min: 0,
      },

      aiRequests: {
        type: Number,

        default: 0,

        min: 0,
      },

      ieltsAttempts: {
        type: Number,

        default: 0,

        min: 0,
      },

      assessmentAttempts: {
        type: Number,

        default: 0,

        min: 0,
      },
    },

    {
      timestamps: true,
    }
  );

/*
 * One usage document per
 * user per day.
 */
dailyUsageSchema.index(
  {
    userId: 1,

    dayKey: 1,
  },

  {
    unique: true,
  }
);

const DailyUsage: Model<IDailyUsage> =
  mongoose.models
    .DailyUsage ||
  mongoose.model<IDailyUsage>(
    "DailyUsage",

    dailyUsageSchema
  );

export default DailyUsage;