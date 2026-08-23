import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

import type {
  SpeakingFeedback,
} from "@/schemas/feedback.schema";

export type ReceiptCourseType =
  | "EVERYDAY_ENGLISH"
  | "IELTS"
  | "ASSESSMENT";

export type SpeakingReceiptPayload = {
  version: 1;

  receiptId: string;

  userId: string;

  courseType:
    ReceiptCourseType;

  lessonDay?:
    number;

  question:
    string;

  transcript:
    string;

  feedback:
    SpeakingFeedback;

  grammarScore:
    number;

  vocabularyScore:
    number;

  answerQualityScore:
    number;

  /*
   * Delivery is only a server
   * pace proxy.
   *
   * It is NOT pronunciation.
   */
  deliveryScore:
    number;

  speechConfidence:
    number;

  wordsPerMinute:
    number;

  billableDuration:
    number;

  /*
   * Trusted overall score.
   *
   * IMPORTANT:
   * Client/browser delivery data
   * is NOT included in this score.
   */
  overallScore:
    number;

  issuedAt:
    number;

  expiresAt:
    number;
};

type CreateReceiptInput =
  Omit<
    SpeakingReceiptPayload,
    | "version"
    | "receiptId"
    | "issuedAt"
    | "expiresAt"
  >;

export class SpeakingReceiptError
  extends Error {
  constructor(
    message:
      string
  ) {
    super(
      message
    );

    this.name =
      "SpeakingReceiptError";
  }
}

function getSecret() {
  const secret =
    process.env
      .SPEAKING_RECEIPT_SECRET ||
    process.env
      .AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "Missing speaking receipt secret"
    );
  }

  return secret;
}

function sign(
  encodedPayload:
    string
) {
  return createHmac(
    "sha256",
    getSecret()
  )
    .update(
      encodedPayload
    )
    .digest(
      "base64url"
    );
}

/*
 * =====================================================
 * CREATE
 * =====================================================
 */

export function createSpeakingReceipt(
  input:
    CreateReceiptInput
) {
  const now =
    Math.floor(
      Date.now() /
        1000
    );

  const payload:
    SpeakingReceiptPayload =
    {
      version:
        1,

      receiptId:
        randomUUID(),

      ...input,

      issuedAt:
        now,

      /*
       * User normally saves
       * immediately.
       *
       * 10 minutes is plenty.
       */
      expiresAt:
        now +
        10 * 60,
    };

  const encodedPayload =
    Buffer.from(
      JSON.stringify(
        payload
      )
    ).toString(
      "base64url"
    );

  const signature =
    sign(
      encodedPayload
    );

  return `${encodedPayload}.${signature}`;
}

/*
 * =====================================================
 * VERIFY
 * =====================================================
 */

export function verifySpeakingReceipt(
  receipt:
    string
): SpeakingReceiptPayload {
  if (
    !receipt ||
    receipt.length >
      50_000
  ) {
    throw new SpeakingReceiptError(
      "Invalid speaking receipt"
    );
  }

  const parts =
    receipt.split(
      "."
    );

  if (
    parts.length !==
    2
  ) {
    throw new SpeakingReceiptError(
      "Invalid speaking receipt"
    );
  }

  const [
    encodedPayload,
    providedSignature,
  ] = parts;

  const expectedSignature =
    sign(
      encodedPayload
    );

  const providedBuffer =
    Buffer.from(
      providedSignature
    );

  const expectedBuffer =
    Buffer.from(
      expectedSignature
    );

  if (
    providedBuffer.length !==
    expectedBuffer.length
  ) {
    throw new SpeakingReceiptError(
      "Invalid speaking receipt signature"
    );
  }

  const valid =
    timingSafeEqual(
      providedBuffer,
      expectedBuffer
    );

  if (!valid) {
    throw new SpeakingReceiptError(
      "Invalid speaking receipt signature"
    );
  }

  let payload:
    SpeakingReceiptPayload;

  try {
    payload =
      JSON.parse(
        Buffer.from(
          encodedPayload,
          "base64url"
        ).toString(
          "utf8"
        )
      );
  } catch {
    throw new SpeakingReceiptError(
      "Invalid speaking receipt payload"
    );
  }

  if (
    payload.version !==
      1 ||
    !payload.receiptId ||
    !payload.userId
  ) {
    throw new SpeakingReceiptError(
      "Invalid speaking receipt payload"
    );
  }

  const now =
    Math.floor(
      Date.now() /
        1000
    );

  if (
    payload.expiresAt <
    now
  ) {
    throw new SpeakingReceiptError(
      "Speaking receipt expired. Please record your answer again."
    );
  }

  /*
   * Reject impossible future
   * receipts too.
   */

  if (
    payload.issuedAt >
    now + 60
  ) {
    throw new SpeakingReceiptError(
      "Invalid speaking receipt time"
    );
  }

  return payload;
}