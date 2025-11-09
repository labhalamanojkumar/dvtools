import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/payment-service'
import { PaymentGateway } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, donorName, donorEmail, tierId, message } = body

    // Validate required fields
    if (!amount || !currency || !donorName || !donorEmail || !tierId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Create checkout session
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin
    const session = await PaymentService.createCheckout(PaymentGateway.RAZORPAY, {
      amount,
      currency,
      donorName,
      donorEmail,
      tierId,
      message: message || '',
      successUrl: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/donate/cancel`,
    })

    return NextResponse.json({
      sessionId: session.sessionId,
      url: session.url,
      gateway: session.gateway,
      keyId: razorpayConfig.publicKey, // Include key ID for frontend Razorpay checkout
    })
  } catch (error) {
    console.error('Donation checkout error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
