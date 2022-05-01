import { Query } from "appwrite";
import { useEffect, useState } from "react";
import { appwrite } from "store/global";
import { User } from "store/types";

interface SteamAccount {
  $collection: "accounts"
  $id: string
  name: null
  provider: "steam"
  providerId: string
  token: string
  user: string
}

export default function useSteam(user?: User | null) {
  const [steamAccounts, setSteamAccounts] = useState<SteamAccount[]>([]);
  useEffect(() => {
    if(!user) {return;}
    appwrite.database.listDocuments('accounts', [
      Query.equal('user', user.$id)
    ]).then(response => {
      
      setSteamAccounts(response.documents as any as SteamAccount[])
    })
  }, [user])
  return {steamAccounts}
}