
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { EquipamentoSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split(' ')[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { orgId, roles } = decoded as any;

    if (!orgId) return NextResponse.json({ error: 'Missing orgId claim' }, { status: 403 });
    if (!roles || !roles.some((r: string) => ['admin', 'metrologista'].includes(r))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = EquipamentoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const now = new Date();
    const doc = {
      ...parsed.data,
      createdAt: now,
      updatedAt: now,
      proximaCalibracao: null,
      ultimaCalibracao: null,
    };

    const ref = await adminDb.collection('orgs').doc(orgId).collection('equipamentos').add(doc);
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
