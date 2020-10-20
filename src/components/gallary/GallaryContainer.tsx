import React from "react"

import Image from "components/atoms/Image"

const GallaryContainer: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mt-4 mb-8 text-2xl font-bold">Gallary</h1>
      <div className="w-full max-w-3xl px-2 pb-8 grid grid-flow-row gap-y-4">
        <Image
          className="w-full h-auto"
          image={require("images/027.jpg?sizes[]=600,sizes[]=1024")}
          webp={require("images/027.jpg?sizes[]=600,sizes[]=1024&format=webp")}
          alt="MADOTSUKI"
        />
        <Separator />
        <Image
          className="w-full h-auto"
          image={require("images/1280.jpg?sizes[]=600,sizes[]=1024")}
          webp={require("images/1280.jpg?sizes[]=600,sizes[]=1024&format=webp")}
          alt="Cinnabar"
        />
        <Separator />
        <Image
          className="w-full h-auto"
          image={require("images/36205778.jpg?sizes[]=600,sizes[]=1024")}
          webp={require("images/36205778.jpg?sizes[]=600,sizes[]=1024&format=webp")}
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
