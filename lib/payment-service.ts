import Stripe from 'stripe'
import { PaymentGateway } from '@prisma/client'

export interface PaymentGatewayConfig {
  gateway: PaymentGateway
  isEnabled: boolean
  displayName: string
  publicKey?: string
  secretKey?: string
  merchantId?: string
  webhookSecret?: string
  additionalConfig?: any
}

export interface CreateCheckoutParams {
  amount: number
  currency: string
  donorName: string
  donorEmail: string
  tierId: string
  message?: string
  successUrl: string
  cancelUrl: string
}

export interface CheckoutSession {
  sessionId: string
  url: string
  gateway: PaymentGateway
}

export interface VerifyPaymentParams {
  sessionId: string
  gateway: PaymentGateway
}

export interface PaymentVerificationResult {
  success: boolean
  paymentId?: string
  orderId?: string
  amount?: number
  status?: string
  error?: string
}

/**
 * Stripe Payment Gateway Handler
 */
class StripePaymentService {
  private stripe: Stripe

  constructor(config: PaymentGatewayConfig) {
    if (!config.secretKey) {
      throw new Error('Stripe secret key is required')
    }
    this.stripe = new Stripe(config.secretKey)
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: `Donation - Tier ${params.tierId}`,
              description: params.message || 'Thank you for your support!',
            },
            unit_amount: Math.round(params.amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.donorEmail,
      metadata: {
        donorName: params.donorName,
        tierId: params.tierId,
        message: params.message || '',
      },
    })

    return {
      sessionId: session.id,
      url: session.url!,
      gateway: PaymentGateway.STRIPE,
    }
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(params.sessionId)

      return {
        success: session.payment_status === 'paid',
        paymentId: session.payment_intent as string,
        orderId: session.id,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        status: session.payment_status,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment',
      }
    }
  }
}

/**
 * PayPal Payment Gateway Handler
 */
class PayPalPaymentService {
  private clientId: string
  private clientSecret: string
  private baseUrl: string

  constructor(config: PaymentGatewayConfig) {
    if (!config.publicKey || !config.secretKey) {
      throw new Error('PayPal client ID and secret are required')
    }
    this.clientId = config.publicKey
    this.clientSecret = config.secretKey
    // Use sandbox for testing, production for live
    this.baseUrl = config.additionalConfig?.sandbox
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com'
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    const data = await response.json()
    return data.access_token
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession> {
    const accessToken = await this.getAccessToken()

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: params.currency.toUpperCase(),
              value: params.amount.toFixed(2),
            },
            description: `Donation - Tier ${params.tierId}`,
          },
        ],
        application_context: {
          return_url: params.successUrl,
          cancel_url: params.cancelUrl,
          brand_name: 'Multi Tool Platform',
          user_action: 'PAY_NOW',
        },
      }),
    })

    const order = await response.json()

    // Find approval URL
    const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href

    return {
      sessionId: order.id,
      url: approvalUrl || params.cancelUrl,
      gateway: PaymentGateway.PAYPAL,
    }
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${params.sessionId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      const order = await response.json()

      return {
        success: order.status === 'COMPLETED',
        paymentId: order.id,
        orderId: order.id,
        amount: parseFloat(order.purchase_units?.[0]?.amount?.value || '0'),
        status: order.status,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment',
      }
    }
  }
}

/**
 * DodoPay Payment Gateway Handler
 */
class DodoPayPaymentService {
  private apiKey: string
  private merchantId: string
  private baseUrl: string

