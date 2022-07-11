import { createContext, useState, useEffect } from "react";

interface UserProps {
  name: string;
  username: string;
}

interface UserContextProps {
  currentUser: UserProps | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

interface UserProviderProps {
  children?: React.ReactNode;
}

export const UserContext = createContext({} as UserContextProps);

export const UsersProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProps | null>(null);

  const value = { currentUser, setCurrentUser };

  // 模擬登入狀態
  useEffect(() => {
    setCurrentUser({
      name: 'user01',
      username: "user01"
    })
  }, [])

  return <UserContext.Provider value={value}>{children} </UserContext.Provider>;
};
