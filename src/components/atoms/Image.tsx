import NextImage from "next/image"
import React from "react"

type ResponsiveImage = {
  src: string
  width: number
  height: number
}

/**
@example
```
<Image
  image={require("images/xxxx.jpg?resize")}
  alt="Alternative"
/>
```
*/
const Image: React.FC<{
  image: ResponsiveImage
  alt: string
}> = ({ image, alt }) => {
  return (
    <NextImage
      src={image.src}
      width={image.width}
      height={image.height}
      alt={alt}
    />
  )
}

export default Image
