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

    // Get donation settings
    let settings = await prisma.donationSettings.findFirst();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.donationSettings.create({
        data: {
          minimumAmount: 1,
          enableDonations: true,
          thankYouMessage: "Thank you for your donation!",
        },
      });
    }

    // Get Stripe configuration
    const stripeConfig = await prisma.paymentGatewayConfig.findUnique({
      where: { gateway: "STRIPE" },
    });

    return NextResponse.json({
      settings: {
        ...settings,
        stripePublishableKey: stripeConfig?.publicKey || "",
        stripeSecretKey: stripeConfig?.secretKey || "",
      },
    });
  } catch (error) {
    console.error("Error fetching donation settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      stripePublishableKey,
      stripeSecretKey,
      minimumAmount,
      enableDonations,
      thankYouMessage,
    } = body;

    // Update or create donation settings
    const settings = await prisma.donationSettings.upsert({
      where: { id: "default" },
      update: {
        minimumAmount: minimumAmount || 1,
        enableDonations: enableDonations !== undefined ? enableDonations : true,
        thankYouMessage,
        updatedBy: session.user.email,
      },
      create: {
        minimumAmount: minimumAmount || 1,
        enableDonations: enableDonations !== undefined ? enableDonations : true,
        thankYouMessage,
        updatedBy: session.user.email,
      },
    });

    // Update or create Stripe configuration
    if (stripePublishableKey !== undefined || stripeSecretKey !== undefined) {
      await prisma.paymentGatewayConfig.upsert({
        where: { gateway: "STRIPE" },
        update: {
          publicKey: stripePublishableKey !== undefined ? stripePublishableKey : undefined,
          secretKey: stripeSecretKey !== undefined ? stripeSecretKey : undefined,
          isEnabled: !!(stripePublishableKey && stripeSecretKey),
          updatedBy: session.user.email,
        },
        create: {
          gateway: "STRIPE",
          displayName: "Stripe",
          description: "Credit and debit card payments",
          publicKey: stripePublishableKey,
          secretKey: stripeSecretKey,
          isEnabled: !!(stripePublishableKey && stripeSecretKey),
          displayOrder: 1,
          updatedBy: session.user.email,
        },
      });
    }

    return NextResponse.json({
      settings,
      message: "Donation settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating donation settings:", error);
    return NextResponse.json(
      { error: "Failed to update donation settings" },
      { status: 500 }
    );
  }
}