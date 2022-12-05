import UserRecord from "../database/records/user.record"

export type TokenPayload = {
    email: UserRecord["email"],
    id: UserRecord["id"],
}
