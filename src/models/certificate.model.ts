import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type CertificateType =
  | "EVERYDAY_ENGLISH"
  | "IELTS_PREPARATION"
  | "SPEAKING_ASSESSMENT";

export interface ICertificate
  extends Document {
  userId: mongoose.Types.ObjectId;

  certificateCode: string;

  type: CertificateType;

  title: string;

  recipientName: string;

  cefrLevel?: string;

  score?: number;

  sourceId: string;

  status:
    | "VALID"
    | "REVOKED";

  issuedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

const certificateSchema =
  new Schema<ICertificate>(
    {
      userId: {
        type: Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      certificateCode: {
        type: String,

        required: true,

        unique: true,

        index: true,
      },

      type: {
        type: String,

        enum: [
          "EVERYDAY_ENGLISH",
          "IELTS_PREPARATION",
          "SPEAKING_ASSESSMENT",
        ],

        required: true,
      },

      title: {
        type: String,

        required: true,
      },

      recipientName: {
        type: String,

        required: true,
      },

      cefrLevel: String,

      score: Number,

      sourceId: {
        type: String,

        required: true,
      },

      status: {
        type: String,

        enum: [
          "VALID",
          "REVOKED",
        ],

        default: "VALID",
      },

      issuedAt: {
        type: Date,

        default: Date.now,
      },
    },

    {
      timestamps: true,
    }
  );

certificateSchema.index(
  {
    userId: 1,

    type: 1,

    sourceId: 1,
  },

  {
    unique: true,
  }
);

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>(
    "Certificate",
    certificateSchema
  );

export default Certificate;