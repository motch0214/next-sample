import type { NextApiHandler } from "next"

import ky from "ky-universal"

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    if (!process.env.SLACK_NOTICE_URL) {
      res.status(204).send("")
      return
    }

    const message = req.body["message"]

    await ky
      .post(process.env.SLACK_NOTICE_URL, {
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        json: {
          text: message,
        },
      })
      .then(() => {
        res.status(200).send("")
      })
      .catch((error) => {
        if (!error.response) {
          res.status(500).send("NetworkError")
        } else {
          res.status(500).json(error.response)
        }
      })
  } else {
    res.status(404).send("")
  }
}

export default handler
