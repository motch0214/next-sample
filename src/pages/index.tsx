import Head from "next/head"
import React from "react"

import Home from "components/home/Home"

const Index: React.FC = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home />
    </>
  )
}

export default Index
