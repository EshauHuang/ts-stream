import { createContext, useState } from "react";

interface UserProps {
  name: string;
  username: string;
}

interface UserContextType {
  currentUser: UserProps | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

interface UserProviderProps {
  children?: React.ReactNode;
}

export const UserContext = createContext({} as UserContextType);

export const UsersProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProps | null>(null);

  const value = { currentUser, setCurrentUser };

  return <UserContext.Provider value={value}>{children} </UserContext.Provider>;
};
