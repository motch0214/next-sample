import Head from "next/head"
import React from "react"

import GallaryContainer from "components/gallary/GallaryContainer"

const Gallary: React.FC = () => {
  return (
    <>
      <Head>
        <title>Gallary | Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GallaryContainer />
    </>
  )
}

export default Gallary
