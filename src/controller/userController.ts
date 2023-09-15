import dbConections from "../factory/dbConection";
import ValidationUserInfo from "../services/validation/validationUserInfo"
import Cryptographer from "../services/cryptography/cryptographer";


export default class UserController{
    static async route(app: any){

        app.post("/user", async (req : any, res : any)=>{
            try{
                const {user, address} = req.body
                const {email, name, password} = user
                if(ValidationUserInfo.emailVerify(email) && ValidationUserInfo.nameVerify(name) && ValidationUserInfo.passwordVeirfy(password)){
                    const newPassword = await Cryptographer.crypt(user.password)
                    user.password = newPassword
                        dbConections.create(user, address);
                }else{
                    throw new Error("Bad Request: check the requesition body")
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
                const response = await dbConections.listUserById(req.params.id)
                res.status(200).json(response)
            }catch{
                res.status(404).json({message: "User not found"})
            }
        })

        // app.patch("/user", async(req, res)=>{

        // })


    }
}