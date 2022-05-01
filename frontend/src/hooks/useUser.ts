import { useEffect, useState } from "react";
import Router from "next/router";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { appwrite, userState } from "store/global";
import { User } from "store/types";
import { AppwriteException } from "appwrite";


interface useUserParams {
  redirectTo?: string;
  redirectIfFound?: string;
}

interface useUserResponse {
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
    if (user) {
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

  // useEffect(() => {
  //   // if no redirect needed, just return (example: already on /dashboard)
  //   // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
  //   if (!redirectTo || !user) return;

  //   if (
  //     // If redirectTo is set, redirect if the user was not found.
  //     (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
  //     // If redirectIfFound is also set, redirect if the user was found
  //     (redirectIfFound && user?.isLoggedIn)
  //   ) {
  //     Router.push(redirectTo);
  //   }
  // }, [user, redirectIfFound, redirectTo]);

  return { user, setUser, loading } as useUserResponse;
}