import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, toolUsed, feedbackType, feedback, rating } = body;

    // Validation
    if (!feedbackType || !feedback || !rating) {
      return NextResponse.json(
        { error: "Feedback type, message, and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Email validation if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
    }

    // Store in database
    const feedbackEntry = await prisma.feedback.create({
      data: {
        name: name || "Anonymous",
        email: email || null,
        toolUsed: toolUsed || null,
        feedbackType,
        feedback,
        rating,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        id: feedbackEntry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback form error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again later." },
      { status: 500 }
    );
  }
}
