const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDB() {
  try {
    console.log('Checking payment gateway configurations...');
    const configs = await prisma.paymentGatewayConfig.findMany();
    console.log('Found configs:', configs.length);
    configs.forEach(config => {
      console.log(`Gateway: ${config.gateway}, Enabled: ${config.isEnabled}, Has Secret: ${!!config.secretKey}, Has Public: ${!!config.publicKey}`);
    });

    console.log('\nChecking donations...');
    const donations = await prisma.donation.findMany({ take: 5 });
    console.log('Found donations:', donations.length);

  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDB();