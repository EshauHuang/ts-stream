import * as _ from "lodash-es";
import { genStreamKey } from "../utils/streamKey.js";
import { genSalt, hashPassword, checkPassword } from "../utils/password.js";

export class Video {
  constructor(videos) {
    if (videos) {
      const videosClone = _.cloneDeep(videos);

      Object.entries(videosClone).forEach(([key, value]) => {
        this[key] = value;
      });

      Object.defineProperty(this, "length", {
        value: Object.keys(videosClone).length,
        writable: true,
        enumerable: false,
        configurable: false,
      });
    } else {
      Object.defineProperty(this, "length", {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: false,
      });
    }
  }

  newVideoId() {
    const id = this.length + 1;
    this.length++;

    return id;
  }

  createVideo(id, video) {
    this[id] = video;

    return id;
  }

  getVideo(id) {
    const { comments, startTime, author } = this[id];

    const user = usersTable.findUser(author);

    const { username, avatar, email, subscribes } = user;

    return {
      ...this[id],
      user: {
        username,
        avatar,
        email,
        subscribes,
      },
      comments: comments.getNextComments(startTime),
    };
  }

  getVideoComments(id, startTime, mode) {
    if (!this[id]) return;

    const { comments } = this[id];

    if (!comments || !startTime) return;

    switch (mode) {
      case 1:
        return comments.getNextComments(startTime);
      case -1:
        return comments.getPreviousComments(startTime);
      default:
        return [];
    }
  }

  addLike(videoId) {
    const video = this[videoId];

    if (!video) return -1;

    video.like++;

    return video.like;
  }

  reduceLike(videoId) {
    const video = this[videoId];

    if (!video) return -1;

    video.like--;

    return video.like;
  }

  addDislike(videoId) {
    const video = this[videoId];

    if (!video) return -1;

    video.dislike++;

    return video.dislike;
  }

  reduceDislike(videoId) {
    const video = this[videoId];

    if (!video) return -1;

    video.dislike--;

    return video.dislike;
  }
}

