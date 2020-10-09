import React, { useState } from "react"

import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import useSWR from "swr"

import { Api, useApi } from "components/ApiContext"

interface Article {
  title: string
}

const fetcher = (api: Api, path: string) => api.get(path).then((r) => r.json())

const CommunicationContainer: React.FC = () => {
  const api = useApi()

  const [id, setId] = useState("")
  const [display, setDisplay] = useState("")

  const { data: article, error } = useSWR<Article>(
    id ? [api, `articles/${id}`] : null,
    fetcher
  )

  const call = async () => {
    setDisplay("Loading ...")

    const response = await api.get(`articles/${id}`)

    if (response.error) {
      if (response.error.type === "ArticleNotFoundException") {
        setDisplay(
          JSON.stringify({ error: "ArticleNotFoundException" }, null, 2)
        )
      } else {
        response.error.handle()
        setDisplay("")
      }
      return
    }

    const data = await response.json()
    setDisplay(JSON.stringify(data, null, 2))
  }

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h1 className="mt-4 mb-8 text-2xl font-bold">Communication</h1>
      <TextField
        label="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <Button
        className="my-4"
        onClick={call}
        color="primary"
        variant="contained"
      >
        Call
      </Button>
      <div className="h-8">
        {article
          ? `Title = ${article.title}`
          : error
          ? `Error = ${error.type}`
          : ""}
      </div>
      {display ? (
        <TextField
          className="w-full max-w-xl"
          variant="outlined"
          multiline
          InputProps={{ readOnly: true }}
          value={display}
        />
      ) : null}
    </div>
  )
}

export default CommunicationContainer
