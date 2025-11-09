import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/payment-service'
import { PaymentGateway, PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      sessionId,
    } = body

    // Validate required fields
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Get Razorpay configuration from database
    const razorpayConfig = await prisma.paymentGatewayConfig.findFirst({
      where: {
        gateway: PaymentGateway.RAZORPAY,
        isEnabled: true,
      },
    })

    if (!razorpayConfig) {
      return NextResponse.json(
        { error: 'Razorpay payment gateway is not configured' },
        { status: 503 }
      )
    }

    // Initialize Razorpay payment service
    PaymentService.initialize(PaymentGateway.RAZORPAY, {
      gateway: razorpayConfig.gateway,
      isEnabled: razorpayConfig.isEnabled,
      displayName: razorpayConfig.displayName,
      publicKey: razorpayConfig.publicKey || undefined,
      secretKey: razorpayConfig.secretKey || undefined,
      merchantId: razorpayConfig.merchantId || undefined,
      webhookSecret: razorpayConfig.webhookSecret || undefined,
      additionalConfig: razorpayConfig.additionalConfig || undefined,
    })

    // Verify signature if provided (for Razorpay checkout completion)
    if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
      const keySecret = razorpayConfig.secretKey
      if (!keySecret) {
        return NextResponse.json(
          { error: 'Razorpay secret key not configured' },
          { status: 503 }
        )
      }

      // Verify signature: HMAC SHA256 of order_id|payment_id with secret
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { error: 'Invalid payment signature', success: false },
          { status: 400 }
        )
      }
    }

    // Verify payment status
    const verification = await PaymentService.verifyPayment(
      PaymentGateway.RAZORPAY,
      {
        sessionId,
        gateway: PaymentGateway.RAZORPAY,
      }
    )

    if (!verification.success) {
      return NextResponse.json(
        {
          success: false,
          error: verification.error || 'Payment verification failed',
        },
        { status: 400 }
      )
    }

    // Return successful verification
    return NextResponse.json({
      success: true,
      paymentId: verification.paymentId,
      orderId: verification.orderId,
      amount: verification.amount,
      status: verification.status,
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify payment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
