import React from "react"

import { NextSeo } from "next-seo"

const Seo: React.FC<{
  title?: string
  description?: string
  image?: string
}> = ({ title, description, image }) => {
  const meta = {
    title: title ? `${title} | Next Sample` : "Next Sample",
    description: description || "Next project starter",
    images: [{ url: image || `${process.env.NEXT_PUBLIC_SITE_URL}/meta.png` }],
    type: "website",
    site_name: "Next Sample",
  }

  return (
    <NextSeo
      title={meta.title}
      description={meta.description}
      openGraph={meta}
      noindex={process.env.NEXT_PUBLIC_BUILD_PROFILE !== "production"}
      twitter={{ cardType: "summary_large_image" }}
    />
  )
}

export default Seo
