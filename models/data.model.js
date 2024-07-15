const mongoose = require("mongoose") 
const bcryptjs = require("bcryptjs"); const bcrypt = require("bcryptjs/dist/bcrypt");

let dataSchema= mongoose.Schema({
    name:{type: String, required:true },
    phonenumber:{type: String, required:true,  },
    email:{type: String, required:true, },
    price:{type:String, required:true, },
    dataamout:{type:String, required:true },
    purchasedDate:{type:Date, default:Date.now()},
}) 
//name:this.name, phonenumber:this.phonenumber,email:this.email, price:'1000', dataamount:'1.2GB'

let dataModel = mongoose.model("dataTable", dataSchema)
module.exports = dataModel
