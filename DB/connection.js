import mongoose from "mongoose"

export const dbconnection = async ()=>{

    const connString="mongodb+srv://fadyemad20111:uRQWK10mbGxMSm3p@cluster0.91ywmp5.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
   return await mongoose.connect(connString) 
    .then(()=>{
        console.log('DB CONNECTED successfully')
    })
    .catch((err) => {

        console.log(connString)
        console.log(err)
})}



