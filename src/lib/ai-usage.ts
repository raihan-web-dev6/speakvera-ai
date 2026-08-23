import {
  consumeAiRequest,
  refundAiRequest,
} from "@/lib/usage";

export async function runWithAiUsage<T>(
  userId: string,
  callback: () => Promise<T>
): Promise<T> {
  /*
   * Reserve BEFORE calling AI.
   *
   * If the limit is already reached,
   * consumeAiRequest() throws and
   * callback() never runs.
   */
  await consumeAiRequest(
    userId
  );

  try {
    return await callback();
  } catch (error) {
    /*
     * Gemini/server failed.
     *
     * Give the request back because
     * the learner did not receive
     * usable output.
     */
    try {
      await refundAiRequest(
        userId
      );
    } catch (
      refundError
    ) {
      console.error(
        "AI usage refund failed:",
        refundError
      );
    }

    throw error;
  }
}