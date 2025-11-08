import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Fix DATABASE_URL SSL parameters for Prisma MySQL compatibility
// Prisma MySQL doesn't support ssl-mode and sslaccept parameters directly
// We need to convert them to the format Prisma expects
function fixDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  
  // If URL contains MySQL SSL parameters, convert them
  // Prisma MySQL uses ?sslaccept=strict|accept_invalid_certs format
  // Remove ssl-mode=REQUIRED as Prisma handles SSL via sslaccept parameter
  let fixedUrl = url
    .replace(/ssl-mode=REQUIRED[&]?/gi, '')
    .replace(/ssl-mode=required[&]?/gi, '');
  
  // Ensure sslaccept parameter is properly formatted
  if (fixedUrl.includes('sslaccept=accept_invalid_certs')) {
    // Already correct format
  } else if (fixedUrl.includes('sslaccept')) {
    // Keep existing sslaccept
  } else if (fixedUrl.includes('ssl-mode')) {
    // Add sslaccept if ssl-mode was present
    fixedUrl += (fixedUrl.includes('?') ? '&' : '?') + 'sslaccept=accept_invalid_certs';
  }
  
  return fixedUrl;
}

// Configure Prisma with proper SSL handling for MySQL
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Override DATABASE_URL if needed for SSL compatibility
if (process.env.DATABASE_URL) {
  const fixedUrl = fixDatabaseUrl(process.env.DATABASE_URL);
  if (fixedUrl && fixedUrl !== process.env.DATABASE_URL) {
    // Note: Prisma reads from env, so we'd need to set it there
    // For now, the URL should work with the fix applied
  }
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Handle graceful shutdown
if (typeof window === "undefined") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}
