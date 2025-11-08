import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PaymentGateway } from '@prisma/client'

// GET - Fetch all payment gateway configurations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPERADMIN access required' },
        { status: 401 }
      )
    }

    const gateways = await prisma.paymentGatewayConfig.findMany({
      orderBy: { displayOrder: 'asc' },
    })

    // Mask sensitive keys
    const maskedGateways = gateways.map(gateway => ({
      ...gateway,
      secretKey: gateway.secretKey ? '••••••••' : null,
      webhookSecret: gateway.webhookSecret ? '••••••••' : null,
    }))

    return NextResponse.json({ gateways: maskedGateways })
  } catch (error) {
    console.error('Error fetching payment gateways:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment gateways' },
      { status: 500 }
    )
  }
}

// POST - Create or update payment gateway configuration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPERADMIN access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      gateway,
      isEnabled,
      displayName,
      description,
      publicKey,
      secretKey,
      merchantId,
      webhookSecret,
      additionalConfig,
      displayOrder,
      supportedCurrencies,
    } = body

    // Validate required fields
    if (!gateway || !displayName) {
      return NextResponse.json(
        { error: 'Gateway and display name are required' },
        { status: 400 }
      )
    }

    // Check if gateway exists
    const existingGateway = await prisma.paymentGatewayConfig.findUnique({
      where: { gateway },
    })

    let result

    if (existingGateway) {
      // Update existing gateway
      result = await prisma.paymentGatewayConfig.update({
        where: { gateway },
        data: {
          isEnabled: isEnabled ?? existingGateway.isEnabled,
          displayName: displayName ?? existingGateway.displayName,
          description: description ?? existingGateway.description,
          publicKey: publicKey !== undefined ? publicKey : existingGateway.publicKey,
          secretKey: secretKey !== undefined ? secretKey : existingGateway.secretKey,
          merchantId: merchantId !== undefined ? merchantId : existingGateway.merchantId,
          webhookSecret: webhookSecret !== undefined ? webhookSecret : existingGateway.webhookSecret,
          additionalConfig: additionalConfig ?? existingGateway.additionalConfig,
          displayOrder: displayOrder ?? existingGateway.displayOrder,
          supportedCurrencies: supportedCurrencies ?? existingGateway.supportedCurrencies,
          updatedBy: session.user?.email || 'system',
        },
      })
    } else {
      // Create new gateway
      result = await prisma.paymentGatewayConfig.create({
        data: {
          gateway,
          isEnabled: isEnabled ?? false,
          displayName,
          description,
          publicKey,
          secretKey,
          merchantId,
          webhookSecret,
          additionalConfig,
          displayOrder: displayOrder ?? 0,
          supportedCurrencies,
          updatedBy: session.user?.email || 'system',
        },
      })
    }

    // Mask sensitive data in response
    return NextResponse.json({
      success: true,
      gateway: {
        ...result,
        secretKey: result.secretKey ? '••••••••' : null,
        webhookSecret: result.webhookSecret ? '••••••••' : null,
      },
    })
  } catch (error) {
    console.error('Error saving payment gateway:', error)
    return NextResponse.json(
      { error: 'Failed to save payment gateway configuration' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a payment gateway configuration
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPERADMIN access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const gateway = searchParams.get('gateway') as PaymentGateway

    if (!gateway) {
      return NextResponse.json(
        { error: 'Gateway parameter is required' },
        { status: 400 }
      )
    }

    await prisma.paymentGatewayConfig.delete({
      where: { gateway },
    })

    return NextResponse.json({
      success: true,
      message: 'Payment gateway deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting payment gateway:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment gateway' },
      { status: 500 }
    )
  }
}
