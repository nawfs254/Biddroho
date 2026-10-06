import { NextResponse } from 'next/server';
import { getReleases } from '@/lib/dataService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const releases = await getReleases();
    return NextResponse.json({
      success: true,
      releases: releases || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error fetching releases' },
      { status: 500 }
    );
  }
}
