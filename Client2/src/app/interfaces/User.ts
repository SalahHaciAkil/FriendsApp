export interface User {
    userName: string;
    token: string;
    knownAs: string;
    photoUrl: string;
    gender: string;
    roles:Array<string>;
};