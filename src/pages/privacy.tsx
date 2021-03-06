import { GetStaticProps, InferGetStaticPropsType as Infer } from "next"
import React from "react"

import hydrate from "next-mdx-remote/hydrate"
import render from "next-mdx-remote/render-to-string"

import Seo from "components/Seo"
import Image from "components/atoms/Image"
import Document from "components/documents/Document"
import InternalLink from "components/documents/InternalLink"
import { readDocument } from "utils/server/documents"

const Privacy: React.FC<Infer<typeof getStaticProps>> = ({ source }) => {
  const content = hydrate(source, { components })

  return (
    <>
      <Seo title="Privacy Policy" />
      <Document>{content}</Document>
    </>
  )
}

const components = {
  Link: InternalLink,
  MadotsukiImage: () => (
    <Image image={require("images/027.jpg?resize")} alt="MADOTSUKI" />
  ),
}

export const getStaticProps: GetStaticProps = async () => {
  const doc = await readDocument("privacy.mdx")
  const source = await render(doc, { components })

  return {
    props: { source },
  }
}

export default Privacy
