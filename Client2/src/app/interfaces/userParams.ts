import { User } from "./User";

export class UserParams {
    gender: string = "";
    minAge = 18;
    maxAge = 100;
    pageSize = 5;
    pageNumber = 1;
    orderedBy = "lastActive";

    constructor(user: User) {
        this.gender = (user.gender == "male" ? "female" : "male")
    }


}