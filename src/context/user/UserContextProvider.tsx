'use client';

import { PropsWithChildren, useEffect, useState } from "react";
import { UserContext } from "./context";
import { TUser } from "@/utils/types";

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

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/users/${userId}`, {
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ0YWJsZXRvcC1nYW1lcy1zaG9wIiwic3ViIjoicG9saXZrYWFyc2VuQGdtYWlsLmNvbSIsImlhdCI6MTczMTk3NDU5NCwiZXhwIjoxNzM5MTc0NTk0fQ.WM1UAPYopSP2QJJy5A9diIpDZU2k6ObC08PcfDObkdCh7DWb57K-DrLNJv2btt1XIUIBVUXpNPL2X_jQZhnCLQ`,
          }
        });
        const data = await response.json();

        setUser(data);
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
