import {
  initializePaddle,
  type Paddle,
} from "@paddle/paddle-js";

let paddlePromise:
  | Promise<
      Paddle | undefined
    >
  | null = null;

export function getPaddleClient() {
  const token =
    process.env
      .NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  if (!token) {
    throw new Error(
      "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is missing"
    );
  }

  if (!paddlePromise) {
    if (
      token.startsWith(
        "test_"
      )
    ) {
      paddlePromise =
        initializePaddle({
          token,

          environment:
            "sandbox",
        });
    } else {
      paddlePromise =
        initializePaddle({
          token,
        });
    }
  }

  return paddlePromise;
}