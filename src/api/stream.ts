export const getStream = async (username: string) => {
  const response = await fetch("http://localhost:3535/get-stream", {
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