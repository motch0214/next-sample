import NextImage from "next/image"
import React from "react"

type ResponsiveImage = {
  src: string
  width: number
  height: number
}

type NextImageProps = Parameters<typeof NextImage>[0]

/**
@example
```
<Image
  image={require("images/xxxx.jpg?resize")}
  alt="Alternative"
/>
```
*/
const Image: React.FC<
  { image: ResponsiveImage } & Omit<NextImageProps, "src">
> = ({ image, width, height, ...props }) => {
  return (
    <NextImage
      src={image.src}
      width={width && height ? width : image.width}
      height={width && height ? height : image.height}
      {...props}
    />
  )
}

export default Image
