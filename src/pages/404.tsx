import React from "react"

import Seo from "components/Seo"

const NotFound: React.FC = () => {
  return (
    <>
      <Seo title="Not found" />
      <div className="mt-8 ml-4">
        <h1 className="text-3xl font-bold">NOT FOUND</h1>
        <p className="text-lg">ページが見つかりません。</p>
      </div>
    </>
  )
}

export default NotFound
