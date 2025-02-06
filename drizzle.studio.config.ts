import 'dotenv/config'
import {defineConfig} from 'drizzle-kit'
import fs from 'fs'
import path from 'path'

function getLocalD1DB(): string {
  try {
    const basePath = path.resolve('.wrangler')
    const dbFile = fs
      .readdirSync(basePath, {encoding: 'utf-8', recursive: true})
      .find((f) => f.endsWith('.sqlite'))

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`)
    }

    const url = path.resolve(basePath, dbFile)
    return url
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Error  ${err.message}`)
    }
    throw err
  }
}
export default defineConfig({
  schema: './db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: getLocalD1DB(),
  },
})
