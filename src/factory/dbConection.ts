import { PrismaClient } from "@prisma/client";
import UserModel from "../model/userInterface";
import AddressModel from "../model/addressInteface";

export default class dbConections{
    static async create(user: UserModel, address: AddressModel){
        const prisma = new PrismaClient()
        const createUser = await prisma.user.create({
            data: {
                email : user.email,
                name : user.name,
                password : user.password,
                address :  {
                    create :{
                        city : address.city,
                        country: address.country,
                        number: address.number,
                        state: address.state,
                        street: address.street,
                        zipcode: address.zipcode
                    }
                }
            }
        })
    }

    static async listAllUsers(){
        const prisma = new PrismaClient()
        const users = await prisma.user.findMany({
            include: {
                address:{
                    select: {
                        addressid: true
                    }
                }
            }
        })
        return users
    }

    static async listUserById(userId : number){
        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
            where:{
                id: userId
            },
            include :{
                address : true
            }
        })
        return user
    }

    static async updateUser(userId : number, data: Object ){
        const prisma = new PrismaClient()
        const update = await prisma.user.update({
            data: data,
            where: {
                id : userId
            }
        })
    }

}