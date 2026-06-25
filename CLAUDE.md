# SOLYS · Logística de Compras — Orientações do projeto

## O que é
Sistema interno **leve** de pedidos de compras, usado essencialmente para
**gerar relatórios de compras**. Não é um sistema pesado — manter simples e enxuto.

## Stack
- **Frontend:** `index.html` (single-file, JS vanilla + CSS embutido) — é o que roda em produção
- **Backend:** Firebase **Firestore** (plano **Spark / gratuito**)
- **Projeto Firebase:** `comprassolys`
- **Coleções:** `lojas` (itens embutidos no doc), `pedidos`, `config/gestao`
- **Deploy:** Vercel, a partir da branch `main` → push na `main` republica o site

## REGRA OBRIGATÓRIA (pedido do dono)
**Antes de implementar QUALQUER mudança pedida, faça primeiro uma análise de
impacto no Firestore** e relate ao usuário, para não comprometer o servidor.
A meta é o sistema **rodar bem e barato** no plano gratuito.

Cheque sempre:
1. **Leituras/escritas** — a mudança aumenta muito reads/writes? (Spark: ~50k leituras
   e ~20k escritas por dia). Evitar polling agressivo, leituras em massa repetidas
   e laços que escrevem documento a documento sem necessidade.
2. **Tamanho de documento** — limite de **1 MB por doc**. NÃO guardar imagens/PDFs
   grandes (base64) dentro dos pedidos. Anexos pesados devem ficar de fora do Firestore.
3. **Realtime (`onSnapshot`)** — manter poucos listeners (hoje: `pedidos` e `lojas`).
   A carga inicial é ignorada de propósito para não disparar avalanche de notificações.
4. **Armazenamento** — manter dados enxutos; é um sistema de relatório, não de mídia.

Se a mudança for "grande" ou puder pesar, **avise o usuário e proponha a alternativa leve**.

## Senhas padrão (1º acesso)
- Lojas: `Sgroup@2026#`  ·  Diretoria: `Solys@2027#k`
