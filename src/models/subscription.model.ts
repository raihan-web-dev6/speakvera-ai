import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type SubscriptionPlan =
  | "FREE"
  | "PRO"
  | "PREMIUM";

export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "PAUSED"
  | "CANCELED";

export type BillingCycle =
  | "MONTHLY"
  | "YEARLY";

export interface ISubscription
  extends Document {
  userId: mongoose.Types.ObjectId;

  plan: SubscriptionPlan;

  status: SubscriptionStatus;

  billingCycle?: BillingCycle;

  paddleCustomerId?: string;

  paddleSubscriptionId?: string;

  priceId?: string;

  currentPeriodStart?: Date;

  currentPeriodEnd?: Date;

  trialStart?: Date;

  trialEnd?: Date;

  cancelAtPeriodEnd: boolean;

  lastPaddleEventId?: string;

  lastEventAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const subscriptionSchema =
  new Schema<ISubscription>(
    {
      userId: {
        type: Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true,

        index: true,
      },

      plan: {
        type: String,

        enum: [
          "FREE",
          "PRO",
          "PREMIUM",
        ],

        default: "FREE",
      },

      status: {
        type: String,

        enum: [
          "ACTIVE",
          "TRIALING",
          "PAST_DUE",
          "PAUSED",
          "CANCELED",
        ],

        default: "ACTIVE",
      },

      billingCycle: {
        type: String,

        enum: [
          "MONTHLY",
          "YEARLY",
        ],
      },

      paddleCustomerId: {
        type: String,

        sparse: true,
      },

      paddleSubscriptionId: {
        type: String,

        sparse: true,

        unique: true,
      },

      priceId: String,

      currentPeriodStart: Date,

      currentPeriodEnd: Date,

      trialStart: Date,

      trialEnd: Date,

      cancelAtPeriodEnd: {
        type: Boolean,

        default: false,
      },

      lastPaddleEventId: String,

      lastEventAt: Date,
    },

    {
      timestamps: true,
    }
  );

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>(
    "Subscription",
    subscriptionSchema
  );

export default Subscription;