import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash-es";

import { IComment } from "@/contexts/commentsContext";
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
    user: { username: "Sans" },
    message: { text: "asd" },
  },
  {
    time: 1675759497786,
    user: { username: "Sans" },
    message: { text: "asd" },
  },
  {
    time: 1675759498151,
    user: { username: "Sans" },
    message: { text: "asdas" },
  },
  {
    time: 1675759498217,
    user: { username: "Sans" },
    message: { text: "d" },
  },
  {
    time: 1675759498330,
    user: { username: "Sans" },
    message: { text: "a" },
  },
  {
    time: 1675759498456,
    user: { username: "Sans" },
    message: { text: "da" },
  },
  {
    time: 1675759498557,
    user: { username: "Sans" },
    message: { text: "sd" },
  },
  {
    time: 1675759498662,
    user: { username: "Sans" },
    message: { text: "adfadadadsa" },
  },
  {
    time: 1675759498762,
    user: { username: "Sans" },
    message: { text: "d" },
  },
  {
    time: 1675759498780,
    user: { username: "Sans" },
    message: { text: "BBBBBBB" },
  },
  {
    time: 1675759499006,
    user: { username: "Sans" },
    message: { text: "d" },
  },
  {
    time: 1675759499106,
    user: { username: "Sans" },
    message: { text: "a" },
  },
  {
    time: 1675759499211,
    user: { username: "Sans" },
    message: { text: "d" },
  },
  {
    time: 1675759501410,
    user: { username: "Sans" },
    message: { text: "csfsdf" },
  },
  {
    time: 1675759501574,
    user: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759501999,
    user: { username: "Sans" },
    message: { text: "sdf" },
  },
  {
    time: 1675759502141,
    user: { username: "Sans" },
    message: { text: "sd" },
  },
  {
    time: 1675759502269,
    user: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759502416,
    user: { username: "Sans" },
    message: { text: "f" },
  },
  {
    time: 1675759502557,
    user: { username: "Sans" },
    message: { text: "sf" },
  },
  {
    time: 1675759502708,
    user: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759502866,
    user: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759503008,
    user: { username: "Sans" },
    message: { text: "df" },
  },
  {
    time: 1675759503191,
    user: { username: "Sans" },
    message: { text: "sf" },
  },
  {
    time: 1675759503341,
    user: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759503472,
    user: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759503624,
    user: { username: "Sans" },
    message: { text: "f" },
  },
  {
    time: 1675759503724,
    user: { username: "Sans" },
    message: { text: "s" },
  },
];

const comments2 = [
  {
    time: 1675759511574,
    user: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759511999,
    user: { username: "Sans" },
    message: { text: "sdf" },
  },
  {
    time: 1675759512141,
    user: { username: "Sans" },
    message: { text: "sd" },
  },
  {
    time: 1675759512269,
    user: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759512416,
    user: { username: "Sans" },
    message: { text: "f" },
  },
  {
    time: 1675759512557,
    user: { username: "Sans" },
    message: { text: "sf" },
  },
  {
    time: 1675759512708,
    user: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759512866,
    user: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759513008,
    user: { username: "Sans" },
    message: { text: "df" },
  },
  {
    time: 1675759513191,
    user: { username: "Sans" },
    message: { text: "sf" },
  },
  {
    time: 1675759513341,
    user: { username: "Sans" },
    message: { text: "s" },
  },
  {
    time: 1675759513472,
    user: { username: "Sans" },
    message: { text: "fs" },
  },
  {
    time: 1675759513624,
    user: { username: "Sans" },
    message: { text: "f" },
  },
];

const Test = () => {
  const [currentComments, setCurrentComments] = useState<IComment[] | []>([]);
  const [commentsDelay, setCommentsDelay] = useState<IComment[] | []>(comments);
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
  console.log(comments[index]);
  console.log({ previous5Comments });
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
        {currentComments.map(({ time, user, message }, index) => (
          <div key={`${index}`}>
            {time} {user.username} {message.text}
          </div>
        ))}
      </Comments>
    </Container>
  );
};

export default Test;
