import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { registerSchema } from "@/schemas/auth.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation =
      registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.error.issues[0]?.message ??
            "Invalid registration data",
        },
        {
          status: 400,
        }
      );
    }

    const {
      name,
      email,
      password,
    } = validation.data;

    await connectDb();

    const existingUser =
      await User.findOne({
        email,
      }).lean();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,

      authProviders: [
        "credentials",
      ],
    });

    return NextResponse.json(
      {
        success: true,

        message:
          "Account created successfully.",

        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "REGISTER_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while creating your account.",
      },
      {
        status: 500,
      }
    );
  }
}