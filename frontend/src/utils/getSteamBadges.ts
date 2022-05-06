import { Query } from "appwrite"
import { Models } from "node-appwrite"
import { appwrite } from "store/global"

export interface getSteamBadgesParams {
  userId: string
}

interface UserBadgeDocument extends Models.Document {
  account: string
  badge: string
  minted: boolean
  user: string
}

interface BadgeDocument extends Models.Document {
  category: string
  description: string
  name: string
  provider: string
  providerId: string
}

export interface CategoryDocument extends Models.Document {
  provider: string
  description: string
  providerId: string
  name: string
}

interface IBadges {
  [key: string]: BadgeDocument
}

interface IUserBadges {
  [key: string]: IUserBadge
}

export interface IUserBadge extends UserBadgeDocument {
  badgeData: BadgeDocument
}

interface ICategories {
  [key: string]: CategoryDocument
}

export interface UserSteamBadges {
  userBadges: IUserBadges
  categories: ICategories
}

export const getSteamBadgesAsync = async ({userId}: getSteamBadgesParams): Promise<UserSteamBadges> => {
  
  const {documents: userBadgesDocuments} =  await appwrite.database.listDocuments<UserBadgeDocument>('user-badges', [
    Query.equal('account', userId)
  ], 100)

  const badgesIds = userBadgesDocuments.filter(badge => !(badge.minted)).map(badge => badge.badge)

  const {documents: badgesDocuments} =  await appwrite.database.listDocuments<BadgeDocument>('badges', [
    Query.equal('$id', badgesIds),
  ], 100)

  const categoriesIds = badgesDocuments.map(badge => badge.category)

  const {documents: categoriesDocuments} =  await appwrite.database.listDocuments<CategoryDocument>('categories', [
    Query.equal('$id', categoriesIds),
  ], 100)

  // badges

  const badges: IBadges = {}
  badgesDocuments.forEach(badge => {
    badges[badge.$id] = badge
  })

  const userBadges: IUserBadges = {}
  userBadgesDocuments.forEach(badge => {
    userBadges[badge.badge] = {
      ...badge,
      badgeData: badges[badge.badge]
    }
  })

  const categories: ICategories = {}
  categoriesDocuments.forEach(category => {
    categories[category.$id] = category
  })

  return {
    userBadges,
    categories
  }
}

export const getSteamBadges = (params: getSteamBadgesParams): Promise<UserSteamBadges> => {
  return new Promise((resolve, reject) => {
    getSteamBadgesAsync(params).then(resolve).catch(reject)
  })
}