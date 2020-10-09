import React, { createContext, useContext, useEffect, useState } from "react"

import IconButton from "@material-ui/core/IconButton"
import Snackbar from "@material-ui/core/Snackbar"
import CloseIcon from "@material-ui/icons/Close"
import { BeforeRequestHook, Options } from "ky"
import ky from "ky-universal"

import FirebaseContext, { Firebase } from "./FirebaseContext"

type Ky = typeof ky

export class Api {
  private ky: Ky
  private onError: OnError

  constructor(ky: Ky, onError: OnError) {
    this.ky = ky
    this.onError = onError
  }

  async get(path: string, options?: Options): Promise<Response> {
    return this.call(path, { ...options, method: "get" })
  }

  /**
	@example
	```
  const response = async api.post("path/to/api", { json: { hoge: true } })
  if (response.error) {
    if (response.error.type === "ExpectedError") {
      // Handle the error
    } else {
      response.error.handle() // Use default handler
    }
  } else {
    const data = await response.json()
  }
	```
	*/
  async post(path: string, options?: Options): Promise<Response> {
    return this.call(path, { ...options, method: "post" })
  }

  async call(
    path: string,
    options?: Options & { method: string }
  ): Promise<Response> {
    return await this.ky(path, {
      method: options.method,
      json: options.json,
      searchParams: options.searchParams,
    })
      .then((response) => new Response(response))
      .catch(async (error) => {
        if (!error.response) {
          return new Response(error.response, this.handler("NetworkError"))
        }

        const handler = await error.response
          .json() // 例外の内容を取得
          .then((body) => this.handler(body.type))
          .catch(() => {
            const status = error.response.status
            if (status >= 500) {
              return this.handler("ServerError")
            } else {
              return this.handler("ClientError")
            }
          })
        return new Response(error.response, handler)
      })
  }

  private handler(type: string) {
    return new ErrorHandler(type, this.onError)
  }
}

export class Response {
  private response: globalThis.Response
  readonly error?: ErrorHandler

  constructor(response: globalThis.Response, error?: ErrorHandler) {
    this.response = response
    this.error = error
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async json<T = any>(): Promise<T> {
    if (this.error) {
      throw this.error
    }
    return this.response.json()
  }
}

export class ErrorHandler {
  readonly type: string
  private onError: OnError

  constructor(type: string, onError: OnError) {
    this.type = type
    this.onError = onError
  }

  handle(): void {
    // エラーメッセージに変換
    if (this.type === "NetworkError") {
      this.onError(`ネットワークエラーが発生しました。`)
    } else if (this.type === "ServerError") {
      this.onError(
        `エラーが発生しました。しばらく時間をおいてから再実行してください。`
      )
    } else {
      this.onError(`エラーが発生しました。ページをリロードしてください。`)
    }
  }
}

type OnError = (message: string) => void

const ErrorHandlerContext = createContext<{ onError: OnError }>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onError: () => {},
})

const ApiContext = createContext<{ api: Api }>({ api: null })

const ApiContextProvider: React.FC = ({ children }) => {
  const { firebase } = useContext(FirebaseContext)

  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const onError = (message: string) => {
    setErrorMessage(message)
    setOpen(true)
  }

  const [api, setApi] = useState<Api>(() => initialize(firebase, onError))

  useEffect(() => {
    setApi(() => initialize(firebase, onError))
  }, [firebase])

  const handleClose = (
    _: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <ApiContext.Provider value={{ api }}>
      <ErrorHandlerContext.Provider value={{ onError }}>
        {children}
      </ErrorHandlerContext.Provider>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={<span>{errorMessage}</span>}
        action={
          <IconButton color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
      />
    </ApiContext.Provider>
  )
}

const initialize = (firebase: Firebase | null, onError: OnError): Api => {
  const api = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_SERVER_URL,
    timeout: 10000, // ms
    hooks: {
      beforeRequest: [authHeaderHook(firebase)],
    },
  })
  return new Api(api, onError)
}

const authHeaderHook = (firebase: Firebase | null): BeforeRequestHook => {
  return async (request) => {
    try {
      const user = firebase && firebase.auth().currentUser
      if (user) {
        const result = await user.getIdTokenResult()
        request.headers.set("Authorization", `Bearer ${result.token}`)
        ;(async () => {
          // moment 重いので。
          const moment = (await import("moment")).default

          const aliveSeconds = moment
            .duration(moment().diff(moment(result.issuedAtTime)))
            .asSeconds()

          // Refresh in 30s
          if (aliveSeconds > 30) {
            await user.getIdToken(true)
          }
        })()
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

const useApi = (): Api => {
  const { api } = useContext(ApiContext)
  return api
}

export { ApiContextProvider, useApi, ErrorHandlerContext }
