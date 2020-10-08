import fs from "fs"
import path from "path"

export const readDocument = (file: string): Buffer => {
  return fs.readFileSync(path.join(process.cwd(), "src/documents", file))
}
