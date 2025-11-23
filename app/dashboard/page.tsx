
'use client';
import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) setToken(await getIdToken(u));
    });
    return () => unsub();
  }, []);

  if (!user) return <p>Faça login para continuar.</p>;

  return (
    <div>
      <h1>Visão Geral</h1>
      <p>Usuário: {user.email}</p>
    </div>
  );
}
