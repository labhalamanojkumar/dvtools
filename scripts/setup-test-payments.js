const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupTestPaymentGateway() {
  console.log('🔧 Setting up test payment gateway...');

  try {
    // Create a test Stripe configuration
    await prisma.paymentGatewayConfig.upsert({
      where: { gateway: 'STRIPE' },
      update: {
        isEnabled: true,
        displayName: 'Stripe (Test)',
        description: 'Secure payment processing with credit cards',
        publicKey: 'pk_test_dummy',
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_testing',
        webhookSecret: '',
        supportedCurrencies: 'USD,EUR,GBP',
        displayOrder: 1,
        additionalConfig: { testMode: true },
      },
      create: {
        gateway: 'STRIPE',
        isEnabled: true,
        displayName: 'Stripe (Test)',
        description: 'Secure payment processing with credit cards',
        publicKey: 'pk_test_dummy',
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_testing',
        supportedCurrencies: 'USD,EUR,GBP',
        displayOrder: 1,
        additionalConfig: { testMode: true },
      },
    });

    console.log('✅ Test payment gateway configured');

    // Verify configuration
    const config = await prisma.paymentGatewayConfig.findUnique({
      where: { gateway: 'STRIPE' },
    });

    console.log('Gateway config:', {
      gateway: config?.gateway,
      isEnabled: config?.isEnabled,
      hasSecretKey: !!config?.secretKey,
    });

    // Create donation settings if not exists
    await prisma.donationSettings.upsert({
      where: { id: 'default' },
      update: {
        minimumAmount: 1,
        enableDonations: true,
        thankYouMessage: 'Thank you for your donation!',
      },
      create: {
        id: 'default',
        minimumAmount: 1,
        enableDonations: true,
        thankYouMessage: 'Thank you for your donation!',
      },
    });

    console.log('✅ Donation settings configured');
    console.log('✅ Setup complete! You can now test donations.');
    console.log('\n⚠️  NOTE: This is using test/dummy credentials.');
    console.log('For production, set STRIPE_SECRET_KEY in your .env file.\n');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestPaymentGateway();
