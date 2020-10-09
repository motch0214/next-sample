import Head from "next/head"
import React from "react"

import { NextSeo } from "next-seo"

const site = {
  title: "Create Next App",
}

const Seo: React.FC<{ title?: string }> = ({ title }) => {
  const meta = {
    title: title ? `${title} | ${site.title}` : site.title,
  }

  return (
    <>
      <NextSeo title={meta.title} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  )
}

export default Seo
