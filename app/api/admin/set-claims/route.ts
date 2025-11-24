
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-admin-token');
    if (!token || token !== process.env.ADMIN_CLAIMS_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { uid, orgId, roles } = body || {};
    if (!uid || !orgId || !Array.isArray(roles)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    await adminAuth.setCustomUserClaims(uid, { orgId, roles });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
