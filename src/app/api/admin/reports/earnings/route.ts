import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requirePermission } from '@/lib/permissions/rbac';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function parseFee(val?: string | number): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val).toLowerCase().trim();
  if (str.endsWith('k')) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num * 1000;
  }
  const clean = str.replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

function extractYearAndMonth(dateStr: string): { year: string; month: string } {
  if (!dateStr) return { year: '', month: '' };
  const str = String(dateStr).trim();
  const match = str.match(/^(\d{4})[-/.](\d{1,2})/);
  if (match) {
    return {
      year: match[1],
      month: match[2].padStart(2, '0')
    };
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return {
      year: String(d.getFullYear()),
      month: String(d.getMonth() + 1).padStart(2, '0')
    };
  }
  return { year: '', month: '' };
}

export async function GET(req: NextRequest) {
  try {
    await requirePermission('bookings.view');
    const { searchParams } = new URL(req.url);
    const yearFilter = searchParams.get('year') || '';
    const monthFilter = searchParams.get('month') || '';

    const db = await getDatabase();

    // Fetch all bookings
    const bookings = await db.collection('bookings')
      .find({})
      .sort({ eventDate: -1, createdAt: -1 })
      .toArray();

    // Fetch all tour dates / events
    const events = await db.collection('events')
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();

    // Collect all unique years in the database for dropdown options
    const allUniqueYears = new Set<string>();
    for (const b of bookings) {
      const dateStr = b.eventDate || (b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '');
      const { year } = extractYearAndMonth(dateStr);
      if (year) allUniqueYears.add(year);
    }
    for (const ev of events) {
      const dateStr = ev.date || (ev.createdAt ? new Date(ev.createdAt).toISOString().split('T')[0] : '');
      const { year } = extractYearAndMonth(dateStr);
      if (year) allUniqueYears.add(year);
    }

    // Compile items from bookings
    const showItems: any[] = [];

    for (const b of bookings) {
      const fee = parseFee(b.budget);
      const retained = parseFee(b.retainedAmount);
      const dateStr = b.eventDate || (b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '');
      const { year, month } = extractYearAndMonth(dateStr);

      if (yearFilter && year !== yearFilter) {
        continue;
      }
      if (monthFilter && month !== monthFilter.padStart(2, '0')) {
        continue;
      }

      // If status is CONFIRMED, earnedAmount is the agreed fee
      // If status is CANCELLED, earnedAmount is any retained cancellation settlement / advance kept by band
      let earnedAmount = 0;
      if (b.status === 'CONFIRMED') {
        earnedAmount = fee;
      } else if (b.status === 'CANCELLED') {
        earnedAmount = retained;
      }

      showItems.push({
        id: b._id.toString(),
        source: 'booking',
        title: b.name || 'Concert Inquiry',
        organization: b.organization || 'Independent Organizer',
        date: dateStr,
        year,
        month,
        venue: b.venue || 'TBA',
        city: b.city || 'Dhaka',
        eventType: b.eventType || 'Live Concert',
        status: b.status || 'NEW',
        rawBudget: b.budget || '',
        retainedAmount: retained,
        cancellationReason: b.cancellationReason || '',
        earnedAmount,
        dealValue: fee,
        expectedAudience: b.expectedAudience || '',
        otherArtists: b.otherArtists || '',
        sponsors: b.sponsors || '',
        notesCount: Array.isArray(b.internalNotes) ? b.internalNotes.length : 0,
        createdAt: b.createdAt,
      });
    }

    // Merge in events if any have ticketPrice or financial data
    for (const ev of events) {
      const dateStr = ev.date || (ev.createdAt ? new Date(ev.createdAt).toISOString().split('T')[0] : '');
      const { year, month } = extractYearAndMonth(dateStr);

      if (yearFilter && year !== yearFilter) {
        continue;
      }
      if (monthFilter && month !== monthFilter.padStart(2, '0')) {
        continue;
      }

      // If this event was already represented by a booking title/venue on same date, avoid double count
      const alreadyIncluded = showItems.some(
        (s) => s.date === dateStr && s.venue.toLowerCase() === (ev.venue || '').toLowerCase()
      );

      if (!alreadyIncluded && (ev.ticketPrice || ev.estimatedRevenue || ev.honorarium)) {
        const fee = parseFee(ev.honorarium || ev.estimatedRevenue || ev.ticketPrice);
        showItems.push({
          id: ev._id.toString(),
          source: 'event',
          title: ev.title || 'Tour Performance',
          organization: ev.tourName || 'BIDDROHO Tour',
          date: dateStr,
          year,
          month,
          venue: ev.venue || 'TBA',
          city: ev.city || 'Dhaka',
          eventType: 'Official Tour Date',
          status: 'CONFIRMED',
          rawBudget: ev.honorarium || ev.ticketPrice || '',
          retainedAmount: 0,
          cancellationReason: '',
          earnedAmount: fee,
          dealValue: fee,
          expectedAudience: '',
          otherArtists: '',
          sponsors: '',
          notesCount: 0,
          createdAt: ev.createdAt,
        });
      }
    }

    // Compute aggregations
    let totalConfirmedEarnings = 0;
    let confirmedShowsCount = 0;
    let totalRetainedEarnings = 0;
    let pipelineVolume = 0;
    let pipelineCount = 0;
    let lostCancelledValue = 0;
    let cancelledCount = 0;

    for (const item of showItems) {
      if (item.status === 'CONFIRMED') {
        totalConfirmedEarnings += item.earnedAmount;
        confirmedShowsCount++;
      } else if (item.status === 'CANCELLED') {
        totalRetainedEarnings += item.retainedAmount || 0;
        const netLost = Math.max(0, item.dealValue - (item.retainedAmount || 0));
        lostCancelledValue += netLost;
        cancelledCount++;
      } else if (['NEW', 'CONTACTED', 'IN_PROGRESS'].includes(item.status)) {
        pipelineVolume += item.dealValue;
        pipelineCount++;
      }
    }

    const totalBandEarnings = totalConfirmedEarnings + totalRetainedEarnings;
    const averagePerShow = confirmedShowsCount > 0
      ? Math.round(totalConfirmedEarnings / confirmedShowsCount)
      : 0;

    // Available years for filtering
    const allYears = allUniqueYears.size > 0
      ? Array.from(allUniqueYears).sort().reverse()
      : ['2027', '2026', '2025'];

    return NextResponse.json({
      success: true,
      summary: {
        totalBandEarnings,
        totalConfirmedEarnings,
        totalRetainedEarnings,
        confirmedShowsCount,
        averagePerShow,
        pipelineVolume,
        pipelineCount,
        lostCancelledValue,
        cancelledCount,
        currency: 'BDT',
      },
      availableYears: allYears,
      shows: showItems,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error compiling show earnings report' },
      { status: err.status || 500 }
    );
  }
}
