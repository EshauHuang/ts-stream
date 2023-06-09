import * as _ from "lodash-es";
import { copyFile, constants } from "node:fs/promises";

import { usersDir } from "../utils/toAbsolute";
import { genStreamKey } from "../utils/streamKey.js";
import { genSalt, hashPassword, checkPassword } from "../utils/password";
import checkDirectory from "../utils/checkDirectory";
import generateDirectory from "../utils/generateDirectory";

type TResponseVideoAuthorInfo = {
  avatar: string,
  subscribes: number,
  username: string,
}

type TShowVideoInfo = TVideoInfo & {
  comments: TCommentInfo[];
}

export type TAuthorInfo = {
  username: string;
}

interface TCommentInfo {
  time: number;
  author: TAuthorInfo
  message: {
    text: string;
  }
}

interface IComment {
  comments: TCommentInfo[];
  length: number;
  createTime: number;
  addComment(author: TAuthorInfo, message: string): TCommentInfo | {};
  searchComments(): TCommentInfo[];
  getPreviousComments(targetTime: number | string, limit?: number): TCommentInfo[];
  getNextComments(targetTime: number | string, limit?: number): TCommentInfo[];
  filterCommentsByStartTime(startTime: number | string): TCommentInfo[];
  sliceComments(startTime: number | string, limit: number): TCommentInfo[];
}

type TVideoInfo = {
  type: string;
  title: string;
  author: {
    username: string;
    nickname: string;
    avatar: string;
  }
  content: string;
  thumbnail: string;
  startTime: number;
  videoId: string;
  like: number;
  dislike: number;
}

type TVideoInfoIncludeComments = TVideoInfo & {
  comments: IComment;
}

interface IVideo {
  videos: {
    [key: string]: TVideoInfoIncludeComments;
  }
  length: number;
  newVideoId(): string;
  createVideo(videoId: number | string, video: TVideoInfoIncludeComments): string;
  getVideo(videoId: number | string): {
    video: TShowVideoInfo;
    user: TResponseVideoAuthorInfo;
  };
  getVideos(page: number, limit: number): TVideoInfo[];
  getVideoComments(id: number | string, startTime: number | string, mode: number): TCommentInfo[];
  addLike(videoId: number | string): number;
  reduceLike(videoId: number | string): number;
  addDislike(videoId: number | string): number;
  reduceDislike(videoId: number | string): number;
}

export class Video implements IVideo {
  constructor(public videos: {
    [key: string]: TVideoInfoIncludeComments
  } = {}) { }

  get length() {
    return Object.keys(this.videos).length
  }

  newVideoId() {
    const id = this.length + 1;

    return id.toString();
  }

  createVideo(videoId: number | string, video: TVideoInfoIncludeComments) {
    videoId = videoId.toString();

    this.videos = {
      ...this.videos,
      [videoId]: video
    }

    return videoId;
  }

  getVideo(videoId: number | string) {
    videoId = videoId.toString();

    const { comments, startTime, author } = this.videos[videoId];

    const user = usersTable.findUser(author.username);

    const { username, avatar, subscribes } = user || {};

    return {
      user: {
        avatar,
        subscribes,
        username,
      },
      video: { ...this.videos[videoId], comments: comments.getNextComments(startTime) },
    };
  }

  getVideos(page: number, limit: number) {
    const start = (page - 1) * limit;
    const end = page * limit;

    return Object.entries(this.videos)
      .slice(start, end)
      .map(([id, video]) => {
        const { comments, ...videoInfo } = video;

        return ({
          id,
          ...videoInfo,
        })
      });

  }

  getVideoComments(id: number | string, startTime: number | string, mode: number) {
    id = Number(id);

    if (isNaN(id)) {
      throw new Error("Invalid id!")
    }

    if (!this.videos[id]) {
      throw new Error("Can't find the video!");
    };

    const { comments } = this.videos[id];

    switch (mode) {
      case 1:
        return comments.getNextComments(startTime);
      case -1:
        return comments.getPreviousComments(startTime);
      default:
        return [];
    }
  }

  addLike(videoId: number | string) {
    videoId = videoId.toString();

    const video = this.videos[videoId];

    if (!video) return -1;

    video.like++;

    return video.like;
  }

  reduceLike(videoId: number | string) {
    videoId = videoId.toString();

    const video = this.videos[videoId];

    if (!video) return -1;

    video.like--;

    return video.like;
  }

  addDislike(videoId: number | string) {
    videoId = videoId.toString();

    const video = this.videos[videoId];

    if (!video) return -1;

    video.dislike++;

    return video.dislike;
  }

  reduceDislike(videoId: number | string) {
    videoId = videoId.toString();

    const video = this.videos[videoId];

    if (!video) return -1;

    video.dislike--;

    return video.dislike;
  }
}

export class Comments implements IComment {
  public createTime: number

  constructor(public comments: TCommentInfo[] = []) {
    this.createTime = Date.now();
  }

  get length() {
    return this.comments.length
  }

  addComment(author: TAuthorInfo, text: string) {
    if (!author || !text) return {};
    const comment = {
      time: new Date().getTime(),
      author,
      message: {
        text,
      },
    }
    this.comments = [...this.comments, comment];

    return comment;
  }

  searchComments() {
    return this.comments
  }

