import { promises as fs } from "fs"
import path from "path"

export const getAllPages = async (): Promise<string[]> => {
  const filenames = await walkdir(path.join(process.cwd(), "src/pages"))
  const constantPages = filenames
    // - Not starting with `/_`
    // - Not starting with `/api/`
    // - Not including `[ ]`
    // - Ending with `.tsx`
    .filter((n) => /^\/(?!(_|api\/|.*\[.*\])).*\.tsx$/.test(n))
    // - Trim `.tsx` or `index.tsx`
    .map((n) => (n.endsWith("/index.tsx") ? n.slice(0, -9) : n.slice(0, -4)))
    // - Exclude sitemap and error page
    .filter((n) => n !== "/sitemap.xml" && n !== "/404")

  return constantPages
}

const walkdir = async (dir: string, prefix = ""): Promise<string[]> => {
  const dirents = await fs.readdir(dir, {
    withFileTypes: true,
  })

  const names = await Promise.all(
    dirents.map(async (d) => {
      if (d.isDirectory()) {
        return await walkdir(path.join(dir, d.name), `${prefix}/${d.name}`)
      } else if (d.isFile()) {
        return [`${prefix}/${d.name}`]
      } else {
        return []
      }
    })
  )

  return names.flat()
}
