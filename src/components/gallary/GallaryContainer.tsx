import React from "react"

import Image from "components/atoms/Image"

const GallaryContainer: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mt-4 mb-8 text-2xl font-bold">Gallary</h1>
      <div className="w-full max-w-3xl px-2 pb-8 grid grid-flow-row gap-y-4 grid-cols-1">
        <Image
          className="object-cover"
          image={require("images/027.jpg?resize")}
          width={1000}
          height={800}
          alt="MADOTSUKI"
        />
        <Separator />
        <Image
          className="object-cover"
          image={require("images/1280.jpg?resize")}
          width={1000}
          height={800}
          alt="Cinnabar"
        />
        <Separator />
        <Image
          className="object-cover"
          image={require("images/36205778.jpg?resize")}
          width={1000}
          height={800}
          alt="Suicide"
        />
      </div>
    </div>
  )
}

const Separator: React.FC = () => {
  return <div className="w-full h-px bg-gray-400" />
}

export default GallaryContainer
