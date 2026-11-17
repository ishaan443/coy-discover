import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function POST(request) {
  const { targetId, action } = await request.json();
  const db = readDB();

  if (db.swipes.some((s) => s.targetId === targetId)) {
    return NextResponse.json({ error: 'Already swiped' }, { status: 409 });
  }

  db.swipes.push({ targetId, action, timestamp: Date.now() });

  let isMatch = false;
  let matchedProfile = null;

  if (action === 'like') {
    const target = db.profiles.find((p) => p.id === targetId);
    if (target && target.likedUser) {
      isMatch = true;
      const { likedUser, ...publicProfile } = target;
      matchedProfile = publicProfile;
      db.matches.push(publicProfile);
    }
  }

  writeDB(db);
  return NextResponse.json({ success: true, match: isMatch, profile: matchedProfile });
}
