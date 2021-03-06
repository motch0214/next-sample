import React, { createContext, useContext, useEffect, useState } from "react"

import dayjs from "dayjs"
import { BeforeRequestHook, Options } from "ky"
import ky from "ky-universal"

import { Firebase, useFirebase } from "./FirebaseContext"
import useShowError, { ShowError } from "./atoms/useShowError"

type Ky = typeof ky

interface ExceptionResponse {
  type: string
}

export class Api {
  private ky: Ky
  private showError: ShowError

  constructor(ky: Ky, showError: ShowError) {
    this.ky = ky
    this.showError = showError
  }

  async get(path: string, options?: Options): Promise<Response> {
    return this.call(path, { ...options, method: "get" })
  }

  /**
  @example
  ```
  const response = await api.post("path/to/api", { json: { hoge: true } })
  if (response.error) {
    if (response.error.type === "ExpectedError") {
      // Handle the error
    } else {
      response.error.handle() // Use default handler
    }
  } else {
    const data = await response.json()
    // Use the response data
  }
  ```
  */
  async post(path: string, options?: Options): Promise<Response> {
    return this.call(path, { ...options, method: "post" })
  }

  async call(
    path: string,
    options: Options & { method: string }
  ): Promise<Response> {
    return await this.ky(path, {
      method: options.method,
      json: options.json,
      searchParams: options.searchParams,
    })
      .then((response) => new Response(response))
      .catch(async (error) => {
        if (!error.response) {
          return new Response(error.response, this.handling("NetworkError"))
        }

        const handling = await error.response
          .json() // 例外の内容を取得
          .then((body: ExceptionResponse) => this.handling(body.type))
          .catch(() => {
            const status = error.response.status
            if (status >= 500) {
              return this.handling("ServerError")
            } else {
              return this.handling("ClientError")
            }
          })
        return new Response(error.response, handling)
      })
  }

  private handling(type: string) {
    return new ErrorHandling(type, this.showError)
  }
}

export class Response {
  private response: globalThis.Response
  readonly error?: ErrorHandling

  constructor(response: globalThis.Response, error?: ErrorHandling) {
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

export class ErrorHandling {
  readonly type: string
  private showError: ShowError

  constructor(type: string, showError: ShowError) {
    this.type = type
    this.showError = showError
  }

  handle(): void {
    // エラーメッセージに変換
    if (this.type === "NetworkError") {
      this.showError(`ネットワークエラーが発生しました。`)
    } else if (this.type === "ServerError") {
      this.showError(
        `エラーが発生しました。しばらく時間をおいてから再実行してください。`
      )
    } else {
      this.showError(`エラーが発生しました。ページをリロードしてください。`)
    }
  }
}

const ApiContext = createContext<Api | null>(null)

export const ApiContextProvider: React.FC = ({ children }) => {
  const { firebase } = useFirebase()
  const showError = useShowError()

  const [api, setApi] = useState<Api>(() => initialize(firebase, showError))

  useEffect(() => {
    if (firebase) {
      setApi(() => initialize(firebase, showError))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase])

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

const initialize = (firebase: Firebase | null, showError: ShowError): Api => {
  const api = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_SERVER_URL,
    timeout: 10000, // ms
    hooks: {
      beforeRequest: [authHeaderHook(firebase)],
    },
  })
  return new Api(api, showError)
}

const authHeaderHook = (firebase: Firebase | null): BeforeRequestHook => {
  return async (request) => {
    try {
      const user = firebase && firebase.auth().currentUser
      if (user) {
        const result = await user.getIdTokenResult()
        request.headers.set("Authorization", `Bearer ${result.token}`)
        ;(async () => {
          const aliveSeconds = dayjs().diff(
            dayjs(result.issuedAtTime),
            "second"
          )

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

export const useApi = (): Api => {
  return useContext(ApiContext) as Api // Api instance given to ApiContext.Provider always
}
