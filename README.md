# App Assistência Técnica

PWA para gestão de clientes, equipamentos e ordens de serviço, com funcionamento offline.

## Tecnologias principais
- [Next.js 14 (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form + Zod](https://react-hook-form.com/)
- [SWR](https://swr.vercel.app/)
- [Axios](https://axios-http.com/)
- [idb](https://github.com/jakearchibald/idb) + Background Sync para fila offline
- [@ducanh2912/next-pwa](https://github.com/ducanh2912/next-pwa)

## Requisitos
- Node.js 18+
- npm (ou pnpm)

## Instalação e execução
```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Scripts disponíveis
- `npm run dev` – ambiente de desenvolvimento
- `npm run build` – build para produção
- `npm run start` – execução do build
- `npm run lint` – checagem ESLint
- `npm run typecheck` – verificação de tipos TypeScript
- `npm run prepare` – desabilita a telemetria do Next.js

## Variáveis de ambiente
Crie um arquivo `.env.local` com base em `.env.example`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Fila offline
As requisições mutativas (POST/PUT/DELETE) são enfileiradas no IndexedDB quando não há conexão. O Service Worker reenvia automaticamente quando a rede retornar e atualiza o badge na interface.

## Fluxo de autenticação
O login armazena as credenciais na store do Zustand e em cookie `auth-token`. O middleware protege as rotas internas e redireciona para `/login` quando necessário.

## Publicação inicial no GitHub
```
git init
git remote add origin https://github.com/PauloRicardoGon/frontPaulo.git
git add .
git commit -m "feat: Next.js + Tailwind PWA (offline queue) + contratos fixos"
git branch -M main
git push -u origin main
```
