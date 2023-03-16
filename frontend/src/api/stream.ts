const SERVER_URL = import.meta.env.VITE_API_SERVER_URL

export const getMe = async (username: string) => {
  const response = await fetch(`${SERVER_URL}/users/${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    }
  })

  return await response.json()
}

export const getStream = async (username: string) => {
  const response = await fetch(`${SERVER_URL}/streams/${username}`, {
    method: "POST",
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
    method: "POST",
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
  })

  return await response.json()
}