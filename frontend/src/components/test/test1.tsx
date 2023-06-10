import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash-es";

import { TCommentInfo } from "@/contexts/commentsContext";
import { getComments } from "@/api/stream";

const Container = styled.div`
  color: white;
`;

const Timer = styled.div`
  font-size: 32px;
`;

const Button = styled.button`
  color: white;
  padding: 5px 10px;
  background-color: grey;
  cursor: pointer;
`;

const Comments = styled.div``;

const comments = [
  {
    time: 1675759497647,
    author: { username: "Sans" },
    message: { text: "asd" },
  },
  {
    time: 1675759497786,
    author: { username: "Sans" },
    message: { text: "asd" },
  },
  {
    time: 1675759498151,
    author: { username: "Sans" },
    message: { text: "asdas" },
  },
  {
    time: 1675759498217,
    author: { username: "Sans" },
    message: { text: "d" },
  },
  {
    time: 1675759498330,
    author: { username: "Sans" },
    message: { text: "a" },
  },
  {
    time: 1675759498456,
    author: { username: "Sans" },
    message: { text: "da" },
  },
  {
    time: 1675759498557,
    author: { username: "Sans" },
    message: { text: "sd" },
  },
  {
    time: 1675759498662,
    author: { username: "Sans" },
    message: { text: "adfadadadsa" },
  },
  {
    time: 1675759498762,
    author: { username: "Sans" },
    message: { text: "d" },
  },
  {
    time: 1675759498780,
    author: { username: "Sans" },
    message: { text: "BBBBBBB" },
  },
  {
    time: 1675759499006,
    author: { username: "Sans" },
    message: { text: "d" },
  },
  {
    time: 1675759499106,
    author: { username: "Sans" },
    message: { text: "a" },
  },
  {
    time: 1675759499211,
    author: { username: "Sans" },
    message: { text: "d" },
  },
  {
    time: 1675759501410,
    author: { username: "Sans" },
    message: { text: "csfsdf" },
  },
  {
    time: 1675759501574,
    author: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759501999,
    author: { username: "Sans" },
    message: { text: "sdf" },
  },
  {
    time: 1675759502141,
    author: { username: "Sans" },
    message: { text: "sd" },
  },
  {
    time: 1675759502269,
    author: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759502416,
    author: { username: "Sans" },
    message: { text: "f" },
  },
  {
    time: 1675759502557,
    author: { username: "Sans" },
    message: { text: "sf" },
  },
  {
    time: 1675759502708,
    author: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759502866,
    author: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759503008,
    author: { username: "Sans" },
    message: { text: "df" },
  },
  {
    time: 1675759503191,
    author: { username: "Sans" },
    message: { text: "sf" },
  },
  {
    time: 1675759503341,
    author: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759503472,
    author: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759503624,
    author: { username: "Sans" },
    message: { text: "f" },
  },
  {
    time: 1675759503724,
    author: { username: "Sans" },
    message: { text: "s" },
  },
];

const comments2 = [
  {
    time: 1675759511574,
    author: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759511999,
    author: { username: "Sans" },
    message: { text: "sdf" },
  },
  {
    time: 1675759512141,
    author: { username: "Sans" },
    message: { text: "sd" },
  },
  {
    time: 1675759512269,
    author: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759512416,
    author: { username: "Sans" },
    message: { text: "f" },
  },
  {
    time: 1675759512557,
    author: { username: "Sans" },
    message: { text: "sf" },
  },
  {
    time: 1675759512708,
    author: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759512866,
    author: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759513008,
    author: { username: "Sans" },
    message: { text: "df" },
  },
  {
    time: 1675759513191,
    author: { username: "Sans" },
    message: { text: "sf" },
  },
  {
    time: 1675759513341,
    author: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759513472,
    author: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759513624,
    author: { username: "Sans" },
    message: { text: "f" },
  },
];

const Test = () => {
  const [currentComments, setCurrentComments] = useState<TCommentInfo[] | []>([]);
  const [commentsDelay, setCommentsDelay] = useState<TCommentInfo[] | []>(comments);
  const videoTime = 1675759497647;
  const [currentTime, setCurrentTime] = useState(videoTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [toggleTimer, setToggleTimer] = useState(true);
  const targetTime = 1675759501574;

  const index = comments.findIndex(({ time }) => time > targetTime);
  const previous5Comments = comments.slice(
    index - 5 > 0 ? index - 5 : 0,
    index
  );
  // useEffect(() => {
  //   if (toggleTimer) {
  //     timerRef.current = setInterval(() => {
  //       setCurrentTime((prev) => prev + 200);
  //     }, 200);
  //   }

  //   return () => {
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current);
  //     }
  //   };
  // }, [toggleTimer]);

  // useEffect(() => {
  //   //  沒有待加入的留言則清除 timer 並將暫存的 timerId 刪除

  //   if (!commentsDelay.length) return;
  //   let copyCommentsDelay = _.cloneDeep(commentsDelay);

  //   const [comment] = copyCommentsDelay;

  //   if (comment.time > currentTime) return;

  //   copyCommentsDelay.shift();

  //   setCurrentComments((prev) => [...prev, comment]);
  //   setCommentsDelay((prev) => {
  //     const [_, ...newComments] = prev;
  //     return newComments;
  //   });
  // }, [commentsDelay, currentTime]);

  return (
    <Container>
      <Button onClick={() => setToggleTimer((prev) => !prev)}>
        {toggleTimer ? "STOP" : "START"}
      </Button>
      <Button
        onClick={() => setCommentsDelay((prev) => [...prev, ...comments2])}
      >
        ADD COMMENTS
      </Button>
      <Timer>{currentTime}</Timer>
      <Comments>
        {currentComments.map(({ time, author, message }, index) => (
          <div key={`${index}`}>
            {time} {author.username} {message.text}
          </div>
        ))}
      </Comments>
    </Container>
  );
};

export default Test;
