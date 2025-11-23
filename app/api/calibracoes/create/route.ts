
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { CalibracaoSchema } from '@/lib/validation';

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
    const { equipId, ...payload } = body;
    if (!equipId) return NextResponse.json({ error: 'Missing equipId' }, { status: 400 });

    const parsed = CalibracaoSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const now = new Date();
    const doc = { ...parsed.data, createdAt: now, updatedAt: now };

    const ref = await adminDb.collection('orgs').doc(orgId)
      .collection('equipamentos').doc(equipId)
      .collection('calibracoes').add(doc);

    // Atualiza próxima calibração se houver periodicidade
    const equipRef = adminDb.collection('orgs').doc(orgId).collection('equipamentos').doc(equipId);
    const equip = await equipRef.get();
    const data = equip.data();
    if (data && data.periodicidadeMeses && parsed.data.dataCalibracao) {
      const d = new Date(parsed.data.dataCalibracao);
      const proxima = new Date(d);
      proxima.setMonth(proxima.getMonth() + data.periodicidadeMeses);
      await equipRef.update({ ultimaCalibracao: d, proximaCalibracao: proxima, status: 'em_uso', updatedAt: new Date() });
    }

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
