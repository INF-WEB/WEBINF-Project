

//User record
//Needed to be exampended possible
//TODO: make no optional

interface UserRecord {
    id: string,
    name: string,
    lastName?: string,
    email: string,
    password: string,
    userURI?: string,
    type: string,
}

export default UserRecord;