  getPreviousComments(targetTime: number | string, limit: number = 10) {
    let time: number

    if (typeof targetTime === "string") {
      time = Number(targetTime)
    } else {
      time = targetTime
    }

    const commentsArray = this.comments

    const index = commentsArray.findIndex(
      (comment) => comment.time > time
    );
    const previousCommentIndex = index - limit;
    const previousComments = commentsArray.slice(
      previousCommentIndex > 0 ? previousCommentIndex : 0,
      index
    );

    return previousComments;
  }

  getNextComments(targetTime: number | string, limit: number = 10) {
    let time: number

    if (typeof targetTime === "string") {
      time = Number(targetTime)
    } else {
      time = targetTime
    }

    const commentsArray = this.comments
    const commentsCount = commentsArray.length;

    const index = commentsArray.findIndex(
      (comment) => comment.time > time
    );

    const nextCommentIndex = index + limit;
    const nextComments = commentsArray.slice(
      index,
      nextCommentIndex > commentsCount ? commentsCount : nextCommentIndex
    );

    return nextComments;
  }

  filterCommentsByStartTime(startTime: number | string) {
    let time: number

    if (typeof startTime === "string") {
      time = Number(startTime)
    } else {
      time = startTime
    }

    return this.comments.filter((comment) => comment.time > time);;
  }

  sliceComments(startTime: number | string, limit = 10) {
    let time: number

    if (typeof startTime === "string") {
      time = Number(startTime)
    } else {
      time = startTime
    }

    return this.filterCommentsByStartTime(time).slice(0, limit);
  }
}


type TSocketUserInfo = {
  username: string;
}

type ISocketUsers = {
  users: {
    [key: string]: TSocketUserInfo;
  }
  createTime: number;
  length: number;
  addUser(socketId: string, user: TSocketUserInfo): void;
  removeUser(socketId: string): void;
}

export class SocketUser implements ISocketUsers {
  createTime: number;

  constructor(public users: { [key: string]: TSocketUserInfo; } = {}) {
    this.createTime = Date.now();
  }

  get length() {
    return Object(this.users).length;
  }

  addUser(socketId: string, user: TSocketUserInfo) {
    if (!socketId || !user) {
      throw new Error("Socket id or user was empty!");
    };
    this.users[socketId] = user;
  }

  removeUser(socketId: string) {
    if (!socketId || !this.users[socketId]) return;

    delete this.users[socketId];
  }
}

type TRoomInfo = {
  [socketId: string]: {
    users: ISocketUsers;
    comments: IComment;
  }
}

interface IRooms {
  rooms: TRoomInfo;
  length: number;
  addRoom(room: string): void;
  initialRoom(room: string): void;
  removeRoom(room: string): void;
  addUserToRoom(room: string, socketId: string, author: TAuthorInfo): void;
  removeUserFromRoom(room: string, socketId: string): void;
  addCommentToRoom(room: string, message: string, socketId: string): TCommentInfo | {};
  searchRoomComments(room: string): TCommentInfo[];
  searchUserFromRoom(room: string, socketId: string): TSocketUserInfo;
}

export class Rooms implements IRooms {
  constructor(public rooms: TRoomInfo = {}) { }

  get length() {
    return Object.keys(this.rooms).length;
  }

  addRoom(room: string) {
    if (this.rooms[room]) return;
    this.rooms[room] = {
      users: new SocketUser(),
      comments: new Comments(),
    };
  }

  initialRoom(room: string) {
    if (!this.rooms[room]) return;
    this.rooms[room] = {
      users: new SocketUser(),
      comments: new Comments(),
    };
  }

  removeRoom(room: string) {
    if (!this.rooms[room]) return;
    delete this.rooms[room];
  }

  addUserToRoom(room: string, socketId: string, author: TAuthorInfo) {
    console.log("addUserToRoom", room, socketId, author);
    if (!room || !socketId || !author) return;
    if (!this.rooms[room] || !this.rooms[room].users) return;
    this.rooms[room].users.addUser(socketId, author);
    console.log(this.rooms[room].users.users);
  }

  removeUserFromRoom(room: string, socketId: string) {
    if (!room || !socketId) return;
    if (!this.rooms[room] || !this.rooms[room].users) return;
    this.rooms[room].users.removeUser(socketId);
  }

  addCommentToRoom(room: string, message: string, socketId: string) {
    if (!room || !message || !socketId) {
      throw new Error("Room, message or socket id was empty!")
    };

    const author = this.searchUserFromRoom(room, socketId);

    if (!this.rooms[room] || !this.rooms[room].comments || !author) {
      throw new Error("Didn't found Room, comments or author!");
    };

    const comment = this.rooms[room].comments.addComment(author, message);

    return comment;
  }

  searchRoomComments(room: string) {
    if (!this.rooms[room]) {
      throw new Error("Didn't found Room!");
    };

    return this.rooms[room].comments.searchComments();
  }

  searchUserFromRoom(room: string, socketId: string) {
    if (!room || !socketId) {
      throw new Error("Room or socket id was empty!")
    };

    if (!this.rooms[room] || !this.rooms[room].users) {
      throw new Error("Didn't found Room or users!");
    };

    return this.rooms[room].users.users[socketId];
  }
}

