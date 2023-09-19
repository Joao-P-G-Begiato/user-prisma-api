import UserModel from "../model/userInterface";
import AddressModel from "../model/addressInteface";
import prismaClient from "./prismaClient";
export default class dbConections{
    static async create(user: UserModel, address: AddressModel){
        const prisma = prismaClient
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
        const prisma = prismaClient
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
        const prisma = prismaClient
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
        const prisma = prismaClient
        const user = await prisma.user.findUnique({
            where:{
                email : userMail
            },
        })
        return user
    }

    static async updateUser(userId : number, data: Object ){
        const prisma = prismaClient
        const update = await prisma.user.update({
            data: data,
            where: {
                id : userId
            }
        })
    }

    static async deleteUser(userId : number){
        const prisma = prismaClient
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
        const prisma = prismaClient
        const oldAddressId = await prisma.address.findFirst({
            where : {
                userid : userId,
                active : 1
            }
        })
        const desactiveOldAdress = await prisma.address.update({
            data : {
                active : 0
            },
            where : {
                addressid : oldAddressId.addressid
            }
        })
    }

    static async addressCreation(address : AddressModel, userId: number) {
        const prisma = prismaClient
        const replaceOld = await this.oldAddressDesactive(userId)
        const exist = await this.findAdressByData(address)
        if(!exist){
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
        }else{
            const updateUser = await prisma.user.update({
                where : {
                    id: userId
                },
                data : {
                    address : {
                        connect : {
                            addressid : exist.addressid
                        }
                    }
                }
            })
            const updateAddress = await prisma.address.update({
                where: {
                    addressid : exist.addressid
                },
                data:{
                    active : 1
                }
            })
        }
    }

    static async findAdressByData(data: Object){
        const result = await prismaClient.address.findFirst({
            where: data
        })
        return result
    }

}