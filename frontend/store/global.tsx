import { Appwrite } from "appwrite";
import { atom } from "recoil";
import { User } from "./types";

export const Server = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as any,
    project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT as any,
    // collectionID: process.env.REACT_APP_COLLECTION_ID as any,
};

export const appwrite = new Appwrite()

appwrite.setEndpoint(Server.endpoint).setProject(Server.project);

export const userState = atom<User>({
    key: "user",
    default: null,
});
