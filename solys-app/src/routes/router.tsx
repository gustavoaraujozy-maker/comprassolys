import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import paths, { rootPaths } from './path';
import { RequireAuth } from './RequireAuth';

const App = lazy(() => import('App'));
const MainLayout = lazy(() => import('layouts/main-layout'));
const AuthLayout = lazy(() => import('layouts/auth-layout'));
const Spinner = lazy(() => import('components/loading/Splash'));
const LoadingProgress = lazy(() => import('components/loading/LoadingProgress'));

const LoginPage = lazy(() => import('pages/authentication/login'));
const PedidosPage = lazy(() => import('pages/pedidos/PedidosPage'));
const LojasPage = lazy(() => import('pages/lojas/LojasPage'));
const AcessosPage = lazy(() => import('pages/acessos/AcessosPage'));
const MinhaListaPage = lazy(() => import('pages/minha-lista/MinhaListaPage'));
const NovoPedidoPage = lazy(() => import('pages/novo-pedido/NovoPedidoPage'));
const NotFoundPage = lazy(() => import('pages/not-found'));

export const routes = [
  {
    element: (
      <Suspense fallback={<Spinner />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.default,
        element: (
          <RequireAuth>
            <MainLayout>
              <Suspense fallback={<LoadingProgress />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <RequireAuth role="gestao"><PedidosPage /></RequireAuth> },
          { path: 'lojas', element: <RequireAuth role="gestao"><LojasPage /></RequireAuth> },
          { path: 'acessos', element: <RequireAuth role="gestao"><AcessosPage /></RequireAuth> },
          { path: 'minha-lista', element: <RequireAuth role="loja"><MinhaListaPage /></RequireAuth> },
          { path: 'novo-pedido', element: <RequireAuth role="loja"><NovoPedidoPage /></RequireAuth> },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: <AuthLayout />,
        children: [
          { path: paths.login.replace(rootPaths.authRoot + '/', ''), element: <LoginPage /> },
        ],
      },
      { path: rootPaths.errorRoot, children: [{ path: '404', element: <NotFoundPage /> }] },
      { path: '*', element: <Navigate to={paths.notFound} replace /> },
    ],
  },
];

const router = createBrowserRouter(routes, { basename: '/' });
export default router;
