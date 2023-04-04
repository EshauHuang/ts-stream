import { createContext, useState } from "react";

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

  return <UserContext.Provider value={value}>{children} </UserContext.Provider>;
};
