# SOLYS · Logística de Compras

Sistema interno de pedidos de compras integrado com Supabase em tempo real.

## Arquitetura

- **Frontend:** HTML único (`index.html`) com JS vanilla e CSS embutido
- **Backend:** Supabase (Postgres + Realtime)
- **Banco:** projeto `solys-compras` (sa-east-1)

## Como rodar localmente

Basta abrir `index.html` em qualquer navegador. Tudo funciona offline para visualização; para sincronizar pedidos entre lojas e diretoria é preciso conexão com a internet (Supabase).

## Deploy

O projeto está pronto para Vercel:

1. Acesse https://vercel.com e clique em **New Project**
2. Importe este repositório (`comprassolys`)
3. Em **Project Name**, coloque `solyscompras`
4. **Framework Preset:** "Other" (ou deixe em "No Framework")
5. **Output Directory:** deixe vazio (raiz)
6. Clique em **Deploy**

A URL final será `https://solyscompras.vercel.app`.

## Credenciais

- **Senha padrão das lojas:** `Sgroup@2026#` (na primeira entrada cada loja cadastra nome + endereço + nova senha)
- **Senha da Diretoria:** `Solys@2027#k`

## Estrutura

```
.
├── index.html                # aplicação completa (single-file)
├── solys-central (3).html    # backup
├── vercel.json               # config de deploy
├── solys-app/                # versão React (em migração — não usada em prod)
└── assets/                   # imagens originais
```
