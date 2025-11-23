
# ISO/IEC 17025 Calibration Management (Boilerplate)

MVP open-source para gestão de equipamentos e calibrações conforme ISO/IEC 17025.
Stack: **Next.js (Vercel)** + **Firebase Authentication/Firestore/Storage**.

## Recursos (MVP)
- Multi-tenant opcional (orgs) – pode operar mono-empresa.
- Cadastro de equipamentos com campos obrigatórios: **faixa**, **classe**, **tolerâncias**.
- Controle de calibrações, anexos (certificados), preferência por **RBC**.
- Regras de segurança por papéis: `admin`, `metrologista`, `leitor`.
- Cron de lembretes para vencimentos de calibração.
- Auditoria (gancho para Cloud Functions).
- i18n básico (PT-BR/EN).

## Como iniciar

1. **Clone e instale**
```bash
npm install
npm run dev
```

2. **Firebase**
- Crie um projeto no Firebase.
- Habilite **Authentication (Email/Password)**, **Firestore**, **Storage**.
- Pegue a config Web e preencha `.env.local` com as variáveis `NEXT_PUBLIC_FB_*`.
- Gere uma **Service Account (JSON)** e coloque o conteúdo em `FIREBASE_SERVICE_ACCOUNT` (Vercel env).

3. **Regras**
- Publique `firestore.rules` e `storage.rules` via Console ou CLI.

4. **Vercel**
- Crie um projeto, conecte o repositório.
- Adicione as envs (produção e preview): `NEXT_PUBLIC_FB_*`, `FIREBASE_SERVICE_ACCOUNT`, `CRON_SECRET`.
- Deploy.

5. **Papéis/Claims**
- Use o endpoint `/api/admin/set-claims` (a ser criado) ou Admin SDK para definir `orgId` e `roles` para usuários.

## Scripts úteis
- `GET /api/cron/lembretes` – varre próximos vencimentos (proteja com `CRON_SECRET`).

## Licença
MIT (ou altere para Apache-2.0 conforme preferência).
