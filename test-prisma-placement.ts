// Quick test to verify AdPlacement model is accessible
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAdPlacementAccess() {
  try {
    // Test that adPlacement property exists and is accessible
    console.log('Testing AdPlacement access...')
    
    // Check if the property exists
    const hasAdPlacement = 'adPlacement' in prisma
    console.log('adPlacement property exists:', hasAdPlacement)
    
    // Try to access the model (this would throw if it doesn't exist)
    const placementModel = prisma.adPlacement
    console.log('adPlacement model type:', typeof placementModel)
    
    // Test a simple query to verify it works
    const placementCount = await prisma.adPlacement.count()
    console.log('Total placements:', placementCount)
    
    console.log('✅ AdPlacement model is properly accessible')
    return true
  } catch (error) {
    console.error('❌ Error accessing AdPlacement model:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

testAdPlacementAccess()