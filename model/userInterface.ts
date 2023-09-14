export default interface UserModel{
    email: string
    name: string
    password: string
    address? : Array<string>
}