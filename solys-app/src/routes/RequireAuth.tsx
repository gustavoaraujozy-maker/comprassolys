import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useSession } from 'providers/SessionProvider';
import paths from 'routes/path';

export function RequireAuth({ children, role }: { children: ReactNode; role?: 'loja' | 'gestao' }) {
  const { session } = useSession();
  const location = useLocation();
  if (!session) return <Navigate to={paths.login} replace state={{ from: location }} />;
  if (role && session.tipo !== role) {
    // redireciona pra rota correta do papel
    return <Navigate to={session.tipo === 'loja' ? paths.minhaLista : paths.pedidos} replace />;
  }
  return <>{children}</>;
}
