import {
  NextResponse,
} from "next/server";

import {
  placementStarterQuestions,
} from "@/data/placement-test/questions";

export async function GET() {
  return NextResponse.json({
    totalQuestions: 5,

    questions:
      placementStarterQuestions,
  });
}