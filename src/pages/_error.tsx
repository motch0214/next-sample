import type { NextPageContext } from "next"
import React from "react"

import Seo from "components/Seo"

type ErrorProps = { message?: string }

export default class Error extends React.Component<ErrorProps> {
  static async getInitialProps({ err }: NextPageContext): Promise<ErrorProps> {
    return { message: err?.message }
  }

  render(): JSX.Element {
    const { message } = this.props

    return (
      <>
        <Seo title="ERROR" />
        <div className="mt-8 ml-4">
          <h1 className="text-3xl font-bold">Sorry</h1>
          <p className="text-lg">
            障害が発生しています。ご迷惑をお掛けして申し訳ありません。
          </p>
          {message ? <p>{message}</p> : null}
        </div>
      </>
    )
  }
}
