import { GetServerSideProps, InferGetServerSidePropsType as Infer } from "next"
import React from "react"

import Seo from "components/Seo"

const Throw: React.FC<Infer<typeof getServerSideProps>> = ({ type }) => {
  if (type === "Render") {
    throw Error("This is Rendering Error")
  }

  return (
    <>
      <Seo />
      <div>This page should not be shown.</div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { type } = query

  if (type === "SSR") {
    throw Error("This is Server Side Error")
  } else {
    return {
      props: { type },
    }
  }
}

export default Throw
