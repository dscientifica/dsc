
'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase-client';
import { collection, getDocs } from 'firebase/firestore';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (!u) return;
      // orgId fixo para MVP
      const snap = await getDocs(collection(db, 'orgs', 'org-demo', 'equipamentos'));
      const list = snap.docs.map(d=>({ id: d.id, ...d.data() }));
      setItems(list);
    });
    return () => unsub();
  }, []);

  if (!user) return <p>Faça login para continuar.</p>;

  const now = new Date();
  const soon = new Date(now); soon.setDate(soon.getDate()+30);

  function badge(prox: any) {
    if (!prox) return null;
    const d = prox.toDate ? prox.toDate() : new Date(prox);
    if (d < now) return <span style={{color:'white', background:'red', padding:'2px 6px', borderRadius:4, marginLeft:8}}>VENCIDO</span>;
    if (d <= soon) return <span style={{color:'white', background:'orange', padding:'2px 6px', borderRadius:4, marginLeft:8}}>PRÓX. 30d</span>;
    return null;
  }

  return (
    <div>
      <h1>Visão Geral</h1>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th style={{textAlign:'left'}}>Tag</th>
            <th style={{textAlign:'left'}}>Descrição</th>
            <th style={{textAlign:'left'}}>Localização</th>
            <th style={{textAlign:'left'}}>Próxima Calibração</th>
            <th style={{textAlign:'left'}}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it=>{
            const prox = it.proximaCalibracao || null;
            const d = prox ? (prox.toDate ? prox.toDate() : new Date(prox)) : null;
            return (
              <tr key={it.id}>
                <td>{it.tag}</td>
                <td>{it.descricao}</td>
                <td>{it.localizacao || '-'}</td>
                <td>{d ? d.toLocaleDateString() : '-' } {badge(prox)}</td>
                <td>{it.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
