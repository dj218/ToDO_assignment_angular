export class User {
    constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public gender: string,
    public address: string,
    public password: string,
    public confirmPassword: string,
    public profileImage: string,
    public profileImageSrc: string
    ){}
}
