
import express from "express"
import cors from "cors"
import UserController from "./controller/userController"

const port = 3000
const app = express()

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`)
})

app.use(cors())
app.use(express.json())

UserController.route(app)