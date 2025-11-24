
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { LaboratorioSchema } from '@/lib/schemas-labs';

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
    const payload = await req.json();
    const parsed = LaboratorioSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const now = new Date();
    const ref = await adminDb.collection('orgs').doc(orgId).collection('laboratorios').add({
      ...parsed.data,
      createdAt: now,
      updatedAt: now
    });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
