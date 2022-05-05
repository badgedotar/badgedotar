import type { Appwrite } from "appwrite";

type UserLogged = {
    $id: string;
    email: string;
    name: string;
}

type User = UserLogged | null;

type State = {
    user?: User;
    appwrite?: Appwrite;
};

export type {
    User,
    UserLogged,
    State
}