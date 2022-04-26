import type { Appwrite } from "appwrite";

type User = {
    $id: string;
    email: string;
    name: string;
} | null;

type State = {
    user?: User;
    appwrite?: Appwrite;
};

export type {
    User,
    State
}