import {
  createHmac,
  timingSafeEqual,
} from "crypto";

function getSecret() {
  const secret =
    process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "AUTH_SECRET is missing"
    );
  }

  return secret;
}

export function createBillingSignature(
  userId: string
) {
  return createHmac(
    "sha256",
    getSecret()
  )
    .update(userId)
    .digest("hex");
}

export function verifyBillingSignature(
  userId: string,
  received: string
) {
  const expected =
    createBillingSignature(
      userId
    );

  const expectedBuffer =
    Buffer.from(expected);

  const receivedBuffer =
    Buffer.from(received);

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}