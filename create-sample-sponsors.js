/**
 * Sample Sponsor Data Creator
 * Creates sample sponsor data for demonstration
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleSponsors = [
  {
    name: "TechCorp Solutions",
    email: "partnerships@techcorp.com",
    company: "TechCorp Solutions",
    website: "https://techcorp.com",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center",
    amount: 5000.00,
    tier: "Platinum",
    description: "Leading technology company specializing in AI and cloud solutions",
    message: "We believe in supporting innovative projects that make a difference.",
    isActive: true,
    isFeatured: true,
    displayOrder: 1,
    startDate: new Date(),
    endDate: null,
  },
  {
    name: "Global Innovations Inc",
    email: "social@globalinnovations.com",
    company: "Global Innovations Inc",
    website: "https://globalinnovations.com",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop&crop=center",
    amount: 2500.00,
    tier: "Gold",
    description: "Innovation-driven company focused on sustainable technology",
    message: "Supporting projects that drive positive change in our communities.",
    isActive: true,
    isFeatured: true,
    displayOrder: 2,
    startDate: new Date(),
    endDate: null,
  },
  {
    name: "StartupHub",
    email: "community@startuphub.co",
    company: "StartupHub",
    website: "https://startuphub.co",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&crop=center",
    amount: 1000.00,
    tier: "Gold",
    description: "Startup accelerator and community platform",
    message: "Helping build the next generation of innovative companies.",
    isActive: true,
    isFeatured: false,
    displayOrder: 3,
    startDate: new Date(),
    endDate: null,
  },
  {
    name: "Design Studio Pro",
    email: "hello@designstudiopro.com",
    company: "Design Studio Pro",
    website: "https://designstudiopro.com",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&fit=crop&crop=center",
    amount: 750.00,
    tier: "Silver",
    description: "Creative design agency specializing in digital experiences",
    message: "Supporting creative projects that inspire and engage.",
    isActive: true,
    isFeatured: false,
    displayOrder: 4,
    startDate: new Date(),
    endDate: null,
  },
  {
    name: "Green Energy Solutions",
    email: "contact@greenenergy.com",
    company: "Green Energy Solutions",
    website: "https://greenenergy.com",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=200&fit=crop&crop=center",
    amount: 500.00,
    tier: "Silver",
    description: "Renewable energy company committed to sustainability",
    message: "Powering a cleaner future through innovation and partnership.",
    isActive: true,
    isFeatured: true,
    displayOrder: 5,
    startDate: new Date(),
    endDate: null,
  },
  {
    name: "EduTech Partners",
    email: "partners@edutech.com",
    company: "EduTech Partners",
    website: "https://edutech.com",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center",
    amount: 300.00,
    tier: "Bronze",
    description: "Educational technology platform for modern learning",
    message: "Empowering education through technology and community support.",
    isActive: true,
    isFeatured: false,
    displayOrder: 6,
    startDate: new Date(),
    endDate: null,
  },
  {
    name: "CloudSync Technologies",
    email: "community@cloudsync.com",
    company: "CloudSync Technologies",
    website: "https://cloudsync.com",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop&crop=center",
    amount: 250.00,
    tier: "Bronze",
    description: "Cloud infrastructure and synchronization services",
    message: "Building the backbone of modern digital collaboration.",
    isActive: true,
    isFeatured: false,
    displayOrder: 7,
    startDate: new Date(),
    endDate: null,
  },
  {
    name: "John Smith",
    email: "john.smith@email.com",
    company: null,
    website: null,
    logo: null,
    amount: 199.00,
    tier: "Bronze",
    description: "Individual contributor and community supporter",
    message: "Happy to support this amazing project!",
    isActive: true,
    isFeatured: false,
    displayOrder: 8,
    startDate: new Date(),
    endDate: null,
  },
];

async function createSampleSponsors() {
  console.log("Creating sample sponsors...");
  
  try {
    // Clear existing sponsors
    await prisma.sponsor.deleteMany();
    console.log("Cleared existing sponsors");
    
    // Create sample sponsors
    for (const sponsorData of sampleSponsors) {
      const sponsor = await prisma.sponsor.create({
        data: sponsorData,
      });
      console.log(`Created sponsor: ${sponsor.name} (${sponsor.tier} - $${sponsor.amount})`);
    }
    
    // Verify creation
    const allSponsors = await prisma.sponsor.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    
    console.log(`\nTotal sponsors created: ${allSponsors.length}`);
    console.log("\nSponsors overview:");
    console.log("- Platinum:", allSponsors.filter(s => s.tier === "Platinum").length);
    console.log("- Gold:", allSponsors.filter(s => s.tier === "Gold").length);
    console.log("- Silver:", allSponsors.filter(s => s.tier === "Silver").length);
    console.log("- Bronze:", allSponsors.filter(s => s.tier === "Bronze").length);
    console.log("- Featured:", allSponsors.filter(s => s.isFeatured).length);
    console.log("- Total amount:", `$${allSponsors.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}`);
    
  } catch (error) {
    console.error("Error creating sample sponsors:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleSponsors();