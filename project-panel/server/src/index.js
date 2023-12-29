const express = require('express')
const app = express()
const{PORT, CLIENT_URL} =require('./constants')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const cors = require('cors')
require('./middlewares/passport-middleware')
//import routes
const authRoutes = require('./routes/auth')
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:CLIENT_URL , credentials:true}))
app.use(passport.initialize())

app.use('/api' , authRoutes)


const appStart = () =>{
    try{
        app.listen(PORT , () =>{
            console.log(`server is running at ${PORT}`)

        })
    }catch(error){
        console.log(`Error : ${error.message}`);
    }
}

appStart()