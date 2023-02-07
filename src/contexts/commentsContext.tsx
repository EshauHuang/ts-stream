import { createContext, useState, useEffect, useCallback } from "react";

import { getMessages } from "@/json/messages";
import { getUsers } from "@/json/users";

export interface IUser {
  photo?: string;
  username: string;
  memberPhoto?: string;
}

export interface IMessage {
  date: string;
  text: string;
}

export interface IComment {
  user: IUser;
  message: IMessage;
}

interface CommentsContextProps {
  currentComments: IComment[] | [];
  setCurrentComments: React.Dispatch<React.SetStateAction<IComment[] | []>>;
  sendCommentByUser: ({ user, message }: IComment) => void;
}

interface CommentsProviderProps {
  children?: React.ReactNode;
}

export const CommentsContext = createContext({} as CommentsContextProps);

export const CommentsProvider: React.FC<CommentsProviderProps> = ({ children }) => {
  const [currentComments, setCurrentComments] = useState<IComment[] | []>([]);

  const sendCommentByUser = ({ user, message }: IComment) => {
    setCurrentComments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        user,
        message,
      },
    ]);
  };

  useEffect(() => {
    return () => {
      setCurrentComments([]);
    }
  }, [])

  const value = { currentComments, setCurrentComments, sendCommentByUser };

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
};
