import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type LessonStatus =
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface ILessonProgress
  extends Document {
  userId: mongoose.Types.ObjectId;

  courseType: "EVERYDAY_ENGLISH";

  dayNumber: number;

  status: LessonStatus;

  score?: number;

  attempts: number;

  startedAt?: Date;
  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const lessonProgressSchema =
  new Schema<ILessonProgress>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      courseType: {
        type: String,
        enum: ["EVERYDAY_ENGLISH"],
        default: "EVERYDAY_ENGLISH",
      },

      dayNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 40,
      },

      status: {
        type: String,
        enum: [
          "AVAILABLE",
          "IN_PROGRESS",
          "COMPLETED",
        ],
        default: "AVAILABLE",
      },

      score: {
        type: Number,
        min: 0,
        max: 100,
      },

      attempts: {
        type: Number,
        default: 0,
      },

      startedAt: Date,

      completedAt: Date,
    },
    {
      timestamps: true,
    }
  );

lessonProgressSchema.index(
  {
    userId: 1,
    courseType: 1,
    dayNumber: 1,
  },
  {
    unique: true,
  }
);

const LessonProgress: Model<ILessonProgress> =
  mongoose.models.LessonProgress ||
  mongoose.model<ILessonProgress>(
    "LessonProgress",
    lessonProgressSchema
  );

export default LessonProgress;