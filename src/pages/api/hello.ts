import type { NextApiHandler } from "next"

const hello: NextApiHandler = (_req, res) => {
  res.statusCode = 200
  res.json({ name: "John Doe" })
}

export default hello
