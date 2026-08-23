import React from "react";

import mongoose from "mongoose";

import QRCode from "qrcode";

import {
  renderToBuffer,
} from "@react-pdf/renderer";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import Certificate from "@/models/certificate.model";

import CertificatePdfDocument from "@/components/certificates/CertificatePdfDocument";

/*
 * react-pdf server rendering
 * uses its Node API.
 */

export const runtime =
  "nodejs";

type Context = {
  params: Promise<{
    certificateId:
      string;
  }>;
};

export async function GET(
  request: Request,
  context: Context
) {
  try {
    const {
      certificateId,
    } =
      await context.params;

    /*
     * Authentication
     */

    const session =
      await auth();

    const userId =
      session?.user?.id;

    if (!userId) {
      return Response.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        certificateId
      )
    ) {
      return Response.json(
        {
          message:
            "Invalid certificate ID",
        },
        {
          status: 400,
        }
      );
    }

    await connectDb();

    /*
     * Owner-only PDF download.
     */

    const certificate =
      await Certificate.findOne({
        _id:
          certificateId,

        userId,
      });

    if (!certificate) {
      return Response.json(
        {
          message:
            "Certificate not found",
        },
        {
          status: 404,
        }
      );
    }

    const appUrl =
      (
        process.env
          .NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000"
      ).replace(
        /\/$/,
        ""
      );

    const verificationUrl =
      `${appUrl}/verify/certificate/${certificate.certificateCode}`;

    const qrDataUrl =
      await QRCode.toDataURL(
        verificationUrl,
        {
          width:
            300,

          margin:
            1,
        }
      );

    const issuedDate =
      new Date(
        certificate.issuedAt
      ).toLocaleDateString(
        "en-US",
        {
          year:
            "numeric",

          month:
            "long",

          day:
            "numeric",
        }
      );

    const document =
      React.createElement(
        CertificatePdfDocument,
        {
          certificateCode:
            certificate.certificateCode,

          recipientName:
            certificate.recipientName,

          title:
            certificate.title,

          cefrLevel:
            certificate.cefrLevel,

          score:
            certificate.score,

          issuedAt:
            issuedDate,

          verificationUrl,

          qrDataUrl,
        }
      );

    const pdfBuffer =
      await renderToBuffer(
        document
      );

    /*
     * Convert Node Buffer to a
     * Uint8Array for the Web
     * Response body.
     */

    const pdf =
      new Uint8Array(
        pdfBuffer
      );

    return new Response(
      pdf,
      {
        status:
          200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="Speakvera-${certificate.certificateCode}.pdf"`,

          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Certificate PDF:",
      error
    );

    return Response.json(
      {
        message:
          "Could not generate certificate PDF",
      },
      {
        status: 500,
      }
    );
  }
}