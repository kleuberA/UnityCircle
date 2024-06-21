import { User } from "./user"

export interface UsersFetchResponse {
    data: {
        getUsers: User[]
    }
}