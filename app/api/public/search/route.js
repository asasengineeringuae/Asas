import {NextResponse} from 'next/server';
import {searchSiteLive} from '@/lib/search/site-index';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const q = new URL(request.url).searchParams.get('q') || '';
    const results = await searchSiteLive(q, {limit: 12});
    return NextResponse.json({results});
  } catch (error) {
    return NextResponse.json({error: error.message || 'Search failed', results: []}, {status: 500});
  }
}
