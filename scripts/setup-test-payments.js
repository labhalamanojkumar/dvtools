const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupTestPaymentGateway() {
  console.log('🔧 Setting up test payment gateway...');

  try {
    // Create a test Razorpay configuration
    await prisma.paymentGatewayConfig.upsert({
      where: { gateway: 'RAZORPAY' },
      update: {
        isEnabled: true,
        displayName: 'Razorpay (Test)',
        description: 'Popular payment gateway in India with global support',
        publicKey: 'rzp_test_dummy',
        secretKey: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_key_for_testing',
        supportedCurrencies: 'INR,USD,EUR,GBP,AUD,CAD',
        displayOrder: 1,
        additionalConfig: { region: 'india' },
      },
      create: {
        gateway: 'RAZORPAY',
        isEnabled: true,
        displayName: 'Razorpay (Test)',
        description: 'Popular payment gateway in India with global support',
        publicKey: 'rzp_test_dummy',
        secretKey: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_key_for_testing',
        supportedCurrencies: 'INR,USD,EUR,GBP,AUD,CAD',
        displayOrder: 1,
        additionalConfig: { region: 'india' },
      },
    });

    console.log('✅ Test payment gateway configured');

    // Verify configuration
    const config = await prisma.paymentGatewayConfig.findUnique({
      where: { gateway: 'RAZORPAY' },
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
    console.log('For production, set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.\n');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestPaymentGateway();
