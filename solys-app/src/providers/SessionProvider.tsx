import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Loja, Session } from 'data/types';

interface SessionCtx {
  session: Session | null;
  loja: Loja | null;
  setSession: (s: Session | null, l?: Loja | null) => void;
  logout: () => void;
}

const Ctx = createContext<SessionCtx>({
  session: null,
  loja: null,
  setSession: () => {},
  logout: () => {},
});

const STORAGE_KEY = 'solys:session';
const STORAGE_LOJA = 'solys:session-loja';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });
  const [loja, setLojaState] = useState<Loja | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_LOJA);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, [session]);
  useEffect(() => {
    if (loja) localStorage.setItem(STORAGE_LOJA, JSON.stringify(loja));
    else localStorage.removeItem(STORAGE_LOJA);
  }, [loja]);

  const setSession = (s: Session | null, l: Loja | null = null) => {
    setSessionState(s);
    if (l !== undefined) setLojaState(l);
  };

  const logout = () => {
    setSessionState(null);
    setLojaState(null);
  };

  return (
    <Ctx.Provider value={{ session, loja, setSession, logout }}>{children}</Ctx.Provider>
  );
}

export function useSession() {
  return useContext(Ctx);
}
