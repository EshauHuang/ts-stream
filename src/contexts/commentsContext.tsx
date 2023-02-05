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

export interface CommentsProps {
  id: number;
  message: IMessage;
  user: IUser;
}

export interface IComment {
  user: IUser;
  message: IMessage;
}

interface CommentsContextProps {
  currentComments: CommentsProps[] | [];
  setCurrentComments: React.Dispatch<
    React.SetStateAction<CommentsProps[] | []>
  >;
  sendCommentByUser: ({ user, message }: IComment) => void;
}

interface CommentsProviderProps {
  children?: React.ReactNode;
}

export const CommentsContext = createContext({} as CommentsContextProps);

export const CommentsProvider: React.FC<CommentsProviderProps> = ({ children }) => {
  const [currentComments, setCurrentComments] = useState<CommentsProps[] | []>(
    []
  );

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
    console.log("start");

    return () => {
      setCurrentComments([]);
    }
  }, [])

  // 模擬從資料庫抓取聊天室訊息
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data: Comments } = await getComments();

  //     setCurrentComments(Comments);
  //   };

  //   fetchData();
  // }, []);

  const value = { currentComments, setCurrentComments, sendCommentByUser };

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
};
