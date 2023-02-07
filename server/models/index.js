import * as _ from "lodash-es";

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
    const { comments, startTime } = this[id];

    return {
      ...this[id],
      comments: comments.sliceComments(startTime),
    };
  }

  getSliceComments(id, startTime) {
    if (!this[id]) return;

    const { comments } = this[id];

    if (!comments) return;

    return comments.sliceComments(startTime);
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
      user,
      message: {
        text,
        date: new Date().getTime(),
      },
    };
    this[this.length + 1] = comment;
    this.length++;

    return comment;
  }

  addFakeComment(user, message) {
    if (!user || !message) return;

    const comment = {
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

  filterCommentsByStartTime(startTime) {
    const comments = Object.values(this).filter(
      (comment) => comment.message && comment.message.date >= Number(startTime)
    );

    return comments;
  }

  sliceComments(startTime, limit = 10) {
    return this.filterCommentsByStartTime(startTime).slice(0, (limit = 10));
  }
}

export class Users {
  constructor() {
    this.length = 0;
    this.createTime = Date.now();
  }
  addUser(socketId, user) {
    if (!socketId || !user) return;
    this[socketId] = { user };
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
  addUserToRoom(room, socketId, user) {
    if (!room || !socketId || !user) return;
    this[room].users.addUser(socketId, user);
  }
  removeUserFromRoom(room, socketId) {
    if (!room || !socketId) return;
    this[room].users.removeUser(socketId);
  }
  addCommentToRoom(room, message, user) {
    if (!room || !message || !user) return;
    const comment = this[room].comments.addComment(message, user);
    return comment;
  }
  searchRoomComments(room) {
    return this[room].comments.searchComments();
  }
}
