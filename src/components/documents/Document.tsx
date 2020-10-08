import React from "react"

import styles from "./Document.module.scss"

const Document: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl px-2 py-8">
        <div className={styles.container}>{children}</div>
      </div>
    </div>
  )
}

export default Document
