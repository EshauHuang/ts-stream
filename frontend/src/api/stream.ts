import { IUser } from "@/contexts/userContext"

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL

export const signOut = async () => {

  const response = await fetch(`${SERVER_URL}/sign-out`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
  });

  return await response.json();
}


export const signIn = async (user: { username: string, password: string }) => {
  const response = await fetch(`${SERVER_URL}/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify(user),
  });

  return await response.json();
}

export const signUp = async (user: { username: string, password: string, email: string }) => {
  const response = await fetch(`${SERVER_URL}/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify(user),
  });

  return await response.json();
}

export const getMe = async () => {
  const response = await fetch(`${SERVER_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
  })

  return await response.json()
}

export const getUser = async (username: string) => {
  const response = await fetch(`${SERVER_URL}/users/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    }
  })

  return await response.json()
}

export const getStream = async (username: string) => {
  const response = await fetch(`${SERVER_URL}/streams/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    }
  })

  return await response.json()
}

export const getStreams = async (page = 1, limit = 10) => {
  const response = await fetch(`${SERVER_URL}/streams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      page,
      limit
    }),
  })

  return await response.json()
}

export const getVideos = async (page = 1, limit = 10) => {
  const response = await fetch(`${SERVER_URL}/videos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      page,
      limit
    }),
  })

  return await response.json()
}

export const getVideo = async (videoId: string) => {
  const response = await fetch(`${SERVER_URL}/videos/${videoId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })

  return await response.json()
}

export const getComments = async (videoId?: string | number, time: number | string = 0, mode: number = 1) => {
  if (!videoId) return

  const response = await fetch(`${SERVER_URL}/videos/${videoId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      time,
      mode
    })
  })

  return await response.json()
}

interface IStream {
  title: string;
  content: string;
}

export const editUserMeta = async (username: string, stream: IStream) => {
  const response = await fetch(`${SERVER_URL}/users/${username}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify(stream)
  })

  return await response.json()
}

export const refreshStreamKey = async (username: string) => {
  const response = await fetch(`${SERVER_URL}/streams/${username}/streamKey`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
  })

  return await response.json()
}

// Stream
export const addStreamToLikeList = async (username: string, currentUser: IUser) => {
  const response = await fetch(`${SERVER_URL}/streams/${username}/like/add`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}

export const removeStreamFromLikeList = async (username: string, currentUser: IUser) => {
  const response = await fetch(`${SERVER_URL}/streams/${username}/like/reduce`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}

export const addStreamToDislikeList = async (username: string, currentUser: IUser) => {
  const response = await fetch(`${SERVER_URL}/streams/${username}/dislike/add`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}

export const removeStreamFromDislikeList = async (username: string, currentUser: IUser) => {
  const response = await fetch(`${SERVER_URL}/streams/${username}/dislike/reduce`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}


// Video
export const addLikeToVideo = async (videoId: string, currentUser: IUser) => {
  const response = await fetch(`${SERVER_URL}/videos/${videoId}/like/add`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}

export const removeFromLikeVideoList = async (username: string, currentUser: IUser) => {
  const response = await fetch(`${SERVER_URL}/videos/${username}/like/reduce`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}

export const addDislikeVideoToList = async (username: string, currentUser: IUser) => {
  const response = await fetch(`${SERVER_URL}/videos/${username}/dislike/add`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}

export const removeFromDislikeVideoList = async (username: string, currentUser: IUser) => {
  const response = await fetch(`${SERVER_URL}/videos/${username}/dislike/reduce`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}

export const addSubscribeToList = async (username: string, currentUser: IUser) => {

  const response = await fetch(`${SERVER_URL}/users/${username}/subscribe/add`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}

export const removeSubscribeFromList = async (username: string, currentUser: IUser) => {
  const response = await fetch(`${SERVER_URL}/users/${username}/subscribe/remove`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: 'include',
    body: JSON.stringify({
      user: currentUser.username
    })
  })

  return await response.json()
}

export const createOrEditStreamThumbnail = async (username: string, formData: FormData) => {
  const response = await fetch(
    `${SERVER_URL}/streams/${username}/thumbnail`,
    {
      method: "POST",
      credentials: 'include',
      body: formData,
    }
  );

  return response.json();
}