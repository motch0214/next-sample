import React from "react"

type ResponsiveImage = {
  src: string
  srcSet: string
  width: number
  height: number
}

/**
@example
```
<Image
  className="w-full h-auto"
  image={require("images/xxxx.jpg?sizes[]=600,sizes[]=1024")}
  webp={require("images/xxxx.jpg?sizes[]=600,sizes[]=1024&format=webp")}
  alt="Alternative"
/>
```
*/
const Image: React.FC<{
  className: string
  image: ResponsiveImage
  webp?: ResponsiveImage
  alt: string
}> = ({ className, image, webp, alt }) => {
  return (
    <picture>
      {webp ? <source srcSet={webp.srcSet} type="image/webp" /> : null}
      <source srcSet={image.srcSet} />
      <img
        className={className}
        src={image.src}
        width={image.width}
        height={image.height}
        loading="lazy"
        alt={alt}
      />
    </picture>
  )
}

export default Image
