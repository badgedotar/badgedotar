import { Query } from "appwrite"
import { appwrite } from "store/global"

export const getBadges = (userId: string) => {
  return appwrite.database.listDocuments('user-badges', [
    Query.equal('user', userId)
  ])
}