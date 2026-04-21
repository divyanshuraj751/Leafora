import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "leafora.user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(async (email: string, _password: string) => {
    // TODO: wire to Firebase / backend. Stub keeps UI flow working today.
    await new Promise((r) => setTimeout(r, 500));
    persist({ id: "demo", email, name: email.split("@")[0] });
  }, []);

  const signup = useCallback(async (email: string, _password: string, name?: string) => {
    await new Promise((r) => setTimeout(r, 500));
    persist({ id: "demo", email, name: name ?? email.split("@")[0] });
  }, []);

  const logout = useCallback(async () => {
    persist(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading, login, signup, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
