
'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase-client';

export default function LaboratoriosPage() {
  const [items, setItems] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [acreditadoRBC, setAcreditadoRBC] = useState(false);
  const [rbcNumero, setRbcNumero] = useState('');
  const [contato, setContato] = useState('');
  const [error, setError] = useState<string| null>(null);

  useEffect(() => {
    const run = async () => {
      const u = auth.currentUser;
      if (!u) return;
      const token = await u.getIdToken();
      const res = await fetch('/api/laboratorios/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setItems(data); else setError(data.error);
    };
    run();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const u = auth.currentUser;
    if (!u) return;
    const token = await u.getIdToken();
    const res = await fetch('/api/laboratorios/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome, acreditadoRBC, rbcNumero, contato })
    });
    const data = await res.json();
    if (!res.ok) { setError(JSON.stringify(data)); return; }
    // reload list
    const resList = await fetch('/api/laboratorios/list', { headers: { Authorization: `Bearer ${token}` }});
    const list = await resList.json();
    setItems(list);
    setNome(''); setAcreditadoRBC(false); setRbcNumero(''); setContato('');
  };

  return (
    <div>
      <h1>Laboratórios</h1>
      <form onSubmit={onCreate} style={{marginBottom:16}}>
        <input placeholder='Nome' value={nome} onChange={e=>setNome(e.target.value)} />
        <label style={{marginLeft:8}}>
          <input type='checkbox' checked={acreditadoRBC} onChange={e=>setAcreditadoRBC(e.target.checked)} /> RBC
        </label>
        <input placeholder='Nº RBC (opcional)' value={rbcNumero} onChange={e=>setRbcNumero(e.target.value)} style={{marginLeft:8}} />
        <input placeholder='Contato (opcional)' value={contato} onChange={e=>setContato(e.target.value)} style={{marginLeft:8}} />
        <button type='submit' style={{marginLeft:8}}>Criar</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {items.map(it => (
          <li key={it.id}>
            {it.nome} {it.acreditadoRBC ? '• RBC' : ''} {it.rbcNumero ? `(RBC ${it.rbcNumero})` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
