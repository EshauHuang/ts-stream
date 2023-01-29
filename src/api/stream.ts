const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const getStream = async (username: string) => {
  const response = await fetch(`${SERVER_URL}/get-stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      username,
    }),
  })

  return await response.json()
}