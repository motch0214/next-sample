import Head from "next/head"
import React from "react"

import CommunicationContainer from "components/communication/CommunicationContainer"

const Communication: React.FC = () => {
  return (
    <>
      <Head>
        <title>Fetch | Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CommunicationContainer />
    </>
  )
}

export default Communication
