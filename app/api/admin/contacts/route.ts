import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get contacts with pagination
    const contacts = await prisma.contact.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Get total count for pagination
    const totalContacts = await prisma.contact.count({ where });

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total: totalContacts,
        pages: Math.ceil(totalContacts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// PATCH - Update contact status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { contactId, status, response } = body;

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    // Update contact
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        ...(status && { status }),
        ...(response && { 
          response,
          respondedAt: new Date(),
          respondedBy: session.user.email,
        }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      contact: updatedContact,
      message: "Contact updated successfully",
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}