type TMemberInfo = {
  id: number;
  username: string;
  password: string;
  streamKey: string;
  avatar: string;
  subscribes: number;
  email: string;
  videos: IVideo;
  dislikeVideoList: string[];
  likeVideoList: string[];
  subscribeList: string[];
}

type TMemberStreamInfo = {
  videoId: string;
  isStreamOn: boolean;
  type: string;
  author: {
    username: string;
    nickname: string;
    avatar: string;
  };
  title: string;
  thumbnail: string;
  content: string;
  startTime: string;
  like: number;
  dislike: number;
}

type TCompleteMemberInfo = TMemberInfo & {
  [key: string]: any;
  stream: TMemberStreamInfo
}

type TVisibleMemberInfo = Omit<TMemberInfo, "password">

type TResponseMemberInfo = {
  user: TVisibleMemberInfo, stream: TMemberStreamInfo
}

interface IMembers {
  length: number;
  members: TCompleteMemberInfo[];
  initialRoom(username: string): void;
  findUser(username: string): TCompleteMemberInfo | undefined;
  generateNewUser(username: string, password: string, email: string): Promise<TResponseMemberInfo | {}>;
  checkLikeVideoExist(username: string, videoId: number | string): boolean;
  checkDislikeVideoExist(username: string, videoId: number | string): boolean;
  getUser(username: string): TResponseMemberInfo | {};
  addLikeVideoToList(username: string, videoId: number | string): string[];
  removeLikeVideoFromList(username: string, videoId: number | string): string[];
  addDislikeVideoToList(username: string, videoId: number | string): string[];
  removeDislikeVideoFromList(username: string, videoId: number | string): string[];
  addLike(username: string): number;
  reduceLike(username: string): number;
  addDislike(username: string): number;
  reduceDislike(username: string): number;
  verifyUser(username: string, password: string): TResponseMemberInfo | null;
  getMe(username: string): TResponseMemberInfo | {};
  getStream(username: string): {
    user: TResponseVideoAuthorInfo,
    stream: TMemberStreamInfo;
  } | {};

  // options 的型別應該定義的更清楚(或許可以使用 ReturnType)
  editUserMeta(username: string, options: {
    stream: TMemberStreamInfo;
  }): {
    stream: TMemberStreamInfo
  } | {};
  getStreamThumbnail(username: string): string;
  editStreamThumbnail(username: string): string;
  refreshStreamKey(username: string): string;
  getStreamThumbnail(username: string): string;
  addSubscribeToList(currentUsername: string, subscribeUsername: string): string[];
  removeSubscribeFromList(currentUsername: string, subscribeUsername: string): string[];
}

class Members implements IMembers {
  constructor(public members: TCompleteMemberInfo[] = []) { }

  get length(): number {
    return this.members.length;
  }

