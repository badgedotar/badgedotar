import { runFunction } from "./runFunction"

export const syncGames = (steamAccountId: string) => {
  return runFunction('626611e29cfabd9b6f4c', JSON.stringify({ accountId: steamAccountId }))
}