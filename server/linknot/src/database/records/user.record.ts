

//User record
//Needed to be exampended possible
//TODO: make no optional

interface UserRecord {
    id: string,
    name: string,
    lastName?: string,
    email: string,
    password: string,
    search: boolean,
    type: string,
}

export default UserRecord;
