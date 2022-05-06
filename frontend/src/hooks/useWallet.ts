import { useEffect, useState } from "react";
import { appwrite } from "store/global";
import { Models } from "node-appwrite"

export interface WalletDocument extends Models.Document {
  address: string
  balance: number
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(0);
  const reload = () => {
    setLoadCount(loadCount + 1);
  }
  useEffect(() => {
    setLoading(true);
    appwrite.database.listDocuments<WalletDocument>('wallets').then( (walletsCollection) => {
      if(walletsCollection.documents.length > 0) {
        setWallet(walletsCollection.documents[0]);
      }
      setLoading(false)
    }).catch((err) => {
      console.error(err)
      setLoading(false)
    })
  }, [loadCount])

  return {wallet, setWallet, loading, reload}
}