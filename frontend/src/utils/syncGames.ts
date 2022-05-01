import { appwrite } from "store/global"

export const syncGames = (steamAccountId: string) => {
  return appwrite.functions.createExecution('626611e29cfabd9b6f4c', JSON.stringify({ accountId: steamAccountId }))
}