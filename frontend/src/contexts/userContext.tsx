import { createContext, useState, useEffect } from "react";

import { getMe } from "@/api/stream";

export interface IUser {
  email: string;
  username: string;
}

interface UserContextProps {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

interface UserProviderProps {
  children?: React.ReactNode;
}

export const UserContext = createContext({} as UserContextProps);

export const UsersProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const fetchMyData = async () => {
      const { data } = await getMe();

      const { user } = data || {};

      if (user) {
        setCurrentUser(user);
      }
    };

    fetchMyData();
  }, []);

  return <UserContext.Provider value={value}>{children} </UserContext.Provider>;
};
