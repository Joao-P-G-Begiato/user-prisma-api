import dbConections from "../factory/dbConection";
import ValidationUserInfo from "../services/validation/validationUserInfo"
import Cryptographer from "../services/cryptography/cryptographer";


export default class UserController{
    static async route(app: any){

        app.post("/user", async (req : any, res : any)=>{
            try{
                const {user, address} = req.body
                const {email, name, password} = user
                const userExist = await dbConections.listUserByMail(user.email)
                if(!userExist){
                    if(ValidationUserInfo.emailVerify(email) && ValidationUserInfo.nameVerify(name) && ValidationUserInfo.passwordVeirfy(password)){
                        const newPassword = await Cryptographer.crypt(user.password)
                        user.password = newPassword
                        await dbConections.create(user, address);
                        res.status(201).json({message: "creation successful"})
                    }else{
                        throw new Error("Bad Request: check the requesition body")
                    }
                }else{
                    res.status(400).json({message: "Bad Request, a User with this e-mail already exist"})
                }
            }catch(e : any){
                res.status(400).json(e.message)
            }
        })

        app.get("/user", async(req: any, res: any)=>{
            try{
                const response = await dbConections.listAllUsers()
                res.status(200).json(response)
            }catch{
                res.status(404).json({message: "Something unexpected happens, try again later"})
            }
        })

        app.get("/user/:id", async(req: any, res: any)=>{
            try{
                const userId = parseInt(req.params.id)
                const response = await dbConections.listUserById(userId)
                res.status(200).json(response)
            }catch{
                res.status(404).json({message: "User not found"})
            }
        })

        app.patch("/user/:id", async(req : any, res : any)=>{
            try{
                const userId = parseInt(req.params.id)
                const userValid = await dbConections.listUserById(userId)
                const passwordExist = req.body.password ? ValidationUserInfo.passwordVeirfy(req.body.password) : true
                const emailExist = req.body.email ? ValidationUserInfo.emailVerify(req.body.password) : true
                const nameExist = req.body.name ? ValidationUserInfo.nameVerify(req.body.password) : true
                if(req.body.password){
                    req.body.password = await Cryptographer.crypt(req.body.password)
                }
                if(passwordExist && emailExist && nameExist){
                    if(userValid){
                        const response = await dbConections.updateUser(userId, req.body)
                        res.status(200).json({message: `User with the id ${req.params.id} was updated succefully`})
                    }else{
                        res.status(404).json({message: "User not found"})
                    }
                }else{
                    res.status(400).json({message: "Bad request, check the requisition body"})
                }
            }catch(e){
                res.status(400).json({message: "Something went wrong, try again later"})
            }
        })

        app.delete("/user/:id", async (req: any, res:any)=>{
            const userId = parseInt(req.params.id)
            try{
                const userValid = await dbConections.listUserById(userId)
                if(!userValid){
                    res.status(404).json({message: `not found a user with id: ${userId}`})
                }else{
                    const response = await dbConections.deleteUser(userId)
                    res.status(200).json(`success on delete user`)
                }
            }catch(e){
                console.log(e)
                res.status(400).json({message: `something went wrong, try again later`})
            }
        })
    }
}