import { createContext, useState, useEffect, useRef } from "react";
import _ from "lodash-es";

import { getMessages } from "@/json/messages";
import { getUsers } from "@/json/users";

export interface IUser {
  photo?: string;
  username: string;
  memberPhoto?: string;
}

export interface IMessage {
  text: string;
  time: string;
}

export interface IComment {
  time: number | string;
  user: IUser;
  message: IMessage;
}

interface CommentsContextProps {
  currentComments: IComment[] | [];
  setCurrentComments: React.Dispatch<React.SetStateAction<IComment[] | []>>;
  addNewComment: ({ time, user, message }: IComment) => void;
  commentsDelay: IComment[] | [];
  setCommentsDelay: React.Dispatch<React.SetStateAction<IComment[] | []>>;
  addNewDelayComments: (comments: IComment[]) => void;
  setChatTime: (time: number) => void;
}

interface CommentsProviderProps {
  children?: React.ReactNode;
}

export const CommentsContext = createContext({} as CommentsContextProps);

export const CommentsProvider: React.FC<CommentsProviderProps> = ({
  children,
}) => {
  const [currentComments, setCurrentComments] = useState<IComment[] | []>([]);
  const [commentsDelay, setCommentsDelay] = useState<IComment[] | []>([]);
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const chatTime = useRef<number>(0);

  const setChatTime = (time: number) => {
    chatTime.current = time;
  };

  const addNewComment = ({ time, user, message }: IComment) => {
    setCurrentComments((prev) => [
      ...prev,
      {
        time,
        user,
        message,
      },
    ]);
  };

  const addNewComments = (comments: IComment[]) => {
    setCurrentComments((prev) => [...prev, ...comments]);
  };

  const addNewDelayComments = (comments: IComment[]) => {
    setCommentsDelay(comments);
  };

  // const addNewComments = ({user, message})

  useEffect(() => {
    return () => {
      setCurrentComments([]);
      setCommentsDelay([]);
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = null;
      chatTime.current = 0;
    };
  }, []);

  useEffect(() => {
    //  沒有待加入的留言則清除 timer 並將暫存的 timerId 刪除
    if (!commentsDelay.length && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timerRef.current || !commentsDelay.length) return;
    let copyCommentsDelay = _.cloneDeep(commentsDelay);

    timerRef.current = setInterval(() => {
      const [comment] = copyCommentsDelay;

      if (comment.time > chatTime.current) return;

      copyCommentsDelay.shift();

      if (!copyCommentsDelay.length) {
        timerRef.current && clearInterval(timerRef.current);
        timerRef.current = null;
      }

      addNewComment(comment);
      setCommentsDelay((prev) => {
        const [_, ...newComments] = prev;
        return newComments;
      });
    }, 300);
  }, [commentsDelay]);
  // console.log({ commentsDelay });

  const value = {
    currentComments,
    setCurrentComments,
    addNewComment,
    commentsDelay,
    setCommentsDelay,
    addNewDelayComments,
    setChatTime,
  };

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
};
