'use client';

import { PropsWithChildren, useEffect, useState } from "react";
import { UserContext } from "./context";
import { TUser } from "@/utils/types";
import { getCurrentUser } from "@/app/actions/auth";
import { Loader } from "@/app/ui/components/Loader";
import { EUserRole } from "@/utils/enums";

type TProps = PropsWithChildren<{}>;

export const UserContextProvider = ({ children }: TProps) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();

        setUser(response.data);
        setIsAdmin(response.data.role === EUserRole.ADMIN);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isAdmin, setUser }}>
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
}
