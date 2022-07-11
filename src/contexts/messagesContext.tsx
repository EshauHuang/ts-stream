import { createContext, useState, useEffect } from "react";

import { getMessages } from "@/json/messages";
import { getUsers } from "@/json/users";

interface MessageProps {
  id: number;
  photo?: string;
  name: string;
  date?: string;
  message: string;
  memberPhoto?: string;
}

interface MessagesContextProps {
  currentMessages: MessageProps[] | [];
  setCurrentMessages: React.Dispatch<React.SetStateAction<MessageProps[] | []>>;
  sendMessageByUser: ({
    username,
    message,
  }: {
    username: string;
    message: string;
  }) => void;
}

interface UserProviderProps {
  children?: React.ReactNode;
}

export const MessagesContext = createContext({} as MessagesContextProps);

export const MessagesProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[] | []>(
    []
  );

  // 模擬留言
  const sendMessageByUser = async ({
    username,
    message,
  }: {
    username: string;
    message: string;
  }) => {
    const { data: users } = await getUsers();

    const userDetail = users.find(
      (user: { username: string; name: string; password: string }) =>
        user.username === username
    );
    
    const newMessageId = currentMessages[currentMessages.length - 1].id + 1

    setCurrentMessages([...currentMessages, {
      ...userDetail,
      id: newMessageId,
      message
    }])
  };

  // 模擬從資料庫抓取聊天室訊息
  useEffect(() => {
    const fetchData = async () => {
      const { data: messages } = await getMessages();

      setCurrentMessages(messages);
    };

    fetchData();
  }, []);

  const value = { currentMessages, setCurrentMessages, sendMessageByUser };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};
