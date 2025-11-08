/**
 * Additional seed data for realistic analytics
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdditionalSampleData() {
  console.log('Creating additional sample data for analytics...');

  try {
    // Create additional regular users
    const regularUsers = [];
    const userEmails = [
      'john.doe@example.com',
      'jane.smith@example.com',
      'mike.johnson@example.com',
      'sarah.wilson@example.com',
      'david.brown@example.com',
      'lisa.davis@example.com',
      'alex.martinez@example.com',
      'emma.garcia@example.com'
    ];

    for (let i = 0; i < userEmails.length; i++) {
      const user = await prisma.user.upsert({
        where: { email: userEmails[i] },
        update: {},
        create: {
          email: userEmails[i],
          name: `User ${i + 1}`,
          password: await bcrypt.hash('password123', 12),
          role: 'USER',
          status: 'ACTIVE',
          emailVerified: new Date(),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
          lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in last 7 days
        },
      });
      regularUsers.push(user);
      console.log(`✅ Created user: ${user.email}`);
    }

    // Get admin user for reference
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@devtools.com' }
    });

    // Create tool sessions for the past 7 days
    const toolTypes = [
      'JSON_FORMATTER',
      'BASE64_ENCODER', 
      'CODE_BEAUTIFIER',
      'URL_ENCODER',
      'JWT_DECODER',
      'REGEXP_TESTER',
      'COMPONENT_PLAYGROUND',
      'CSS_LINTER_OPTIMIZER',
      'THEME_BUILDER',
      'API_SIMULATOR'
    ];

    const allUsers = [adminUser, ...regularUsers];
    const totalSessions = 150;

    for (let i = 0; i < totalSessions; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomTool = toolTypes[Math.floor(Math.random() * toolTypes.length)];
      const sessionDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random date in last 7 days

      await prisma.toolSession.create({
        data: {
          userId: randomUser.id,
          toolType: randomTool,
          duration: Math.floor(Math.random() * 300) + 10, // 10-310 seconds
          success: Math.random() > 0.1, // 90% success rate
          createdAt: sessionDate,
        },
      });
    }

    console.log(`✅ Created ${totalSessions} tool sessions`);

    // Create some donations
    const donations = [
      { amount: 25.00, donorName: 'John Doe', donorEmail: 'john.doe@example.com' },
      { amount: 50.00, donorName: 'Jane Smith', donorEmail: 'jane.smith@example.com' },
      { amount: 15.00, donorName: 'Anonymous', donorEmail: 'anonymous@example.com' },
      { amount: 100.00, donorName: 'Mike Johnson', donorEmail: 'mike.johnson@example.com' },
      { amount: 30.00, donorName: 'Sarah Wilson', donorEmail: 'sarah.wilson@example.com' },
    ];

    for (const donation of donations) {
      await prisma.donation.create({
        data: {
          ...donation,
          tierId: 'free-tier',
          status: 'COMPLETED',
          paymentGateway: 'STRIPE',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
        },
      });
    }

    console.log(`✅ Created ${donations.length} donations`);

    // Create audit logs
    const auditActions = [
      'USER_LOGIN',
      'TOOL_USED', 
      'ANALYTICS_EVENT',
      'SETTING_CHANGED'
    ];

    const auditUsers = [adminUser, ...regularUsers.slice(0, 5)]; // Use first 6 users

    for (let i = 0; i < 200; i++) {
      const randomUser = auditUsers[Math.floor(Math.random() * auditUsers.length)];
      const randomAction = auditActions[Math.floor(Math.random() * auditActions.length)];
      const auditDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

      await prisma.auditLog.create({
        data: {
          userId: randomUser.id,
          action: randomAction,
          resource: 'analytics',
          createdAt: auditDate,
        },
      });
    }

    console.log('✅ Created 200 audit logs');

    // Create analytics events
    const eventTypes = ['PAGE_VIEW', 'TOOL_USAGE', 'USER_INTERACTION'];
    const eventNames = ['page_visit', 'tool_executed', 'button_click', 'form_submit'];

    for (let i = 0; i < 300; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomEventName = eventNames[Math.floor(Math.random() * eventNames.length)];
      const eventDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

      await prisma.analyticsEvent.create({
        data: {
          userId: randomUser.id,
          sessionId: `session_${i}`,
          eventType: randomEventType,
          eventName: randomEventName,
          timestamp: eventDate,
        },
      });
    }

    console.log('✅ Created 300 analytics events');

    console.log('🎉 Additional sample data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Total Users: ${allUsers.length + 1} (including admin)`);
    console.log(`- Tool Sessions: ${totalSessions}`);
    console.log(`- Donations: ${donations.length}`);
    console.log(`- Audit Logs: 200`);
    console.log(`- Analytics Events: 300`);

  } catch (error) {
    console.error('❌ Error creating additional sample data:', error);
    throw error;
  }
}

createAdditionalSampleData()
  .catch((e) => {
    console.error('❌ Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });