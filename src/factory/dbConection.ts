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
                        zipcode: address.zipcode,
                        active: 1
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

    static async listUserByMail(userMail : string){
        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
            where:{
                email : userMail
            },
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

    static async deleteUser(userId : number){
        const prisma = new PrismaClient()
        const deleteAddress = await prisma.address.deleteMany({
            where:{
                userid : userId
            }

        })
        const deletedUser = await prisma.user.delete({
            where: {
                id : userId
            }
        })
    }

    static async oldAddressDesactive(userId: number){
        const prisma = new PrismaClient()
        const desactiveOldAdress = await prisma.address.update({
            data : {
                active : 0
            },
            where : {
                userid : userId,
                active : 1
            }
        })
    }

    static async addressCreation(address : AddressModel, userId: number) {
        const prisma = new PrismaClient()
        const replaceOld = await this.oldAddressDesactive(userId)
        const updateUser = await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                address : {
                    create : Object.assign(address, {active: 1})
                }
            }
        })
    }
}