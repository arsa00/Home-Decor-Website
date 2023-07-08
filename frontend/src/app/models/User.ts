export class User {
    _id?: string;
    username: string;
    password: string;
    type:  string;
    jwt: string;
    status?:  string;
    imageType?: string;
    firstname?:  string;
    lastname?:  string;
    phone?:  string;
    mail:  string;
    name?:  string;
    address?:  string;
    idNumber?:  string;
    description?: string;
    numOfOpenedPositions?: number;

    static clone(user: User): User {
        const newUser: User = new User();

        newUser._id = user._id;
        newUser.username = user.username;
        newUser.password = user.password;
        newUser.type = user.type;
        newUser.jwt = user.jwt;
        newUser.status = user.status;
        newUser.imageType = user.imageType;
        newUser.firstname = user.firstname;
        newUser.lastname = user.lastname;
        newUser.phone = user.phone;
        newUser.mail = user.mail;
        newUser.name = user.name;
        newUser.address = user.address;
        newUser.idNumber = user.idNumber;
        newUser.description = user.description;
        newUser.numOfOpenedPositions = user.numOfOpenedPositions;

        return newUser;
    }
}