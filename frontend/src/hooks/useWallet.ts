import { useEffect, useState } from "react";
import { appwrite } from "store/global";
import { Models } from "node-appwrite"
import { UserLogged } from "../../store/types";

export interface WalletDocument extends Models.Document {
  address: string
  balance: number
}

export const useWallet = (user: UserLogged) => {
  const [wallet, setWallet] = useState<WalletDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(0);
  const reload = () => {
    setLoadCount(loadCount + 1);
  }
  useEffect(() => {
    setLoading(true);
    appwrite.database.getDocument<WalletDocument>('wallets', user.$id).then( (walletToSet) => {
      if(walletToSet) {
        setWallet({
          ...walletToSet,
          balance: walletToSet.balance / 1000000
        });
      }
      setLoading(false)
    }).catch((err) => {
      console.error(err)
      setLoading(false)
    })
  }, [loadCount])

  return {wallet, setWallet, loading, reload}
}