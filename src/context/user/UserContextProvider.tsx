'use client';

import { PropsWithChildren, useEffect, useState } from "react";
import { UserContext } from "./context";
import { TUser } from "@/utils/types";
import { getCurrentUser } from "@/app/actions/auth";

type TProps = PropsWithChildren<{}>;

export const UserContextProvider = ({ children }: TProps) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('USER ID', userId);
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await getCurrentUser();

        setUser(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
}