  initialRoom(username: string) {
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

  findUser(username: string) {
    return this.members.find((user: TCompleteMemberInfo) => user.username === username);
  };

  async generateNewUser(username: string, password: string, email: string) {
    const streamKey = genStreamKey(username);
    const salt = genSalt();
    const passwordHash = hashPassword(password, salt);
    const newUser: TCompleteMemberInfo = {
      id: this.length,
      username,
      password: passwordHash,
      streamKey: streamKey,
      avatar: `/users/${username}/avatar`,
      subscribes: 0,
      email,
      videos: new Video(),
      dislikeVideoList: [],
      likeVideoList: [],
      subscribeList: [],
      stream: {
        videoId: this.length.toString(),
        isStreamOn: false,
        type: "stream",
        author: {
          username,
          nickname: username,
          avatar: `/users/${username}/avatar`,
        },
        title: `${username} 的直播間`,
        thumbnail: `/streams/${username}/thumbnail`,
        content: "",
        startTime: "",
        like: 0,
        dislike: 0,
      },
    };

    try {
      const userDir = `${usersDir}/${username}`;
      const defaultAvatar = `${usersDir}/default/avatar.jpg`;
      const defaultThumbnail = `${usersDir}/default/thumbnail.jpg`;

      if (!await checkDirectory(userDir)) {
        await generateDirectory(userDir);
      }
      await copyFile(
        defaultAvatar,
        `${userDir}/avatar.jpg`
      );
      await copyFile(
        defaultThumbnail,
        `${userDir}/thumbnail.jpg`
      );
    } catch (error) {
      console.log("error", error);

      return {};
    }

    this.members.push(newUser);
    const { password: currentPassword, stream, ...userData } = newUser;

    return {
      user: userData,
      stream,
    };
  };

  checkLikeVideoExist(username: string, videoId: number | string) {
    videoId = videoId.toString();
    const user = this.findUser(username);

    return !!(user && user.likeVideoList.find((id: string) => id === videoId));
  };

  checkDislikeVideoExist(username: string, videoId: number | string) {
    videoId = videoId.toString();
    const user = this.findUser(username);

    return !!(user && user.dislikeVideoList.find((id: any) => id === videoId));
  };

  getUser(username: string) {
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

  addLikeVideoToList(username: string, videoId: number | string) {
    videoId = videoId.toString();

    if (!username || !videoId) return [];

    const user = this.findUser(username);

    if (!user) return [];

    const isLikeVideoExist = this.checkLikeVideoExist(username, videoId);

    if (!isLikeVideoExist) {
      user.likeVideoList.push(videoId);
    }
    return user.likeVideoList;
  };

  removeLikeVideoFromList(username: string, videoId: number | string) {
    videoId = videoId.toString();

    if (!username || !videoId) return [];

    const user = this.findUser(username);

    if (!user) return [];

    const isLikeVideoExist = this.checkLikeVideoExist(username, videoId);

    if (isLikeVideoExist) {
      const index = user.likeVideoList.indexOf(videoId);
      // user.likeVideoList = user.likeVideoList.filter((id: any) => id !== videoId);
      user.likeVideoList.splice(index, 1);

    }
    return user.likeVideoList;
  };

  addDislikeVideoToList(username: string, videoId: number | string) {
    videoId = videoId.toString();

    if (!username || !videoId) return [];

    const user = this.findUser(username);

    if (!user) return [];

    const isDislikeVideoExist = this.checkDislikeVideoExist(
      username,
      videoId
    );

    if (!isDislikeVideoExist) {
      user.dislikeVideoList.push(videoId);
    }
    return user.dislikeVideoList;
  };

  removeDislikeVideoFromList(username: string, videoId: number | string) {
    videoId = videoId.toString();

    if (!username || !videoId) return [];

    const user = this.findUser(username);

    if (!user) return [];

    const isDislikeVideoExist = this.checkDislikeVideoExist(
      username,
      videoId
    );

    if (isDislikeVideoExist) {
      const index = user.dislikeVideoList.indexOf(videoId);
      user.dislikeVideoList.splice(index, 1);
    }

    return user.dislikeVideoList;
  };

  addLike(username: string) {
    const user = this.findUser(username);

    if (!user) return -1;

    user.stream.like++;

    return user.stream.like;
  };

  reduceLike(username: string) {
    const user = this.findUser(username);

    if (!user) return -1;

    user.stream.like--;

    return user.stream.like;
  };

  addDislike(username: string) {
    const user = this.findUser(username);

    if (!user) return -1;

    user.stream.dislike++;

    return user.stream.dislike;
  };

  reduceDislike(username: string) {
    const user = this.findUser(username);

    if (!user) return -1;

    user.stream.dislike--;

    return user.stream.dislike;
  };

  verifyUser(username: string, password: string) {
    // const user = this.find((user: any) => {
    //   if (user.username === username) {
    //     const result = checkPassword(password, user.password);
    //     return result;
    //   }
    // });
    const user = this.findUser(username);

    if (!user) return null;

    if (checkPassword(password, user.password)) {

      const { password: currentPassword, stream, ...userData } = user;

      return {
        user: userData,
        stream,
      };
    }

    return null;
  };

  getMe(username: string) {
    const user = this.findUser(username);

    if (!user) return {};

    const { password, stream, ...userData } = user;

    return {
      user: userData,
      stream,
    };
  };

  getStream(username: string) {
    const user = this.findUser(username);

    if (!user) return {};

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

  editUserMeta(username: string, options: {
    stream: TMemberStreamInfo;
  }) {
    const user = this.findUser(username);

    if (!user) return {};

    Object.entries(options).forEach(([key, value]: [string, object | string]) => {
      if (typeof value === "string") {
        user[key] = value;
      } else if (Object.prototype.toString.call(value) === "[object Object]") {
        user[key] = {
          ...user[key],
          ...value,
        };
      }
    });

    return options;
  };

  getStreamThumbnail(username: string) {
    const user = this.findUser(username);

    if (!user) return "";

    return user.stream.thumbnail;
  };

  editStreamThumbnail(username: string) {
    const user = this.findUser(username);

    if (!user) return "";

    user.stream.thumbnail = `/streams/${username}/thumbnail`;

    return `/streams/${username}/thumbnail`;
  };

  refreshStreamKey(username: string) {
    const user = this.findUser(username);

    if (!user) return "";

    const newStreamKey = genStreamKey(username);

    user.streamKey = newStreamKey;

    return newStreamKey;
  };

  addSubscribeToList(currentUsername: string, subscribeUsername: string) {
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

  removeSubscribeFromList(currentUsername: string, subscribeUsername: string) {
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
}

// 儲存每個用戶的資訊
export const usersTable: any = [
  {
    id: 1,
    username: "user01",
    nickname: "user01",
    password: "$2b$10$MA3UqIccGM04Jr8fhoH7TO2BApigmB4OIGJmGN.lNi4d3k2v4KcgK",
    streamKey: "U2FsdGVkX1__fd2ANVT33jYDE4shKW1l5lzgRRafZN4=",
    avatar: "/users/user01/avatar",
    email: "user01@gmail.com",
    subscribes: 200,
    likeVideoList: [],
    dislikeVideoList: [],
    subscribeList: [],
    videos: new Video(),
    stream: {
      isStreamOn: false,
      type: "stream",
      title: "user01 的直播間",
      content: "",
      thumbnail: "/streams/user01/thumbnail",
      videoId: "",
      startTime: "",
      like: 4155,
      dislike: 0,
      author: {
        username: "user01",
        nickname: "user01",
        avatar: "/users/user01/avatar",
      },
    },
  },
  {
    id: 2,
    username: "123",
    nickname: "123",
    password: "$2b$10$J251lEpX3LI8UpxxIuXMiugtELV71EL4gO2bfHyMtUtPI2B4taNJu",
    streamKey: "U2FsdGVkX194rC63kIDq6ePffAq_cif1QEb1RcHnimk=",
    avatar: "/users/123/avatar",
    email: "123@gmail.com",
    subscribes: 500,
    likeVideoList: [],
    dislikeVideoList: [],
    subscribeList: [],
    videos: new Video(),
    stream: {
      type: "stream",
      isStreamOn: false,
      title: "123 的直播間",
      thumbnail: "/streams/123/thumbnail",
      content: "",
      videoId: "",
      startTime: "",
      like: 415,
      dislike: 0,
      author: {
        username: "123",
        nickname: "123",
        avatar: "/users/123/avatar",
      },
    },
  },
  {
    id: 3,
    username: "bbbb",
    nickname: "Bob",
    streamKey: "U2FsdGVkX1__fd2ANVT33jYDE4shKW1l5lzgRRafZN4=",
    avatar: "/users/bbbb/avatar",
    email: "bbbb@gmail.com",
    subscribes: 200,
    likeVideoList: [],
    dislikeVideoList: [],
    subscribeList: [],
    videos: new Video(),
    title: "bbbb 的直播間",
    content: ``,
    thumbnail: "/streams/bbbb/thumbnail",
    videoId: "",
    startTime: "",
    like: 4155,
    dislike: 0,
    stream: {
      isStreamOn: false,
      type: "stream",
      author: {
        username: "bbbb",
        nickname: "Bob",
        avatar: "/users/bbbb/avatar",
      },
    },
  },
];

usersTable.initialRoom = function (username: any) {
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

usersTable.generateNewUser = async function (username: any, password: any, email: any) {
  const streamKey = genStreamKey(username);
  const salt = genSalt();
  const passwordHash = hashPassword(password, salt);
  const newUser = {
    id: this.length,
    username,
    password: passwordHash,
    streamKey: streamKey,
    avatar: `/users/${username}/avatar`,
    subscribes: 0,
    email,
    videos: new Video(),
    dislikeVideoList: [],
    likeVideoList: [],
    subscribeList: [],
    stream: {
      isStreamOn: false,
      type: "stream",
      author: {
        username,
        nickname: username,
        avatar: `/users/${username}/avatar`,
      },
      title: `${username} 的直播間`,
      thumbnail: `/streams/${username}/thumbnail`,
      content: "",
      startTime: "",
      like: 0,
      dislike: 0,
    },
  };

  try {
    const userDir = `${usersDir}/${username}`;
    const defaultAvatar = `${usersDir}/default/avatar.jpg`;
    const defaultThumbnail = `${usersDir}/default/thumbnail.jpg`;

    if (!await checkDirectory(userDir)) {
      await generateDirectory(userDir);
    }
    await copyFile(
      defaultAvatar,
      `${userDir}/avatar.jpg`
    );
    await copyFile(
      defaultThumbnail,
      `${userDir}/thumbnail.jpg`
    );
  } catch (error) {
    console.log("error", error);

    return {};
  }

  this.push(newUser);
  const { password: currentPassword, stream, ...userData } = newUser;

  return {
    user: userData,
    stream,
  };
};

usersTable.checkLikeVideoExist = function (username: any, videoId: any) {
  const user = this.findUser(username);

  if (!user) return false;

  return user.likeVideoList.find((id: any) => id === videoId);
};

usersTable.checkDislikeVideoExist = function (username: any, videoId: any) {
  const user = this.findUser(username);

  if (!user) return false;

  return user.dislikeVideoList.find((id: any) => id === videoId);
};

usersTable.findUser = function (username: any) {
  return this.find((user: any) => user.username === username);
};

usersTable.getUser = function (username: any) {
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

usersTable.addLikeVideoToList = function (username: any, videoId: any) {
  if (!username || !videoId) return;
  const user = this.findUser(username);

  const isLikeVideoExist = usersTable.checkLikeVideoExist(username, videoId);
  if (!isLikeVideoExist) {
    user.likeVideoList.push(videoId);
  }
  return user.likeVideoList;
};

usersTable.removeLikeVideoFromList = function (username: any, videoId: any) {
  if (!username || !videoId) return;
  const user = this.findUser(username);

  const isLikeVideoExist = usersTable.checkLikeVideoExist(username, videoId);
  if (isLikeVideoExist) {
    user.likeVideoList = user.likeVideoList.filter((id: any) => id !== videoId);
  }
  return user.likeVideoList;
};

usersTable.addLike = function (username: any) {
  const user = this.find((user: any) => user.username === username);

  if (!user) return -1;

  user.stream.like++;

  return user.stream.like;
};

usersTable.reduceLike = function (username: any) {
  const user = this.find((user: any) => user.username === username);

  if (!user) return -1;

  user.stream.like--;

  return user.stream.like;
};

usersTable.addDislikeVideoToList = function (username: any, videoId: any) {
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

usersTable.removeDislikeVideoFromList = function (username: any, videoId: any) {
  if (!username || !videoId) return;
  const user = this.findUser(username);

  const isDislikeVideoExist = usersTable.checkDislikeVideoExist(
    username,
    videoId
  );
  if (isDislikeVideoExist) {
    user.dislikeVideoList = user.dislikeVideoList.filter(
      (id: any) => id !== videoId
    );
  }

  return user.dislikeVideoList;
};

usersTable.addDislike = function (username: any) {
  const user = this.find((user: any) => user.username === username);

  if (!user) return -1;

  user.stream.dislike++;

  return user.stream.dislike;
};

usersTable.reduceDislike = function (username: any) {
  const user = this.find((user: any) => user.username === username);

  if (!user) return -1;

  user.stream.dislike--;

  return user.stream.dislike;
};

usersTable.verifyUser = function (username: any, password: any) {
  const user = this.find((user: any) => {
    if (user.username === username) {
      const result = checkPassword(password, user.password);
      return result;
    }
  });

  if (!user) return null;
  const { password: currentPassword, stream, ...userData } = user;

  return {
    user: userData,
    stream,
  };
};

usersTable.getMe = function (username: any) {
  const user = usersTable.find((user: any) => user.username === username);
  const { password, stream, ...userData } = user;

  return {
    user: userData,
    stream,
  };
};

usersTable.getStream = function (username: any) {
  const user = usersTable.find((user: any) => user.username === username);
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

usersTable.editUserMeta = function (username: any, options: any) {
  const user = usersTable.find((user: any) => user.username === username);

  Object.entries(options).forEach(([key, value]: [any, any]) => {
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

usersTable.getStreamThumbnail = function (username: any) {
  const user = usersTable.find((user: any) => user.username === username);

  if (!user) return "";

  return user.stream.thumbnail;
};

usersTable.editStreamThumbnail = function (username: any) {
  const user = usersTable.find((user: any) => user.username === username);

  if (!user) return "";

  user.stream.thumbnail = `/streams/${username}/thumbnail`;

  return `/streams/${username}/thumbnail`;
};

usersTable.refreshStreamKey = function (username: any) {
  const user = usersTable.find((user: any) => user.username === username);
  const streamKey = genStreamKey(username);

  user.streamKey = streamKey;

  return streamKey;
};

usersTable.addSubscribeToList = function (currentUsername: any, subscribeUsername: any) {
  const currentUser = this.findUser(currentUsername);

  if (!currentUser) return [];

  const isSubscribe = !!currentUser.subscribeList.find(
    (username: any) => username === subscribeUsername
  );

  if (!isSubscribe) {
    currentUser.subscribeList.push(subscribeUsername);
  }

  return currentUser.subscribeList;
};

usersTable.removeSubscribeFromList = function (
  currentUsername: any,
  subscribeUsername: any
) {
  const currentUser = this.findUser(currentUsername);

  if (!currentUser) return [];

  const isSubscribe = !!currentUser.subscribeList.find(
    (username: any) => username === subscribeUsername
  );

  if (isSubscribe) {
    currentUser.subscribeList = currentUser.subscribeList.filter(
      (username: any) => username !== subscribeUsername
    );
  }

  return currentUser.subscribeList;
};

const comments: TCommentInfo[] = [
  {
    time: 1675759497648,
    author: { username: "user01" },
    message: { text: "1" },
  },
  {
    time: 1675759497786,
    author: { username: "user01" },
    message: { text: "2" },
  },
  {
    time: 1675759498151,
    author: { username: "user01" },
    message: { text: "3" },
  },
  {
    time: 1675759498217,
    author: { username: "user01" },
    message: { text: "4" },
  },
  {
    time: 1675759498330,
    author: { username: "user01" },
    message: { text: "5" },
  },
  {
    time: 1675759498456,
    author: { username: "user01" },
    message: { text: "6" },
  },
  {
    time: 1675759498557,
    author: { username: "user01" },
    message: { text: "7" },
  },
  {
    time: 1675759498662,
    author: { username: "user01" },
    message: { text: "8" },
  },
  {
    time: 1675759498790,
    author: { username: "user01" },
    message: { text: "9" },
  },
  {
    time: 1675759498800,
    author: { username: "user01" },
    message: { text: "10" },
  },
  {
    time: 1675759498820,
    author: { username: "user01" },
    message: { text: "11" },
  },
  {
    time: 1675759498900,
    author: { username: "user01" },
    message: { text: "12" },
  },
  {
    time: 1675759499000,
    author: { username: "user01" },
    message: { text: "13" },
  },
  {
    time: 1675759499200,
    author: { username: "user01" },
    message: { text: "14" },
  },
  {
    time: 1675759500200,
    author: { username: "user01" },
    message: { text: "15" },
  },
  {
    time: 1675759500900,
    author: { username: "user01" },
    message: { text: "16" },
  },
  {
    time: 1675759501000,
    author: { username: "user01" },
    message: { text: "17" },
  },
  {
    time: 1675759501200,
    author: { username: "user01" },
    message: { text: "18" },
  },
  {
    time: 1675759502200,
    author: { username: "user01" },
    message: { text: "19" },
  },
  {
    time: 1675759503200,
    author: { username: "user01" },
    message: { text: "20" },
  },
  {
    time: 1675759503210,
    author: { username: "user01" },
    message: { text: "21" },
  },
  {
    time: 1675759504200,
    author: { username: "user01" },
    message: { text: "22" },
  },
  {
    time: 1675759505200,
    author: { username: "user01" },
    message: { text: "23" },
  },
  {
    time: 1675759506200,
    author: { username: "user01" },
    message: { text: "24" },
  },
  {
    time: 1675759507200,
    author: { username: "user01" },
    message: { text: "25" },
  },
  {
    time: 1675759508200,
    author: { username: "user01" },
    message: { text: "26" },
  },
  {
    time: 1675759509200,
    author: { username: "user01" },
    message: { text: "27" },
  },
  {
    time: 1675759510200,
    author: { username: "user01" },
    message: { text: "28" },
  },
  {
    time: 1675759511200,
    author: { username: "user01" },
    message: { text: "29" },
  },
  {
    time: 1675759512200,
    author: { username: "user01" },
    message: { text: "30" },
  },
  {
    time: 1675759513200,
    author: { username: "user01" },
    message: { text: "31" },
  },
  {
    time: 1675759514200,
    author: { username: "user01" },
    message: { text: "32" },
  },
  {
    time: 1675759515200,
    author: { username: "user01" },
    message: { text: "33" },
  },
  {
    time: 1675759516200,
    author: { username: "user01" },
    message: { text: "34" },
  },
  {
    time: 1675759517200,
    author: { username: "user01" },
    message: { text: "35" },
  },
  {
    time: 1675759518200,
    author: { username: "user01" },
    message: { text: "36" },
  },
];

// 網站總共有多少部影片
const siteVideos = {
  1: {
    type: "video",
    title: "我理想中的家",
    author: {
      username: "bbbb",
      nickname: "Bob",
      avatar: "/users/bbbb/avatar",
    },
    content:
      "我想到一個安靜、寧靜的地方，一個我可以放鬆和重新充電的地方。我的理想家園是一個溫馨、舒適的地方，擁有所有必要的設施，同時也是一個可以營造美好回憶的地方。",
    thumbnail: "/videos/1/thumbnail",
    startTime: 1675759497647,
    videoId: "1",
    comments: new Comments(comments),
    like: 415,
    dislike: 0,
  },
  2: {
    type: "video",
    title: "書中世界",
    author: {
      username: "bbbb",
      nickname: "Bob",
      avatar: "/users/bbbb/avatar",
    },
    content: `在一個晴朗的下午，小明來到了一家古老的書店，這裡的每一本書都帶著故事和記憶，它們似乎有著自己的生命和靈魂。

當小明拿起一本古老的書，他忽然感覺自己被吸進了書中的世界，變成了書中的主角。他發現自己置身於一個神奇的世界，並見到了許多奇妙的事物。

在這個世界裡，小明學習到了很多東西，包括友誼、勇氣、和愛。他結識了很多新朋友，並和他們一起經歷了各種冒險和挑戰。他發現書中的世界不僅可以讓他學習到很多知識，還可以讓他成為一個更好的人。

當小明最終從書中世界回到現實中時，他感到有些失落，因為他不想離開那個奇妙的世界。但是他也知道，他可以隨時再次打開那本書，回到書中的世界中，經歷更多的冒險和體驗更多的知識。

小明從這次經歷中明白到，書本不僅是知識的載體，更是一個可以帶領他進入另一個世界的鑰匙。他深深體會到，只要擁有一本好書，他就擁有了無限的可能性和無窮的探索之旅。`,
    thumbnail: "/videos/2/thumbnail",
    startTime: 1675759497647,
    videoId: "2",
    comments: new Comments(),
    like: 587,
    dislike: 20,
  },
  3: {
    type: "video",
    title: "沙漠世界",
    author: {
      username: "bbbb",
      nickname: "Bob",
      avatar: "/users/bbbb/avatar",
    },
    content: `在沙漠中，每一滴水都比黃金更加珍貴。在這個充滿著極端天氣和恶劣环境的地方，只有最強壯、最智慧、最有毅力的人才能生存下來。

一個年輕的探險家，名叫艾倫，來到了這個沙漠。他帶著自己的水和食物，準備在這個荒涼的地方探險。在他的旅程中，他發現了沙漠中許多令人驚奇的東西，例如奇怪的生物和驚人的地形。他也遇到了許多挑戰，例如高溫和缺水。

但是，艾倫並沒有放棄。他用他的智慧和毅力，找到了水源，生火、找食物。他的旅途充滿了冒險，他也遇到了許多友善的人，他們與他分享了他們的食物和水，並指引他走向安全的地方。

艾倫在這段旅程中學到了很多東西。他學會了如何在艱難的情況下保持冷靜和明智，學會了如何珍惜每一滴水和每一份食物，並學會了如何尊重沙漠中的生物和大自然。

當艾倫最終回到了家中時，他覺得自己變得更加強大和智慧。他深深體會到，沙漠雖然充滿了艱難和危險，但它也是一個充滿生命力和驚喜的地方。`,
    thumbnail: "/videos/3/thumbnail",
    startTime: 1675759497647,
    videoId: "3",
    comments: new Comments(),
    like: 440,
    dislike: 10,
  },
  4: {
    type: "video",
    title: "聖誕節",
    author: {
      username: "bbbb",
      nickname: "Bob",
      avatar: "/users/bbbb/avatar",
    },
    content: `在一個寒冷的冬天，城市中的每個角落都瀰漫著聖誕節的氣息。大家都在忙著準備節日的盛宴，購買禮物、裝飾房子、煮美食、唱聖誕歌，這是一個快樂、熱鬧的節日。

但是，有一個小男孩，名叫小杰，卻沒有感受到節日的歡樂氛圍。他的父母離異了，他的父親因工作繁忙無暇照顧他，他只能和奶奶相依為命。他總是感到寂寞和失落，尤其是在這個節日裡。

就在這時，一個名叫喬治的老人走進了小杰的生活。喬治是一個熱心肠的人，他常常到醫院和老人院探望病人和老人。他認識了小杰，開始和他交流。喬治教小杰如何製作聖誕裝飾，唱聖誕歌，分享他的回憶和故事，讓小杰感受到了節日的溫暖。

在聖誕夜，小杰沒有任何禮物，他覺得自己很失落。但是，喬治帶著一個禮物和一個驚喜來到了他的家裡。他送給小杰一個裝滿了禮物和糖果的大袋子，並帶著他到教堂和社區中心，讓他參加聖誕慶典和聚會。小杰感到非常開心和感激，他明白到，在這個節日裡，真正的禮物不在於物質，而是關愛和陪伴。

從此以後，小杰開始理解到，即使是在孤單的時候，他也可以在節日裡找到歡樂和幸福。他深深體會到，聖誕節不僅是一個節日，更是一個關懷和關愛他人的時刻。`,
    thumbnail: "/videos/4/thumbnail",
    startTime: 1675759497647,
    videoId: "4",
    comments: new Comments(),
    like: 1351,
    dislike: 37,
  },
  5: {
    type: "video",
    title: "火星與宇宙",
    author: {
      username: "bbbb",
      nickname: "Bob",
      avatar: "/users/bbbb/avatar",
    },
    content: `人類一直以來都對宇宙充滿了好奇和探索的精神。在一個不久的將來，人類將踏上火星的土地，並開始一段新的冒險之旅。

一個年輕的太空探險家，名叫艾莉斯，是第一個登上火星的人類之一。她的任務是收集火星的樣本，並在那裡建立一個研究基地。在這個寂靜而神秘的星球上，她發現了許多奇妙的事物，例如古老的火山、石灰岩山脈和巨大的沙丘。她也發現了一些可能是生命存在的跡象，這使她感到非常興奮和期待。

然而，她的探險並不順利。在探索過程中，她遇到了各種各樣的挑戰和困難，例如缺氧、食物短缺和設備故障。但是，她從這些挑戰中獲得了很多寶貴的經驗和教訓，她學會了如何在困境中保持冷靜和堅定，並如何運用自己的智慧和技能解決問題。

艾莉斯的探險也讓她更加深入地理解了宇宙的奧秘和神秘。她發現宇宙中有無數的星球和星系，每個都有著獨特的特點和生命形式。她意識到，宇宙是一個充滿生命力和神奇的地方，而人類的探索精神將推動我們更深入地了解這個神秘而美麗的宇宙。

最終，艾莉斯成功地完成了她的任務，並帶著許多寶貴的知識和經驗返回地球。她的探險不僅使人類更加了解火星和宇宙，還啟發了人類繼續探索宇宙的渴望和勇氣。`,
    thumbnail: "/videos/5/thumbnail",
    startTime: 1675759497647,
    videoId: "5",
    comments: new Comments(),
    like: 11200,
    dislike: 200,
  },
  6: {
    type: "video",
    title: "交通",
    author: {
      username: "bbbb",
      nickname: "Bob",
      avatar: "/users/bbbb/avatar",
    },
    content: `在現代城市，交通是一個非常重要的問題。人們經常需要搭乘公共交通工具或開車到處移動。但是，交通問題也帶來了許多困擾，例如塞車、污染和交通事故。

一個名叫小華的年輕人，是一個熱心的環保主義者。他從小就受到父母的環保觀念的影響，因此他對城市的交通問題非常關注。他知道，如果我們不採取行動來解決這些問題，將會對我們的城市和環境造成嚴重的影響。

小華開始行動起來，他和一些志同道合的朋友一起發起了一個行動，推廣使用公共交通工具、自行車和步行，以減少汽車對環境的影響。他們在社區中舉辦了一些活動，例如自行車騎行和步行旅遊，向人們展示了使用這些交通方式的好處。他們還與當地政府合作，推廣使用電動汽車、建設綠色交通基礎設施等環保措施。

小華的努力終於得到了回報。越來越多的人開始使用公共交通工具和自行車，汽車使用量減少了，交通擁堵和污染問題也得到了緩解。小華感到非常自豪和滿意，他知道，雖然自己只是一個普通的年輕人，但他的努力和行動可以對城市和環境產生積極的影響。

這個故事告訴我們，每個人都可以做出貢獻，保護我們的環境和城市。只要我們採取積極的行動，將環保觀念融入我們的日常生活，就可以改善我們的城市和環境，讓我們的未來更加美好。`,
    thumbnail: "/videos/6/thumbnail",
    startTime: 1675759497647,
    videoId: "6",
    comments: new Comments(),
    like: 6321,
    dislike: 132,
  },
};

export const videos = new Video(siteVideos);
export const rooms = new Rooms();

// 加入假的 user 進 rooms
rooms.addRoom("user01");
rooms.addRoom("123");
