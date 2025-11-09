const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function configureTestGateway() {
  try {
    console.log('🔧 Configuring Razorpay test gateway...');
    
    // Update Razorpay configuration with test credentials
    // NOTE: Replace these with your actual Razorpay test keys
    const razorpay = await prisma.paymentGatewayConfig.update({
      where: { gateway: 'RAZORPAY' },
      data: {
        isEnabled: true,
        publicKey: 'rzp_test_1234567890abcdefghij',
        secretKey: 'abcdefghijklmnopqrstuvwxyz123456',
      },
    });

    console.log('✅ Razorpay gateway configured and enabled');
    console.log('');
    console.log('⚠️  IMPORTANT: Replace the API keys with your actual Razorpay test keys!');
    console.log('   Get your keys from: https://dashboard.razorpay.com/app/keys');
    console.log('');
    console.log('📝 Current configuration:');
    console.log('   Gateway:', razorpay.gateway);
    console.log('   Enabled:', razorpay.isEnabled);
    console.log('   Has Public Key:', !!razorpay.publicKey);
    console.log('   Has Secret Key:', !!razorpay.secretKey);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

configureTestGateway();
