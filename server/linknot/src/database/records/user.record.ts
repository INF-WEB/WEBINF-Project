

//User record
//Needed to be exampended possible
//TODO: make no optional

interface UserRecord {
    id: string,
    firstName: string,
    lastName?: string,
    email: string,
    password: string,
    jobStatus?: boolean,
}

export default UserRecord;
