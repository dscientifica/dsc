
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split(' ')[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { orgId } = decoded as any;
    if (!orgId) return NextResponse.json({ error: 'Missing orgId claim' }, { status: 403 });

    const snap = await adminDb.collection('orgs').doc(orgId).collection('laboratorios').get();
    const items = snap.docs.map(d=>({ id: d.id, ...d.data() }));
    return NextResponse.json(items);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
