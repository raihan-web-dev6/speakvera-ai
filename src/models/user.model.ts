import {
  Document,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

export type UserRole = "USER" | "ADMIN";

export type CEFRLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

export interface IUser extends Document {
  name: string;

  email: string;

  passwordHash?: string;

  image?: string;

  role: UserRole;

  currentLevel?: CEFRLevel;

  onboardingCompleted: boolean;

  xp: number;

  streak: number;

  lastPracticeAt?: Date;

  authProviders: string[];

  createdAt: Date;

  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    image: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    currentLevel: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      default: undefined,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    xp: {
      type: Number,
      default: 0,
      min: 0,
    },

    streak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastPracticeAt: {
      type: Date,
      default: undefined,
    },

    authProviders: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User =
  (models.User as Model<IUser>) ||
  model<IUser>("User", userSchema);

export default User;