// imports
import dotenv from 'dotenv'
import express from 'express'
import { dbconnection } from './DB/connection.js'
import userRouter from './src/modules/user/userRoutes.js'
import jobRouter from './src/modules/job/job.router.js'
import companyRouter from './src/modules/company/company.router.js'
import { errorHandlerMiddleware } from './src/middleware/ERR-Handler.js'


dotenv.config()

// connection on server 
const app = express()
const port = process.env.PORT

// parsing
app.use(express.json())


//dbconnection
dbconnection()



//routers
app.use('/users',userRouter)
app.use('/jobs',jobRouter)
app.use('/companies',companyRouter)



app.use(errorHandlerMiddleware)

app.listen(port,()=>{
    console.log('server is running on port',port)
})



