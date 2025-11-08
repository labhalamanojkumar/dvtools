import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch all enabled payment gateways (public endpoint for donation page)
export async function GET(request: NextRequest) {
  try {
    const gateways = await prisma.paymentGatewayConfig.findMany({
      where: { isEnabled: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        gateway: true,
        displayName: true,
        description: true,
        publicKey: true, // Only public keys are safe to expose
        supportedCurrencies: true,
      },
    })

    return NextResponse.json({ gateways })
  } catch (error) {
    console.error('Error fetching enabled payment gateways:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment gateways' },
      { status: 500 }
    )
  }
}
