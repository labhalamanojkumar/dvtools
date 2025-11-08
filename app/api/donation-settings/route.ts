import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch donation settings
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.donationSettings.findUnique({
      where: { id: 'default' },
    })

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        settings: {
          minimumAmount: 1,
          enableDonations: true,
          thankYouMessage: "Thank you for your generous donation! Your support helps us keep all 67+ tools free forever.",
        },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching donation settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donation settings' },
      { status: 500 }
    )
  }
}