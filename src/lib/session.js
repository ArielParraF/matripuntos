import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as store from './store';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [state, setState] = useState({ loading: true, user: null, couple: null, partner: null, points: [], games: [] });

  const refresh = useCallback(async () => setState({ loading: false, ...(await store.loadState()) }), []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const actions = useMemo(() => {
    const withRefresh = (fn) => async (...args) => {
      await fn(...args);
      await refresh();
    };
    return {
      register: withRefresh(store.register),
      login: withRefresh(store.login),
      logout: withRefresh(store.logout),
      linkWithCode: withRefresh(store.linkWithCode),
      addPoints: withRefresh(store.addPoints),
      addGameResult: withRefresh(store.addGameResult),
    };
  }, [refresh]);

  return <SessionContext.Provider value={{ ...state, ...actions }}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
