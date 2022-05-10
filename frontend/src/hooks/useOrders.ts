import { Models } from "node-appwrite"
import { useEffect, useState } from "react"
import { appwrite } from "store/global"

export type OrderStatus = 'new' | 'completed' | 'failed'

export interface Order extends Models.Document {
  minted: boolean
  userBadges: string
  user: string
  address: string
  status: OrderStatus
  msg: string
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingCount, setLoadingCount] = useState(0)
  useEffect(() => {
    appwrite.database.listDocuments<Order>('orders').then((response) => {
      setOrders(response.documents);
    })
  }, [loadingCount])
  const refresh = () => {
    setLoadingCount(loadingCount + 1)
  }
  return {orders, setOrders, refresh}
}