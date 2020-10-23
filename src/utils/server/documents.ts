import { promises as fs } from "fs"
import path from "path"

export const readDocument = async (file: string): Promise<Buffer> => {
  return await fs.readFile(path.join(process.cwd(), "src/documents", file))
}
