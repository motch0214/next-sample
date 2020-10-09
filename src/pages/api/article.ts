import type { NextApiHandler } from "next"

const mock: NextApiHandler = (req, res) => {
  if (req.method === "GET") {
    const id = Number(req.query["id"])

    if (Number.isInteger(id)) {
      if (id === 1) {
        res.status(200).json({
          id: 1,
          title: "THE ARTICLE TITLE",
        })
      } else {
        res.status(400).json({
          type: "ArticleNotFoundException",
          message: "Article not found",
        })
      }
    } else {
      res.status(400).json({
        type: "BadRequestException",
        message: "Request is invalid",
      })
    }
  } else {
    res.status(404).send("")
  }
}

export default mock
