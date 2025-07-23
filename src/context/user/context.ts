import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

import { TUser } from "@/utils/types";

export type TUserContext = {
  user?: TUser | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: Dispatch<SetStateAction<TUser | null>>
}

export const UserContext = createContext<TUserContext | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  return context;
}
