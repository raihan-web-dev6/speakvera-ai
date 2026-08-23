import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type LearningGoal =
  | "EVERYDAY_ENGLISH"
  | "IELTS"
  | "PRONUNCIATION"
  | "FLUENCY"
  | "GRAMMAR"
  | "VOCABULARY"
  | "CONFIDENCE";

export type PreferredAccent =
  | "AMERICAN"
  | "BRITISH"
  | "AUSTRALIAN"
  | "NEUTRAL";

export type TargetLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

export interface IUserPreference
  extends Document {
  userId: mongoose.Types.ObjectId;

  goals: LearningGoal[];

  learningTarget: TargetLevel;

  dailyGoalMinutes: number;

  preferredAccent: PreferredAccent;

  nativeLanguage?: string;

  createdAt: Date;
  updatedAt: Date;
}

const userPreferenceSchema =
  new Schema<IUserPreference>(
    {
      userId: {
        type: Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true,

        index: true,
      },

      goals: {
        type: [String],

        enum: [
          "EVERYDAY_ENGLISH",
          "IELTS",
          "PRONUNCIATION",
          "FLUENCY",
          "GRAMMAR",
          "VOCABULARY",
          "CONFIDENCE",
        ],

        default: [
          "EVERYDAY_ENGLISH",
        ],
      },

      learningTarget: {
        type: String,

        enum: [
          "A1",
          "A2",
          "B1",
          "B2",
          "C1",
          "C2",
        ],

        default: "B2",
      },

      dailyGoalMinutes: {
        type: Number,

        min: 5,

        max: 120,

        default: 20,
      },

      preferredAccent: {
        type: String,

        enum: [
          "AMERICAN",
          "BRITISH",
          "AUSTRALIAN",
          "NEUTRAL",
        ],

        default: "NEUTRAL",
      },

      nativeLanguage: {
        type: String,

        trim: true,

        maxlength: 80,
      },
    },

    {
      timestamps: true,
    }
  );

const UserPreference: Model<IUserPreference> =
  mongoose.models.UserPreference ||
  mongoose.model<IUserPreference>(
    "UserPreference",
    userPreferenceSchema
  );

export default UserPreference;