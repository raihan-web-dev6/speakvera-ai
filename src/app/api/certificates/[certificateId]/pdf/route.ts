import {
  createElement,
} from "react";

import {
  renderToBuffer,
} from "@react-pdf/renderer";

import QRCode from "qrcode";

import {
  NextResponse,
} from "next/server";

import { auth } from "@/auth";

import connectDb from "@/lib/db";

import Certificate from "@/models/certificate.model";

import CertificateDocument from "@/components/certificates/CertificateDocument";

export const runtime =
  "nodejs";

type Props = {
  params: Promise<{
    certificateId: string;
  }>;
};

export async function GET(
  request: Request,
  {
    params,
  }: Props
) {
  try {
    const session =
      await auth();

    const userId = (
      session?.user as {
        id?: string;
      }
    )?.id;

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

    const {
      certificateId,
    } = await params;

    await connectDb();

    const certificate =
      await Certificate.findOne({
        _id: certificateId,

        userId,
      }).lean();

    if (!certificate) {
      return NextResponse.json(
        {
          message:
            "Certificate not found",
        },

        {
          status: 404,
        }
      );
    }

    const baseUrl =
      process.env
        .NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const verificationUrl =
      `${baseUrl}/verify/certificate/${certificate.certificateCode}`;

    const qrCodeDataUrl =
      await QRCode.toDataURL(
        verificationUrl,
        {
          width: 300,

          margin: 1,
        }
      );

    const document =
      createElement(
        CertificateDocument,
        {
          recipientName:
            certificate.recipientName,

          title:
            certificate.title,

          certificateCode:
            certificate.certificateCode,

          issuedAt:
            new Date(
              certificate.issuedAt
            ).toLocaleDateString(),

          cefrLevel:
            certificate.cefrLevel,

          score:
            certificate.score,

          qrCodeDataUrl,
        }
      );

    const buffer =
      await renderToBuffer(
        document
      );

    return new Response(
      new Uint8Array(
        buffer
      ),

      {
        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="${certificate.certificateCode}.pdf"`,

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

    return NextResponse.json(
      {
        message:
          "Could not generate PDF",
      },

      {
        status: 500,
      }
    );
  }
}