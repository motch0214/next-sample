import { GetStaticProps, InferGetStaticPropsType as Infer } from "next"
import Head from "next/head"
import React from "react"

import Document from "components/documents/Document"
import InternalLink from "components/documents/InternalLink"
import hydrate from "next-mdx-remote/hydrate"
import render from "next-mdx-remote/render-to-string"
import { readDocument } from "utils/documents"

const Privacy: React.FC<Infer<typeof getStaticProps>> = ({ source }) => {
  const content = hydrate(source, { components })

  return (
    <>
      <Head>
        <title>Privacy Policy | Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Document>{content}</Document>
    </>
  )
}

const components = {
  Link: InternalLink,
}

export const getStaticProps: GetStaticProps = async () => {
  const source = readDocument("privacy.mdx")
  const mdxSource = await render(source, { components })

  return {
    props: { source: mdxSource },
  }
}

export default Privacy
