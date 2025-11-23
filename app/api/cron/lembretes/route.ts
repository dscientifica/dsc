
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const limite = new Date();
  limite.setDate(now.getDate() + 30);

  const orgsSnap = await adminDb.collection('orgs').get();
  const avisos: any[] = [];

  for (const orgDoc of orgsSnap.docs) {
    const orgId = orgDoc.id;
    const equips = await adminDb.collection('orgs').doc(orgId).collection('equipamentos').get();
    for (const eq of equips.docs) {
      const data = eq.data() as any;
      const proxVal = data.proximaCalibracao;
      if (proxVal) {
        const prox = proxVal.toDate ? proxVal.toDate() : new Date(proxVal);
        if (prox <= limite) {
          avisos.push({ orgId, equipId: eq.id, tag: data.tag, proxima: prox });
        }
      }
    }
  }

  console.log('Avisos:', avisos.length);
  return NextResponse.json({ ok: true, avisos: avisos.length });
}
