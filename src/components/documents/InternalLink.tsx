import Link from "next/link"
import React from "react"

const InternalLink: React.FC<{ href: string }> = ({ href, children }) => {
  return (
    <Link href={href}>
      <a href={href}>{children}</a>
    </Link>
  )
}

export default InternalLink
