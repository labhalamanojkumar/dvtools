const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedPaymentGateways() {
  console.log('🌱 Seeding payment gateway configurations...')

  const gateways = [
    {
      gateway: 'STRIPE',
      displayName: 'Stripe',
      description: 'Secure payment processing with credit cards, digital wallets, and bank transfers',
      publicKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      supportedCurrencies: 'USD,EUR,GBP,AUD,CAD',
      displayOrder: 1,
      isEnabled: !!process.env.STRIPE_SECRET_KEY,
      additionalConfig: {
        testMode: !process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')
      }
    },
    {
      gateway: 'PAYPAL',
      displayName: 'PayPal',
      description: 'PayPal, Venmo, and credit card payments',
      publicKey: process.env.PAYPAL_CLIENT_ID || '',
      secretKey: process.env.PAYPAL_CLIENT_SECRET || '',
      supportedCurrencies: 'USD,EUR,GBP,AUD,CAD',
      displayOrder: 2,
      isEnabled: !!process.env.PAYPAL_CLIENT_SECRET,
      additionalConfig: {
        sandbox: process.env.PAYPAL_SANDBOX_MODE === 'true'
      }
    },
    {
      gateway: 'DODOPAYMENTS',
      displayName: 'Dodo Payments',
      description: 'Fast and secure payment processing for global transactions',
      secretKey: process.env.DODOPAY_API_KEY || '',
      merchantId: process.env.DODOPAY_MERCHANT_ID || '',
      supportedCurrencies: 'USD,EUR,GBP,AUD,CAD,INR',
      displayOrder: 3,
      isEnabled: !!process.env.DODOPAY_API_KEY,
      additionalConfig: {
        testMode: process.env.DODOPAY_TEST_MODE === 'true'
      }
    },
    {
      gateway: 'RAZORPAY',
      displayName: 'Razorpay',
      description: 'Popular payment gateway in India with global support',
      publicKey: process.env.RAZORPAY_KEY_ID || '',
      secretKey: process.env.RAZORPAY_KEY_SECRET || '',
      supportedCurrencies: 'INR,USD,EUR,GBP,AUD,CAD',
      displayOrder: 4,
      isEnabled: !!process.env.RAZORPAY_KEY_SECRET,
      additionalConfig: {
        region: 'india'
      }
    }
  ]

  for (const gateway of gateways) {
    try {
      await prisma.paymentGatewayConfig.upsert({
        where: { gateway: gateway.gateway },
        update: {
          isEnabled: gateway.isEnabled,
          displayName: gateway.displayName,
          description: gateway.description,
          publicKey: gateway.publicKey,
          secretKey: gateway.secretKey,
          merchantId: gateway.merchantId,
          webhookSecret: gateway.webhookSecret,
          additionalConfig: gateway.additionalConfig,
          displayOrder: gateway.displayOrder,
          supportedCurrencies: gateway.supportedCurrencies,
          updatedAt: new Date(),
        },
        create: gateway,
      })

      if (gateway.isEnabled) {
        console.log(`✅ ${gateway.displayName} payment gateway configured`)
      } else {
        console.log(`⚠️  ${gateway.displayName} payment gateway not configured (missing API keys)`)
      }
    } catch (error) {
      console.error(`❌ Failed to configure ${gateway.displayName}:`, error.message)
    }
  }

  console.log('🎉 Payment gateway seeding completed!')
}

async function seedDonationSettings() {
  console.log('🌱 Seeding donation settings...')

  try {
    await prisma.donationSettings.upsert({
      where: { id: 'default' },
      update: {
        minimumAmount: 1,
        enableDonations: true,
        thankYouMessage: 'Thank you for your generous donation! Your support helps us keep all 67+ tools free forever.',
        updatedAt: new Date(),
      },
      create: {
        id: 'default',
        minimumAmount: 1,
        enableDonations: true,
        thankYouMessage: 'Thank you for your generous donation! Your support helps us keep all 67+ tools free forever.',
      },
    })

    console.log('✅ Donation settings configured')
  } catch (error) {
    console.error('❌ Failed to configure donation settings:', error.message)
  }
}

async function main() {
  try {
    await seedPaymentGateways()
    await seedDonationSettings()
    console.log('🎉 All payment gateway configurations completed!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()