  constructor(config: PaymentGatewayConfig) {
    if (!config.secretKey || !config.merchantId) {
      throw new Error('DodoPay API key and merchant ID are required')
    }
    this.apiKey = config.secretKey
    this.merchantId = config.merchantId
    // Use test environment for testing
    this.baseUrl = config.additionalConfig?.testMode
      ? 'https://test-api.dodopayments.com'
      : 'https://api.dodopayments.com'
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession> {
    const response = await fetch(`${this.baseUrl}/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        merchant_id: this.merchantId,
        amount: params.amount,
        currency: params.currency.toUpperCase(),
        customer_name: params.donorName,
        customer_email: params.donorEmail,
        description: `Donation - Tier ${params.tierId}`,
        return_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: {
          tierId: params.tierId,
          message: params.message,
        },
      }),
    })

    const payment = await response.json()

    return {
      sessionId: payment.payment_id || payment.id,
      url: payment.checkout_url || payment.payment_url,
      gateway: PaymentGateway.DODOPAYMENTS,
    }
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/payments/${params.sessionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      const payment = await response.json()

      return {
        success: payment.status === 'succeeded' || payment.status === 'completed',
        paymentId: payment.payment_id || payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        status: payment.status,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment',
      }
    }
  }
}

/**
 * Razorpay Payment Gateway Handler
 */
class RazorpayPaymentService {
  private keyId: string
  private keySecret: string
  private baseUrl: string

  constructor(config: PaymentGatewayConfig) {
    if (!config.publicKey || !config.secretKey) {
      throw new Error('Razorpay key ID and secret are required')
    }
    this.keyId = config.publicKey
    this.keySecret = config.secretKey
    this.baseUrl = 'https://api.razorpay.com/v1'
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSession> {
    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(params.amount * 100), // Convert to paise
        currency: params.currency.toUpperCase(),
        receipt: `receipt_${Date.now()}`,
        notes: {
          donorName: params.donorName,
          donorEmail: params.donorEmail,
          tierId: params.tierId,
          message: params.message,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Razorpay API error: ${response.status} ${response.statusText} - ${errorData}`)
    }

    const order = await response.json()

    if (order.error) {
      throw new Error(`Razorpay order creation failed: ${order.error.description}`)
    }

    // For Razorpay, we'll create a custom checkout page that uses the order
    // Since Razorpay doesn't provide hosted checkout like Stripe, we'll handle it on frontend
    const checkoutUrl = `${params.successUrl}?razorpay_order_id=${order.id}&amount=${params.amount}&currency=${params.currency}&key_id=${this.keyId}`

    return {
      sessionId: order.id,
      url: checkoutUrl,
      gateway: PaymentGateway.RAZORPAY,
    }
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult> {
    try {
      const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')

      const response = await fetch(`${this.baseUrl}/orders/${params.sessionId}`, {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      })

      if (!response.ok) {
        return {
          success: false,
          error: `Razorpay API error: ${response.status} ${response.statusText}`,
        }
      }

      const order = await response.json()

      if (order.error) {
        return {
          success: false,
          error: `Razorpay order error: ${order.error.description}`,
        }
      }

      return {
        success: order.status === 'paid',
        paymentId: order.id,
        orderId: order.id,
        amount: order.amount ? order.amount / 100 : 0,
        status: order.status,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment',
      }
    }
  }
}

/**
 * Main Payment Service Factory
 */
export class PaymentService {
  private static instances: Map<PaymentGateway, any> = new Map()

  static initialize(gateway: PaymentGateway, config: PaymentGatewayConfig): void {
    switch (gateway) {
      case PaymentGateway.STRIPE:
        this.instances.set(gateway, new StripePaymentService(config))
        break
      case PaymentGateway.PAYPAL:
        this.instances.set(gateway, new PayPalPaymentService(config))
        break
      case PaymentGateway.DODOPAYMENTS:
        this.instances.set(gateway, new DodoPayPaymentService(config))
        break
      case PaymentGateway.RAZORPAY:
        this.instances.set(gateway, new RazorpayPaymentService(config))
        break
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`)
    }
  }

  static getInstance(gateway: PaymentGateway): any {
    const instance = this.instances.get(gateway)
    if (!instance) {
      throw new Error(`Payment gateway ${gateway} is not initialized`)
    }
    return instance
  }

  static async createCheckout(
    gateway: PaymentGateway,
    params: CreateCheckoutParams
  ): Promise<CheckoutSession> {
    const service = this.getInstance(gateway)
    return service.createCheckout(params)
  }

  static async verifyPayment(
    gateway: PaymentGateway,
    params: VerifyPaymentParams
  ): Promise<PaymentVerificationResult> {
    const service = this.getInstance(gateway)
    return service.verifyPayment(params)
  }
}

/**
 * Helper function to load and initialize all enabled payment gateways
 */
export async function initializePaymentGateways() {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    const configs = await prisma.paymentGatewayConfig.findMany({
      where: { isEnabled: true },
    })

    for (const config of configs) {
      try {
        PaymentService.initialize(config.gateway, {
          gateway: config.gateway,
          isEnabled: config.isEnabled,
          displayName: config.displayName,
          publicKey: config.publicKey || undefined,
          secretKey: config.secretKey || undefined,
          merchantId: config.merchantId || undefined,
          webhookSecret: config.webhookSecret || undefined,
          additionalConfig: config.additionalConfig,
        })
        console.log(`✅ Initialized ${config.gateway} payment gateway`)
      } catch (error) {
        console.error(`❌ Failed to initialize ${config.gateway}:`, error)
      }
    }
  } catch (error) {
    console.error('Failed to load payment gateway configs:', error)
  } finally {
    await prisma.$disconnect()
  }
}
