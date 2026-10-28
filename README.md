# SOLYS · Logística de Compras

Sistema interno de pedidos de compras integrado com Firebase em tempo real.

## Arquitetura

- **Frontend:** HTML único (`index.html`) com JS vanilla e CSS embutido
- **Backend:** Firebase Firestore (banco + realtime via `onSnapshot`)
- **Projeto Firebase:** `comprassolys`
- **Coleções:** `lojas` (com itens embutidos), `pedidos`, `config/gestao`

## Como rodar localmente

Basta abrir `index.html` em qualquer navegador. Tudo funciona offline para visualização; para sincronizar pedidos entre lojas e diretoria é preciso conexão com a internet (Firebase).

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

- **Login por e-mail fictício** (só identifica a conta, não recebe mensagens): `<codigo-da-loja>@solyscompras.com`
  — ex.: `bezerra@solyscompras.com`, `casadonakarol@solyscompras.com`
- **Diretoria:** `diretoria@solyscompras.com` + senha da gestão
- **Senhas das lojas:** individuais — a Diretoria vê, gera e envia em **Acessos** (botões *Gerar logins*, *WhatsApp*, *Copiar*)

## Estrutura

```
.
├── index.html                # aplicação completa (single-file)
├── solys-central (3).html    # backup
├── vercel.json               # config de deploy
├── solys-app/                # versão React (em migração — não usada em prod)
└── assets/                   # imagens originais
```
