import React from "react"

import Image from "components/atoms/Image"

const GallaryContainer: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mt-4 mb-8 text-2xl font-bold">Gallary</h1>
      <div className="w-full max-w-3xl px-2 pb-8 grid grid-flow-row gap-y-4 grid-cols-1">
        <Image image={require("images/027.jpg?resize")} alt="MADOTSUKI" />
        <Separator />
        <Image image={require("images/1280.jpg?resize")} alt="Cinnabar" />
        <Separator />
        <Image image={require("images/36205778.jpg?resize")} alt="Suicide" />
      </div>
    </div>
  )
}

const Separator: React.FC = () => {
  return <div className="w-full h-px bg-gray-400" />
}

export default GallaryContainer
