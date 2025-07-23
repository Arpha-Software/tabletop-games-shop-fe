// src/context/user/UserContextProvider.tsx
'use client';

import { PropsWithChildren, useEffect, useState, useCallback } from "react";
import { UserContext } from "./context";
import { TUser } from "@/utils/types";
import { Loader } from "@/app/ui/components/Loader";
import { EUserRole } from "@/utils/enums";
import { getCurrentUser } from "@/app/actions/auth"; // getCurrentUser no longer needs a token parameter
import { useRouter, usePathname } from 'next/navigation';

type TProps = PropsWithChildren<{}>;

// Removed the local getAuthToken function as localStorage is no longer used for tokens.
// The server action getCurrentUser will now get the token from HttpOnly cookies.

export const UserContextProvider = ({ children }: TProps) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to track client-side hydration
  const router = useRouter();
  const pathname = usePathname();

  // Effect to confirm component is mounted on client-side
  useEffect(() => {
    setIsClient(true);
    console.log('UserContextProvider: Component mounted on client.');
  }, []);

  const loadUser = useCallback(async () => {
    setLoading(true);
    console.log('loadUser: Initiating user load...');

    if (!isClient) {
      console.log('loadUser: Not on client yet, deferring user load.');
      setLoading(false);
      return;
    }

    try {
      console.log('loadUser: Calling getCurrentUser...');
      const { success, data, errors } = await getCurrentUser();
      console.log('loadUser: getCurrentUser response - success:', success, 'data:', data, 'errors:', errors);

      if (success && data) {
        setUser(data);
        setIsAdmin(data.role === EUserRole.ADMIN);
        console.log('loadUser: User data successfully set.');
      } else {
        console.error("loadUser: Failed to load user from API:", errors);
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("loadUser: Unexpected error during getCurrentUser call:", error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
      console.log('loadUser: User loading process finished. Loading set to false.');
    }
  }, [isClient]);

  useEffect(() => {
    console.log('UserContextProvider useEffect triggered. Current pathname:', pathname);
    loadUser();
  }, [loadUser]);

  return (
    <UserContext.Provider value={{ user, isAdmin, loading, setUser }}>
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
};
