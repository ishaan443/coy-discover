import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const swipedIds = new Set(db.swipes.map((s) => s.targetId));

  const unseenProfiles = db.profiles
    .filter((p) => !swipedIds.has(p.id))
    .map(({ likedUser, ...publicProfile }) => publicProfile);

  return NextResponse.json({ profiles: unseenProfiles });
}
