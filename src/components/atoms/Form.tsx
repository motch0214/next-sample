import React from "react"

const Form: React.FC<{
  className?: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}> = ({ className, onSubmit, children }) => {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        onSubmit(event)
        event.preventDefault()
      }}
    >
      {children}
    </form>
  )
}

export default Form
