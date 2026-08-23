import {
  Environment,
  LogLevel,
  Paddle,
} from "@paddle/paddle-node-sdk";

let paddleInstance:
  | Paddle
  | null = null;

export function getPaddleServer() {
  if (paddleInstance) {
    return paddleInstance;
  }

  const apiKey =
    process.env.PADDLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "PADDLE_API_KEY is missing"
    );
  }

  const sandbox =
    process.env
      .PADDLE_ENVIRONMENT ===
    "sandbox";

  paddleInstance =
    new Paddle(apiKey, {
      environment: sandbox
        ? Environment.sandbox
        : Environment.production,

      logLevel:
        process.env.NODE_ENV ===
        "production"
          ? LogLevel.error
          : LogLevel.verbose,
    });

  return paddleInstance;
}