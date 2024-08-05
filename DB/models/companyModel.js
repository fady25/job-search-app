//imports
import mongoose, { model } from "mongoose"


// schema 

export const companySchema = new mongoose.Schema({
    companyname:{   type:String , unique:true , required:true   },
    description:{   type:String , required:true },
    industry:{  type:String, requires:true  },
    address:{  type:String, required:true  },
    numberOfEmployees:{ min:{type:Number,required:true},  max:{type:Number,required:true}  },
    companyEmail:{  type:String, unique:true, required:true  },
    companyHR: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  }
},{
    timestamps:true
})

// model
const Company = model('company',companySchema)

export default Company