export class Comments {
  constructor() {
    Object.defineProperty(this, "length", {
      value: 0,
      writable: true,
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(this, "createTime", {
      value: Date.now(),
      writable: true,
      enumerable: false,
      configurable: false,
    });
  }

  addComment(user, text) {
    if (!user || !text) return;

    const comment = {
      time: new Date().getTime(),
      user,
      message: {
        text,
      },
    };
    this[this.length + 1] = comment;
    this.length++;

    return comment;
  }

  addFakeComment(time, user, message) {
    if (!time || !user || !message) return;

    const comment = {
      time,
      user,
      message,
    };
    this[this.length + 1] = comment;
    this.length++;

    return comment;
  }

  searchComments() {
    return this;
  }

  getPreviousComments(targetTime, limit = 10) {
    const commentsArray = Object.values(this);

    const index = commentsArray.findIndex(
      (comment) => comment.time > targetTime
    );
    const previousCommentIndex = index - limit;
    const previousComments = commentsArray.slice(
      previousCommentIndex > 0 ? previousCommentIndex : 0,
      index
    );

    return previousComments;
  }

  getNextComments(targetTime, limit = 10) {
    const commentsArray = Object.values(this);
    const commentsCount = commentsArray.length;

    const index = commentsArray.findIndex(
      (comment) => comment.time > targetTime
    );

    const nextCommentIndex = index + limit;
    const nextComments = commentsArray.slice(
      index,
      nextCommentIndex > commentsCount ? commentsCount : nextCommentIndex
    );

    return nextComments;
  }

  filterCommentsByStartTime(startTime) {
    const comments = Object.values(this).filter((comment) => {
      return comment.time > Number(startTime);
    });

    return comments;
  }

  sliceComments(startTime, limit = 10) {
    return this.filterCommentsByStartTime(startTime).slice(0, limit);
  }
}

export class Users {
  constructor() {
    this.length = 0;
    this.createTime = Date.now();
  }

  addUser(socketId, user) {
    if (!socketId || !user) return;
    this[socketId] = user;
    this.length++;
  }

  removeUser(socketId) {
    if (!socketId || !this[socketId]) return;
    delete this[socketId];
    this.length--;
  }
}

export class Rooms {
  constructor() {
    this.length = 0;
  }

  addRoom(room) {
    if (this[room]) return;
    this[room] = {
      users: new Users(),
      comments: new Comments(),
    };
    this.length++;
  }

  initialRoom(room) {
    if (!this[room]) return;
    this[room] = {
      users: new Users(),
      comments: new Comments(),
    };
  }

  removeRoom(room) {
    if (!this[room]) return;
    delete this[room];

    this.length--;
  }

  addUserToRoom(room, socketId, user) {
    if (!room || !socketId || !user) return;
    if (!this[room] || !this[room].users) return;
    this[room].users.addUser(socketId, user);
  }

  removeUserFromRoom(room, socketId) {
    if (!room || !socketId) return;
    if (!this[room] || !this[room].users) return;
    this[room].users.removeUser(socketId);
  }

  addCommentToRoom(room, message, socketId) {
    if (!room || !message || !socketId) return;
    const user = this.searchUserFromRoom(room, socketId);

    if (!this[room] || !this[room].comments) return;
    const comment = this[room].comments.addComment(user, message);
    return comment;
  }

  searchRoomComments(room) {
    if (!this[room]) return;
    return this[room].comments.searchComments();
  }

  searchUserFromRoom(room, socketId) {
    if (!room || !socketId) return;
    if (!this[room] || !this[room].users) return;

    return this[room].users[socketId];
  }
}

// 儲存每個用戶的資訊
export const usersTable = [
  {
    id: 1,
    username: "user01",
    streamKey: "U2FsdGVkX1__fd2ANVT33jYDE4shKW1l5lzgRRafZN4=",
    avatar: "/images/avatar/user01.jpg",
    email: "123@gmail.com",
    subscribes: 200,
    likeVideoList: [],
    dislikeVideoList: [],
    subscribeList: [],
    videos: {
      1: {
        // 關聯到 siteVideosID
      },
      length: 1,
      addVideo(video) {
        const index = this.length + 1;
        this[index] = video;
        this.length++;

        return { [index]: this[index] };
      },
    },
    stream: {
      isStreamOn: false,
      type: "stream",
      author: "user01",
      title: "user01 的直播間",
      content: `本家様：
あの夏が飽和する。2020ver. / 鏡音レン・リン
https://youtu.be/2hz0lhAs0Kg
あの夏が飽和する。/鏡音レン・リン
https://youtu.be/mKaRxty1j7g

歌：天音かなた
https://twitter.com/amanekanatach

イラスト：つむみ
https://twitter.com/kandumesss

動画：ろりー / Roly
https://twitter.com/yosinO_mo

MIX：mutuëmon
https://twitter.com/mutuemon

Inst：山本こーすけ
https://twitter.com/kousuke_as


※歌ってみた動画です


※ホロライブプロダクションから未成年の視聴者の方々へのお願い
下記リンクをご確認の上、お楽しみください。
https://www.hololive.tv/request-to-mi...
`,
      thumbnail: "",
      videoId: "",
      startTime: "",
      like: 4155,
      dislike: 0,
    },
  },
  {
    id: 2,
    username: "123",
    password: "$2b$10$J251lEpX3LI8UpxxIuXMiugtELV71EL4gO2bfHyMtUtPI2B4taNJu",
    streamKey: "U2FsdGVkX194rC63kIDq6ePffAq_cif1QEb1RcHnimk=",
    avatar: "/images/avatar/123.jpg",
    email: "123@gmail.com",
    subscribes: 500,
    likeVideoList: [],
    dislikeVideoList: [],
    subscribeList: [],
    videos: {
      1: {
        // 關聯到 siteVideosID
      },
      length: 1,
      addVideo(video) {
        const index = this.length + 1;
        this[index] = video;
        this.length++;

        return { [index]: this[index] };
      },
    },
    stream: {
      isStreamOn: false,
      author: "123",
      type: "stream",
      title: "123 的直播間",
      thumbnail: "images/1.jpg",
      content: `本家様：
あの夏が飽和する。2020ver. / 鏡音レン・リン
https://youtu.be/2hz0lhAs0Kg
あの夏が飽和する。/鏡音レン・リン
https://youtu.be/mKaRxty1j7g

歌：天音かなた
https://twitter.com/amanekanatach

イラスト：つむみ
https://twitter.com/kandumesss

動画：ろりー / Roly
https://twitter.com/yosinO_mo

MIX：mutuëmon
https://twitter.com/mutuemon

Inst：山本こーすけ
https://twitter.com/kousuke_as


※歌ってみた動画です


※ホロライブプロダクションから未成年の視聴者の方々へのお願い
下記リンクをご確認の上、お楽しみください。
https://www.hololive.tv/request-to-mi...
`,
      thumbnail: "",
      videoId: "",
      startTime: "",
      like: 415,
      dislike: 0,
    },
  },
];

usersTable.initialRoom = function (username) {
  const user = this.findUser(username);

  if (user) {
    user.stream = {
      ...user.stream,
      isStreamOn: false,
      startTime: "",
      like: 0,
      dislike: 0,
      videoId: "",
    };
  }
};

usersTable.generateNewUser = async function (username, password, email) {
  const streamKey = genStreamKey(username);
  const salt = genSalt();
  const passwordHash = hashPassword(password, salt);
  const newUser = {
    id: this.length,
    username,
    password: passwordHash,
    streamKey: streamKey,
    subscribes: 0,
    email,
    videos: {
      length: 0,
      addVideo(video) {
        const index = this.length + 1;
        this[index] = video;
        this.length++;

        return { [index]: this[index] };
      },
    },
    dislikeVideoList: [],
    likeVideoList: [],
    subscribeList: [],
    stream: {
      isStreamOn: false,
      type: "stream",
      author: username,
      title: `${username} 的直播間`,
      thumbnail: "",
      content: "",
      startTime: "",
      like: 0,
      dislike: 0,
    },
  };

  this.push(newUser);

  return {
    username,
    email,
  };
};

usersTable.checkLikeVideoExist = function (username, videoId) {
  const user = this.findUser(username);

  if (!user) return false;

  return user.likeVideoList.find((id) => id === videoId);
};

usersTable.checkDislikeVideoExist = function (username, videoId) {
  const user = this.findUser(username);

  if (!user) return false;

  return user.dislikeVideoList.find((id) => id === videoId);
};

usersTable.findUser = function (username) {
  return this.find((user) => user.username === username);
};

usersTable.getUser = function (username) {
  const user = this.findUser(username);

  if (user) {
    const { streamKey, password, stream, ...userData } = user;

    return {
      user: userData,
      stream,
    };
  }

  return {};
};

usersTable.addLikeVideoToList = function (username, videoId) {
  if (!username || !videoId) return;
  const user = this.findUser(username);

  const isLikeVideoExist = usersTable.checkLikeVideoExist(username, videoId);
  if (!isLikeVideoExist) {
    user.likeVideoList.push(videoId);
  }
  return user.likeVideoList;
};

usersTable.removeLikeVideoFromList = function (username, videoId) {
  if (!username || !videoId) return;
  const user = this.findUser(username);

  const isLikeVideoExist = usersTable.checkLikeVideoExist(username, videoId);
  if (isLikeVideoExist) {
    user.likeVideoList = user.likeVideoList.filter((id) => id !== videoId);
  }
  return user.likeVideoList;
};

usersTable.addLike = function (username) {
  const user = this.find((user) => user.username === username);

  if (!user) return -1;

  user.stream.like++;

  return user.stream.like;
};

usersTable.reduceLike = function (username) {
  const user = this.find((user) => user.username === username);

  if (!user) return -1;

  user.stream.like--;

  return user.stream.like;
};

usersTable.addDislikeVideoToList = function (username, videoId) {
  if (!username || !videoId) return;
  const user = this.findUser(username);

  const isDislikeVideoExist = usersTable.checkDislikeVideoExist(
    username,
    videoId
  );
  if (!isDislikeVideoExist) {
    user.dislikeVideoList.push(videoId);
  }
  return user.dislikeVideoList;
};

usersTable.removeDislikeVideoFromList = function (username, videoId) {
  if (!username || !videoId) return;
  const user = this.findUser(username);

  const isDislikeVideoExist = usersTable.checkDislikeVideoExist(
    username,
    videoId
  );
  if (isDislikeVideoExist) {
    user.dislikeVideoList = user.dislikeVideoList.filter(
      (id) => id !== videoId
    );
  }

  return user.dislikeVideoList;
};

usersTable.addDislike = function (username) {
  const user = this.find((user) => user.username === username);

  if (!user) return -1;

  user.stream.dislike++;

  return user.stream.dislike;
};

usersTable.reduceDislike = function (username) {
  const user = this.find((user) => user.username === username);

  if (!user) return -1;

  user.stream.dislike--;

  return user.stream.dislike;
};

usersTable.verifyUser = function (username, password) {
  const user = this.find((user) => {
    if (user.username === username) {
      const result = checkPassword(password, user.password);
      return result;
    }
  });

  if (!user) return null;

  return {
    username: user.username,
    email: user.email,
  };
};

usersTable.getMe = function (username) {
  const user = usersTable.find((user) => user.username === username);
  const { password, stream, ...userData } = user;

  return {
    user: userData,
    stream,
  };
};

usersTable.getStream = function (username) {
  const user = usersTable.find((user) => user.username === username);
  const { avatar, subscribes, stream } = user;

  return {
    user: {
      avatar,
      subscribes,
      username,
    },
    stream,
  };
};

usersTable.editUserMeta = function (username, options) {
  const user = usersTable.find((user) => user.username === username);

  Object.entries(options).forEach(([key, value]) => {
    if (Object.prototype.toString.call(value) === "[object Object]") {
      user[key] = {
        ...user[key],
        ...value,
      };
    } else {
      user[key] = value;
    }
  });

  return options;
};

usersTable.getStreamThumbnail = function (username) {
  const user = usersTable.find((user) => user.username === username);

  if (!user) return "";

  return user.stream.thumbnail;
};

usersTable.editStreamThumbnail = function (username) {
  const user = usersTable.find((user) => user.username === username);

  if (!user) return "";

  user.stream.thumbnail = `/streams/${username}/thumbnail`;

  return `/streams/${username}/thumbnail`;
};

usersTable.refreshStreamKey = function (username) {
  const user = usersTable.find((user) => user.username === username);
  const streamKey = genStreamKey(username);

  user.streamKey = streamKey;

  return streamKey;
};

usersTable.addSubscribeToList = function (currentUsername, subscribeUsername) {
  const currentUser = this.findUser(currentUsername);

  if (!currentUser) return [];

  const isSubscribe = !!currentUser.subscribeList.find(
    (username) => username === subscribeUsername
  );

  if (!isSubscribe) {
    currentUser.subscribeList.push(subscribeUsername);
  }

  return currentUser.subscribeList;
};

usersTable.removeSubscribeFromList = function (
  currentUsername,
  subscribeUsername
) {
  const currentUser = this.findUser(currentUsername);

  if (!currentUser) return [];

  const isSubscribe = !!currentUser.subscribeList.find(
    (username) => username === subscribeUsername
  );

  if (isSubscribe) {
    currentUser.subscribeList = currentUser.subscribeList.filter(
      (username) => username !== subscribeUsername
    );
  }

  return currentUser.subscribeList;
};
