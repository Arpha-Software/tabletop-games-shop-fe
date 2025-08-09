'use client';

import { PropsWithChildren, useEffect, useRef, useState, useCallback } from "react";
import { UserContext } from "./context";
import { TUser } from "@/utils/types";
import { Loader } from "@/app/ui/components/Loader";
import { EUserRole } from "@/utils/enums";
import { getCurrentUser } from "@/app/actions/auth";
import { usePathname } from 'next/navigation';

type TProps = PropsWithChildren<{}>;

export const UserContextProvider = ({ children }: TProps) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  const reqIdRef = useRef(Math.random().toString(36).slice(2, 8));
  const ranRef = useRef(false);
  const log = (...args: any[]) => console.log(`[UserCtx ${reqIdRef.current}]`, ...args);

  const loadUser = useCallback(async () => {
    const start = performance.now();
    log('loadUser: begin at', new Date().toISOString(), 'pathname=', pathname);
    try {
      setLoading(true);
      const { success, data, errors } = await getCurrentUser();
      log('loadUser: getCurrentUser -> success=', success, 'data:', data, 'errors:', errors);
      if (success && data) {
        setUser(data);
        setIsAdmin(data.role === EUserRole.ADMIN || data.role === 'ROLE_ADMIN');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      log('loadUser: exception', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
      log('loadUser: end, elapsed=', Math.round(performance.now() - start), 'ms');
    }
  }, [pathname]);

  useEffect(() => {
    log('useEffect: mount/path change ->', pathname);

    // While we're on /callback, cookies are being set on the server and then we’re redirected.
    if (pathname.startsWith('/callback')) {
      log('useEffect: on /callback, skipping loadUser');
      setLoading(false);
      return;
    }

    if (ranRef.current) {
      log('useEffect: already ran once, skip');
      return;
    }
    ranRef.current = true;

    void loadUser();
  }, [pathname, loadUser]);

  log('render: loading=', loading, 'user=', user?.id, 'isAdmin=', isAdmin, 'path=', pathname);

  return (
    <UserContext.Provider value={{ user, isAdmin, loading, setUser }}>
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
};
