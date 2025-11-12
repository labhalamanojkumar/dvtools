import { prisma } from '@/lib/db'

export async function getAdVendorVerificationTags() {
  try {
    const vendors = await prisma.adVendor.findMany({
      where: { isActive: true },
      select: { name: true, type: true, config: true }
    })

    return (vendors as Array<{ name: string; type: string; config: unknown }> )
      .map((v) => {
        const cfgRaw = v.config
        const cfg = (typeof cfgRaw === 'object' && cfgRaw !== null)
          ? (cfgRaw as Record<string, unknown>)
          : {}

        const code = (cfg['verificationCode'] ?? cfg['verification_code'] ?? cfg['code']) as string | undefined
        if (!code) return null
        return { name: v.name, type: v.type, code }
      })
      .filter(Boolean)
  } catch (error) {
    console.error('Error fetching ad vendor verification tags:', error)
    return []
  }
}
