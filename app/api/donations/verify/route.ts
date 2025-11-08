import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export const dynamic = 'force-dynamic';
import { PaymentService, initializePaymentGateways } from "@/lib/payment-service";
import { PaymentGateway } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const gateway = searchParams.get("gateway") as PaymentGateway | null;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!gateway) {
      return NextResponse.json(
        { error: "Payment gateway is required" },
        { status: 400 }
      );
    }

    // Initialize payment gateways
    await initializePaymentGateways();

    // Verify payment using the unified payment service
    const verification = await PaymentService.verifyPayment(gateway, {
      sessionId,
      gateway,
    });

    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error || "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update donation status in database
    const donation = await prisma.donation.updateMany({
      where: {
        gatewaySessionId: sessionId,
        paymentGateway: gateway,
      },
      data: {
        status: "COMPLETED",
        gatewayPaymentId: verification.paymentId,
        gatewayOrderId: verification.orderId,
      },
    });

    // Get the updated donation details
    const updatedDonation = await prisma.donation.findFirst({
      where: {
        gatewaySessionId: sessionId,
        paymentGateway: gateway,
      },
    });

    return NextResponse.json({
      success: true,
      amount: verification.amount || updatedDonation?.amount || 0,
      donorName: updatedDonation?.donorName || "Anonymous",
      donorEmail: updatedDonation?.donorEmail || "",
      gateway: gateway,
    });
  } catch (error: any) {
    console.error("Donation verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify donation" },
      { status: 500 }
    );
  }
}
