#!/bin/bash
# Fix the donation checkout route

cat > "/Users/manojkumar/Desktop/Work flow/Dvtools/app/api/donations/create-checkout/route.ts" << 'ENDOFFILE'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PaymentGateway } from '@prisma/client'
import { PaymentService, CreateCheckoutParams } from '@/lib/payment-service'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting donation checkout process...')
    
    // Get session (optional for donations)
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    console.log('📦 Request data:', {
      amount: body.amount,
      currency: body.currency,
      gateway: body.gateway,
      donorName: body.donorName,
      donorEmail: body.donorEmail,
      hasSession: !!session,
    })

    const {
      amount,
      currency = 'INR',
      gateway = PaymentGateway.STRIPE,
      donorName,
      donorEmail,
      message,
      tierId,
      isRecurring = false,
      campaignId,
      pageId,
    } = body

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    if (!donorEmail) {
      return NextResponse.json(
        { error: 'Donor email is required' },
        { status: 400 }
      )
    }

    // Get payment gateway configuration from admin panel
    console.log('💳 Fetching gateway configuration from database...')
    const gatewayConfig = await prisma.paymentGatewayConfig.findUnique({
      where: { gateway },
    })
    
    console.log('💳 Gateway config status:', {
      gateway,
      configFound: !!gatewayConfig,
      isEnabled: gatewayConfig?.isEnabled,
      hasSecretKey: !!gatewayConfig?.secretKey,
      hasPublicKey: !!gatewayConfig?.publicKey,
    })

    if (!gatewayConfig) {
      return NextResponse.json(
        { 
          error: `${gateway} payment gateway is not configured`,
          message: 'Please configure this payment gateway in the admin panel at /admin/payment-gateways',
          details: 'Gateway configuration not found in database'
        },
        { status: 400 }
      )
    }

    if (!gatewayConfig.isEnabled) {
      return NextResponse.json(
        { 
          error: `${gateway} payment gateway is currently disabled`,
          message: 'Please enable this payment gateway in the admin panel',
          details: 'Gateway exists but is disabled'
        },
        { status: 400 }
      )
    }

    if (!gatewayConfig.secretKey) {
      return NextResponse.json(
        { 
          error: `${gateway} payment gateway is not properly configured`,
          message: 'Missing API credentials. Please add your API keys in the admin panel',
          details: 'Secret key is required but not configured'
        },
        { status: 400 }
      )
    }

    // Initialize payment service with admin-configured credentials
    console.log('🔧 Initializing payment service for gateway:', gateway)
    
    try {
      PaymentService.initialize(gateway, {
        gateway: gatewayConfig.gateway,
        isEnabled: gatewayConfig.isEnabled,
        displayName: gatewayConfig.displayName,
        publicKey: gatewayConfig.publicKey || undefined,
        secretKey: gatewayConfig.secretKey,
        merchantId: gatewayConfig.merchantId || undefined,
        webhookSecret: gatewayConfig.webhookSecret || undefined,
        additionalConfig: gatewayConfig.additionalConfig,
      })
      
      console.log('✅ Payment service initialized successfully')
    } catch (initError) {
      console.error('❌ Payment service initialization failed:', initError)
      return NextResponse.json(
        { 
          error: 'Failed to initialize payment gateway',
          message: initError instanceof Error ? initError.message : 'Unknown initialization error',
          details: 'Payment service could not be initialized with provided credentials'
        },
        { status: 500 }
      )
    }

    // Determine base URL
    const baseUrl = 
      process.env.NEXT_PUBLIC_APP_URL || 
      process.env.NEXT_PUBLIC_BASE_URL ||
      `http://localhost:${process.env.PORT || 3000}`
    
    console.log('🌐 Base URL:', baseUrl)

    // Generate default tier ID if not provided
    const donationTierId = tierId || `tier_${Date.now()}`

    // Create checkout session
    console.log('🛒 Creating checkout session...')
    
    const checkoutParams: CreateCheckoutParams = {
      amount,
      currency,
      donorName: donorName || 'Anonymous',
      donorEmail,
      tierId: donationTierId,
      message: message || '',
      successUrl: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/donate/cancel`,
    }
    
    console.log('📋 Checkout params:', {
      ...checkoutParams,
      successUrl: checkoutParams.successUrl.replace('{CHECKOUT_SESSION_ID}', 'PLACEHOLDER'),
    })

    let checkoutSession
    try {
      checkoutSession = await PaymentService.createCheckout(gateway, checkoutParams)
      console.log('✅ Checkout session created:', {
        sessionId: checkoutSession.sessionId,
        gateway: checkoutSession.gateway,
        hasUrl: !!checkoutSession.url,
      })
    } catch (checkoutError) {
      console.error('❌ Failed to create checkout session:', checkoutError)
      return NextResponse.json(
        { 
          error: 'Failed to create checkout session',
          message: checkoutError instanceof Error ? checkoutError.message : 'Unknown checkout error',
          details: 'Payment gateway rejected the checkout request'
        },
        { status: 500 }
      )
    }

    // Create donation record
    console.log('💾 Creating donation record in database...')
    
    try {
      const donation = await prisma.donation.create({
        data: {
          amount,
          donorName: donorName || 'Anonymous',
          donorEmail,
          tierId: donationTierId,
          message: message || null,
          paymentGateway: gateway,
          gatewaySessionId: checkoutSession.sessionId,
          status: 'PENDING',
          campaignId: campaignId || null,
          paymentPageId: pageId || null,
        },
      })
      
      console.log('✅ Donation record created:', { id: donation.id, status: donation.status })
      
      return NextResponse.json({
        success: true,
        sessionId: checkoutSession.sessionId,
        url: checkoutSession.url,
        gateway: checkoutSession.gateway,
        donationId: donation.id,
      })
    } catch (dbError) {
      console.error('❌ Failed to create donation record:', dbError)
      
      // Checkout session was created but database failed
      // Return the checkout URL anyway so user can complete payment
      return NextResponse.json({
        success: true,
        sessionId: checkoutSession.sessionId,
        url: checkoutSession.url,
        gateway: checkoutSession.gateway,
        warning: 'Payment session created but database record failed. Payment can still be completed.',
      })
    }
  } catch (error) {
    console.error('❌ Unexpected error in donation checkout:', error)
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined,
      },
      { status: 500 }
    )
  }
}
ENDOFFILE

echo "✅ Donation checkout route fixed!"
