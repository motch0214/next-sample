import { GetServerSideProps } from "next"
import React from "react"

import { js2xml } from "xml-js"

import { getAllPages } from "utils/sitemap"

const getSitemap = async () => {
  const pages = await getAllPages()

  return js2xml(
    {
      _declaration: {
        _attributes: {
          version: "1.0",
          encoding: "utf-8",
        },
      },
      urlset: {
        _attributes: {
          xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        },
        url: pages.map((page) => ({
          loc: {
            _text: `${process.env.NEXT_PUBLIC_SITE_URL}${page}`,
          },
          lastmod: {
            _text: new Date().toISOString(),
          },
          changefreq: {
            _text: "hourly",
          },
          priority: {
            _text: 0.7,
          },
        })),
      },
    },
    { compact: true }
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = await getSitemap()

  res.setHeader("content-type", "application/xml")
  res.write(sitemap)
  res.end()

  return { props: {} }
}

const Sitemap: React.FC = () => null

export default Sitemap
