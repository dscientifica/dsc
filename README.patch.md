
# Patch: Claims + Laboratórios + Alertas

## Endpoint para definir claims
- **Arquivo**: `app/api/admin/set-claims/route.ts`
- **Env**: `ADMIN_CLAIMS_TOKEN`
- **Uso**:
```
curl -X POST https://<seu-dominio>/api/admin/set-claims   -H "x-admin-token: <ADMIN_CLAIMS_TOKEN>"   -H "Content-Type: application/json"   -d '{"uid":"<UID>","orgId":"org-demo","roles":["admin"]}'
```

## Laboratórios (CRUD mínimo)
- **Criar**: `POST /api/laboratorios/create`
- **Listar**: `GET /api/laboratorios/list`
- **Página**: `/laboratorios`
Campos: `nome` (obrigatório), `acreditadoRBC` (boolean), `rbcNumero` (opcional), `contato` (opcional).

## Alertas no Dashboard
- Badges: **VENCIDO** (vermelho), **PRÓX. 30d** (laranja) em `app/dashboard/page.tsx`.

## Passos pós-patch
1. Adicionar env `ADMIN_CLAIMS_TOKEN` na Vercel.
2. Fazer deploy.
3. Definir claims para seu usuário.
4. Criar laboratórios com flag RBC se desejar.
