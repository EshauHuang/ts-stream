const SERVER_URL = import.meta.env.VITE_SERVER_URL

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

export const getComments = async (videoId: string) => {
  const response = await fetch(`${SERVER_URL}/comments/${videoId}?date=1675759497647`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })

  return await response.json()
}