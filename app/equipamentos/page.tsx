
'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase-client';
import { collection, getDocs } from 'firebase/firestore';

export default function EquipamentosPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      // Para demo: org fixa 'org-demo'
      const snap = await getDocs(collection(db, 'orgs', 'org-demo', 'equipamentos'));
      setItems(snap.docs.map(d=>({id:d.id, ...d.data()})));
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Equipamentos</h1>
      <a href="/equipamentos/new">Novo Equipamento</a>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.tag} - {item.descricao}</li>
        ))}
      </ul>
    </div>
  );
}
