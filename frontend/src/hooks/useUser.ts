import { useEffect, useState } from "react";
import Router from "next/router";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { appwrite, userState } from "store/global";
import { User } from "store/types";
import { AppwriteException } from "appwrite";


export interface useUserParams {
  redirectTo?: string;
  redirectIfFound?: string;
}

export interface useUserResponse {
  user: User;
  loading: boolean;
  setUser: SetterOrUpdater<User>;
}

export default function useUser({
  redirectTo,
  redirectIfFound,
}: useUserParams = {}) {

  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== null) {
      if (redirectIfFound) {
        Router.push(redirectIfFound);
      }
      setLoading(false);
      return;
    };
    const fetchData = async () => {
        appwrite.account.get().then(response => {
          setUser(response as User);
          setLoading(false);
        }).catch( (error: AppwriteException) => {
          if(error.code !== 401) {
            throw error;
          }
          if(redirectTo) {
            Router.push(redirectTo);
          }
          setLoading(false);
        })
    }
    fetchData();
  }, [user])

  return { user, setUser, loading } as useUserResponse;
}