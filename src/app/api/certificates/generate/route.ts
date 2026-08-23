import {
  randomBytes,
} from "crypto";

import mongoose from "mongoose";

import {
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import Certificate from "@/models/certificate.model";

import AssessmentAttempt from "@/models/assessmentAttempt.model";

import EverydayFinalAssessment from "@/models/everydayFinalAssessment.model";

import {
  canUseCertificates,
} from "@/lib/usage";

import {
  getEverydayCourseState,
} from "@/lib/everyday-course-progress";

function createCertificateCode() {
  const year =
    new Date()
      .getFullYear()
      .toString()
      .slice(-2);

  const random =
    randomBytes(4)
      .toString("hex")
      .toUpperCase();

  return `SV-${year}-${random}`;
}

export async function POST(
  request: Request
) {
  try {
    /*
     * Authentication
     */

    const session =
      await auth();

    const userId =
      session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Certificates are paid.
     */

    const certificateAccess =
      await canUseCertificates(
        userId
      );

    if (
      !certificateAccess
    ) {
      return NextResponse.json(
        {
          message:
            "A Pro or Premium plan is required to claim certificates.",
        },
        {
          status: 403,
        }
      );
    }

    const {
      type,
      sourceId,
    }: {
      type?: string;

      sourceId?: string;
    } =
      await request.json();

    if (!type) {
      return NextResponse.json(
        {
          message:
            "Certificate type is required",
        },
        {
          status: 400,
        }
      );
    }

    await connectDb();

    let title = "";

    let finalSourceId =
      sourceId || "";

    let cefrLevel:
      | string
      | undefined;

    let score:
      | number
      | undefined;

    /*
     * =================================================
     * GENERAL SPEAKING ASSESSMENT
     * =================================================
     */

    if (
      type ===
      "SPEAKING_ASSESSMENT"
    ) {
      if (!sourceId) {
        return NextResponse.json(
          {
            message:
              "Assessment ID is required",
          },
          {
            status: 400,
          }
        );
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          sourceId
        )
      ) {
        return NextResponse.json(
          {
            message:
              "Invalid assessment ID",
          },
          {
            status: 400,
          }
        );
      }

      const assessment =
        await AssessmentAttempt.findOne(
          {
            _id:
              sourceId,

            userId,

            certificateEligible:
              true,

            passed:
              true,
          }
        ).lean();

      if (!assessment) {
        return NextResponse.json(
          {
            message:
              "This assessment is not eligible for a certificate.",
          },
          {
            status: 403,
          }
        );
      }

      title =
        "English Speaking Assessment";

      cefrLevel =
        assessment.cefrLevel;

      score =
        assessment.overallScore;

      finalSourceId =
        sourceId;
    }

    /*
     * =================================================
     * EVERYDAY ENGLISH 40-DAY COURSE
     * =================================================
     */

    else if (
      type ===
      "EVERYDAY_ENGLISH"
    ) {
      /*
       * Verify all 40 sequential
       * lessons are actually
       * complete.
       */

      const courseState =
        await getEverydayCourseState(
          userId
        );

      if (
        !courseState.courseCompleted
      ) {
        return NextResponse.json(
          {
            message:
              "Complete all 40 course days before claiming this certificate.",
          },
          {
            status: 403,
          }
        );
      }

      /*
       * If the frontend supplied a
       * final assessment ID, use it.
       *
       * Otherwise use the latest
       * passing final assessment.
       */

      let finalAssessment;

      if (sourceId) {
        if (
          !mongoose.Types.ObjectId.isValid(
            sourceId
          )
        ) {
          return NextResponse.json(
            {
              message:
                "Invalid final assessment ID",
            },
            {
              status: 400,
            }
          );
        }

        finalAssessment =
          await EverydayFinalAssessment.findOne(
            {
              _id:
                sourceId,

              userId,

              passed:
                true,

              certificateEligible:
                true,
            }
          ).lean();
      } else {
        finalAssessment =
          await EverydayFinalAssessment.findOne(
            {
              userId,

              passed:
                true,

              certificateEligible:
                true,
            }
          )
            .sort({
              completedAt: -1,
            })
            .lean();
      }

      if (
        !finalAssessment
      ) {
        return NextResponse.json(
          {
            message:
              "Pass the Everyday English final assessment before claiming this certificate.",
          },
          {
            status: 403,
          }
        );
      }

      title =
        "40-Day Everyday English Speaking Course";

      cefrLevel =
        finalAssessment.cefrLevel;

      score =
        finalAssessment.overallScore;

      /*
       * Only one course certificate
       * per user.
       *
       * A retake will not generate
       * a second duplicate course
       * certificate.
       */

      finalSourceId =
        "everyday-english-40-day";
    } else {
      return NextResponse.json(
        {
          message:
            "Certificate type is not available yet.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =================================================
     * PREVENT DUPLICATE CERTIFICATE
     * =================================================
     */

    const existing =
      await Certificate.findOne({
        userId,

        type,

        sourceId:
          finalSourceId,
      });

    if (existing) {
      return NextResponse.json({
        certificateId:
          existing._id,

        certificateCode:
          existing.certificateCode,

        existing:
          true,
      });
    }

    /*
     * =================================================
     * GENERATE CERTIFICATE
     * =================================================
     */

    const certificate =
      await Certificate.create({
        userId,

        certificateCode:
          createCertificateCode(),

        type,

        title,

        recipientName:
          session.user?.name ||
          "Speakvera Learner",

        cefrLevel,

        score,

        sourceId:
          finalSourceId,

        status:
          "VALID",

        issuedAt:
          new Date(),
      });

    return NextResponse.json(
      {
        message:
          "Certificate generated",

        certificateId:
          certificate._id,

        certificateCode:
          certificate.certificateCode,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Certificate generation:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not generate certificate",
      },
      {
        status: 500,
      }
    );
  }
}