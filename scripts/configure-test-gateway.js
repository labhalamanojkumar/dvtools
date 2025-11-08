const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function configureTestGateway() {
  try {
    console.log('🔧 Configuring Stripe test gateway...');
    
    // Update Stripe configuration with test credentials
    // NOTE: Replace these with your actual Stripe test keys
    const stripe = await prisma.paymentGatewayConfig.update({
      where: { gateway: 'STRIPE' },
      data: {
        isEnabled: true,
        publicKey: 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz',
        secretKey: 'sk_test_51234567890abcdefghijklmnopqrstuvwxyz',
      },
    });

    console.log('✅ Stripe gateway configured and enabled');
    console.log('');
    console.log('⚠️  IMPORTANT: Replace the API keys with your actual Stripe test keys!');
    console.log('   Get your keys from: https://dashboard.stripe.com/test/apikeys');
    console.log('');
    console.log('📝 Current configuration:');
    console.log('   Gateway:', stripe.gateway);
    console.log('   Enabled:', stripe.isEnabled);
    console.log('   Has Public Key:', !!stripe.publicKey);
    console.log('   Has Secret Key:', !!stripe.secretKey);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

configureTestGateway();
