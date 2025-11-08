import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, category, message } = body;

    // Validation
    if (!name || !email || !subject || !category || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Store in database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        category,
        message,
        status: "PENDING",
      },
    });

    // TODO: Send email notification to admin
    // You can integrate with services like SendGrid, Resend, or Nodemailer

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        id: contact.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
