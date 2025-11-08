/**
 * Database Seed Script for Production
 * This script seeds the database with initial data
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL || 'admin@devtools.com' },
      update: {},
      create: {
        email: process.env.ADMIN_EMAIL || 'admin@devtools.com',
        name: 'Administrator',
        password: hashedPassword,
        role: 'SUPERADMIN',
        status: 'ACTIVE',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Admin user created:', adminUser.email);

    // Create default payment gateway configurations
    const paymentGateways = [
      {
        gateway: 'STRIPE',
        isEnabled: false,
        displayName: 'Stripe',
        description: 'Accept credit cards and digital payments',
        displayOrder: 1,
        supportedCurrencies: 'USD,EUR,GBP,CAD,AUD',
      },
      {
        gateway: 'PAYPAL',
        isEnabled: false,
        displayName: 'PayPal',
        description: 'Accept PayPal payments',
        displayOrder: 2,
        supportedCurrencies: 'USD,EUR,GBP,CAD,AUD,JPY',
      },
      {
        gateway: 'DODOPAYMENTS',
        isEnabled: false,
        displayName: 'Dodo Payments',
        description: 'Multi-currency payment processing',
        displayOrder: 3,
        supportedCurrencies: 'USD,EUR,GBP,AED,SAR',
      },
      {
        gateway: 'RAZORPAY',
        isEnabled: false,
        displayName: 'Razorpay',
        description: 'Accept payments in India',
        displayOrder: 4,
        supportedCurrencies: 'INR,USD',
      },
    ];

    for (const gateway of paymentGateways) {
      await prisma.paymentGatewayConfig.upsert({
        where: { gateway: gateway.gateway },
        update: {},
        create: gateway,
      });
    }

    console.log('✅ Payment gateway configurations created');

    // Create default donation settings
    await prisma.donationSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        minimumAmount: 1.0,
        enableDonations: true,
        thankYouMessage: 'Thank you for your support! Your contribution helps us keep this tool free and accessible to everyone.',
      },
    });

    console.log('✅ Default donation settings created');

    // Create sample system metrics
    const systemMetrics = [
      { metricName: 'totalUsers', metricValue: 1 },
      { metricName: 'activeUsers', metricValue: 1 },
      { metricName: 'totalSessions', metricValue: 0 },
      { metricName: 'uptime', metricValue: 0 },
    ];

    for (const metric of systemMetrics) {
      await prisma.systemMetric.create({
        data: metric,
      });
    }

    console.log('✅ System metrics initialized');

    // Create sample tool configurations
    const toolTypes = [
      'JSON_FORMATTER',
      'BASE64_ENCODER',
      'CODE_BEAUTIFIER',
      'URL_ENCODER',
      'JWT_DECODER',
      'REGEXP_TESTER',
      'COMPONENT_PLAYGROUND',
      'CSS_LINTER_OPTIMIZER',
      'RESPONSIVE_DESIGN_TESTER',
      'IMAGE_OPTIMIZER_CONVERTER',
    ];

    for (const toolType of toolTypes) {
      await prisma.toolSession.create({
        data: {
          toolType,
          success: true,
          duration: 0,
        },
      });
    }

    console.log('✅ Sample tool sessions created');

    console.log('🎉 Database seed completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });