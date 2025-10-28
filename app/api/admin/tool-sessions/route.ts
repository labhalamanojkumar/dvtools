import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type'); // 'recent' or 'chart'

    if (type === 'chart') {
      // For usage chart - group by date and tool type
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sessions = await prisma.toolSession.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          toolType: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Group by date and tool type
      const chartData = sessions.reduce((acc, session) => {
        const date = session.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {};
        }
        acc[date][session.toolType] = (acc[date][session.toolType] || 0) + 1;
        return acc;
      }, {} as Record<string, Record<string, number>>);

      // Convert to array format for chart
      const result = Object.entries(chartData).map(([date, tools]) => ({
        date,
        ...tools,
      }));

      return NextResponse.json(result);
    }

    // Default: recent sessions
    const sessions = await prisma.toolSession.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching tool sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tool sessions' },
      { status: 500 }
    );
  }
}