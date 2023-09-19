import express = require ("express")
import cors = require ("cors")
import UserController from "./controller/userController"

const app = express()

app.use(cors())
app.use(express.json())

const port = 3000

app.listen(port, ()=>{
    console.log(`A Api está no ar no http://localhost:${port}`)
})

UserController.route(app)