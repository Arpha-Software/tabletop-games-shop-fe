'use client';

import { PropsWithChildren, useEffect, useState, useCallback } from "react";
import { UserContext } from "./context";
import { TUser } from "@/utils/types";
import { Loader } from "@/app/ui/components/Loader";
import { EUserRole } from "@/utils/enums";

type TProps = PropsWithChildren<{}>;

const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};

const fetchCurrentUser = async (): Promise<{ success: boolean; data: TUser | null }> => {
  const token = getAuthToken();

  if (!token) {
    return { success: false, data: null };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/api/v1/users/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      return { success: false, data: null };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { success: false, data: null };
  }
};

export const UserContextProvider = ({ children }: TProps) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadUser = useCallback(async () => {
    setLoading(true);
    const { success, data } = await fetchCurrentUser();
    if (success && data) {
      setUser(data);
      setIsAdmin(data.role === EUserRole.ADMIN);
    } else {
      setUser(null);
      setIsAdmin(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
    console.log('user', user)
  }, [loadUser]);

  return (
    <UserContext.Provider value={{ user, isAdmin, setUser }}>
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
}