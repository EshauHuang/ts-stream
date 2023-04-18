import { createContext, useState, useEffect, useRef, useContext } from "react";
import _ from "lodash-es";

import { getComments } from "@/api/stream";

import { VideoOptionsContext } from "@/contexts/videoOptionsContext";

export interface IUser {
  photo?: string;
  username: string;
  memberPhoto?: string;
}

export interface IMessage {
  text: string;
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
  fetchNewCommentsAndAddToDelayComments: () => void;
  setVideoStartTime: (startTime: number) => void;
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
  const [isFetchNewComments, setIsFetchNewComments] = useState(false);
  const [isNextComments, setIsNextComments] = useState(true);
  const [videoStartTime, setVideoStartTime] = useState<number>();

  const {
    videoOptions: { currentTime, videoId, isScrubbing },
  } = useContext(VideoOptionsContext);

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
    setCommentsDelay((prev) => [...prev, ...comments]);
  };

  const fetchNewCommentsAndAddToDelayComments = async () => {
    if (!videoStartTime) return;

    const videoRealTime =
      (currentTime - 1 < 0 ? 0 : currentTime - 1) * 1000 + videoStartTime;
    const { comments } = await getComments(videoId, videoRealTime, -1);

    const { time: lastCommentTime } = comments[comments.length - 1] || {};

    setCurrentComments(comments);

    if (lastCommentTime) {
      const { comments: nextComments } = await getComments(
        videoId,
        lastCommentTime
      );

      setCommentsDelay(nextComments);
      nextComments.length >= 10
        ? setIsNextComments(true)
        : setIsNextComments(false);
    }
  };

  useEffect(() => {
    return () => {
      setCurrentComments([]);
      setCommentsDelay([]);
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isScrubbing || !videoStartTime) return;

    if (!commentsDelay.length) return;
    let copyCommentsDelay = _.cloneDeep(commentsDelay);

    const [comment] = copyCommentsDelay;

    if (Number(comment.time) > currentTime * 1000 + videoStartTime) return;

    copyCommentsDelay.shift();

    addNewComment(comment);
    setCommentsDelay((prev) => {
      const [_, ...newComments] = prev;
      return newComments;
    });
  }, [commentsDelay, currentTime, currentTime, isScrubbing, videoStartTime]);

  useEffect(() => {
    if (isScrubbing || !isNextComments) return;

    if (
      commentsDelay.length &&
      commentsDelay.length <= 2 &&
      !isFetchNewComments
    ) {
      setIsFetchNewComments(true);

      const fetchNewComments = async () => {
        const { time } = commentsDelay[commentsDelay.length - 1] || {};

        if (time) {
          const { comments } = (await getComments(videoId, time)) || {};

          if (comments && comments.length >= 10) {
            addNewDelayComments(comments);
            setIsFetchNewComments(false);
          } else if (comments && comments.length < 10) {
            addNewDelayComments(comments);
            setIsNextComments(false);
            setIsFetchNewComments(false);
          }
        }
      };

      fetchNewComments();
    }
  }, [
    videoId,
    commentsDelay,
    isFetchNewComments,
    isScrubbing,
    isNextComments,
    isFetchNewComments,
  ]);

  const value = {
    currentComments,
    setCurrentComments,
    addNewComment,
    commentsDelay,
    setCommentsDelay,
    addNewDelayComments,
    fetchNewCommentsAndAddToDelayComments,
    setVideoStartTime,
  };

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
};
