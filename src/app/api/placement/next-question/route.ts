import {
  NextResponse,
} from "next/server";

import {
  gemini,
} from "@/lib/gemini";

export async function POST(
  request: Request
) {
  try {
    const {
      responses,
      questionNumber,
    } =
      await request.json();

    if (
      !Array.isArray(
        responses
      ) ||
      !responses.length
    ) {
      return NextResponse.json(
        {
          message:
            "Previous responses are required",
        },
        {
          status: 400,
        }
      );
    }

    const history =
      responses
        .map(
          (
            item: {
              question: string;

              transcript: string;

              fluencyScore:
                number;

              pronunciationScore:
                number;
            },
            index: number
          ) => `
Question ${index + 1}:
${item.question}

Answer:
${item.transcript}

Fluency:
${item.fluencyScore}/100

Pronunciation:
${item.pronunciationScore}/100
`
        )
        .join("\n");

    const prompt = `
You are Speakvera AI conducting a short English placement speaking test.

This will be question ${questionNumber} of 5.

Previous responses:

${history}

Generate ONE new speaking question.

Adapt the difficulty:

A1:
simple personal information.

A2:
daily routines and familiar experiences.

B1:
stories, explanations and simple opinions.

B2:
developed opinions and comparisons.

C1:
complex reasoning and abstract topics.

C2:
very advanced nuanced discussion.

Do not make the question dependent on specialist knowledge.

Do not repeat a previous question.

The candidate should be able to answer for approximately 30-75 seconds.

Return only valid JSON:

{
  "question": "...",
  "targetLevel": "A1"
}
`;

    const response =
      await gemini.models.generateContent(
        {
          model:
            "gemini-3.6-flash",

          contents:
            prompt,

          config: {
            responseMimeType:
              "application/json",

            temperature:
              0.3,
          },
        }
      );

    if (
      !response.text
    ) {
      throw new Error(
        "No question generated"
      );
    }

    const result =
      JSON.parse(
        response.text
      );

    return NextResponse.json({
      question:
        result.question,

      targetLevel:
        result.targetLevel ||
        "B1",
    });
  } catch (error) {
    console.error(
      "Placement next question:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not generate next question",
      },
      {
        status: 500,
      }
    );
  }
}