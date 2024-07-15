const mongoose = require("mongoose") 
const bcryptjs = require("bcryptjs"); const bcrypt = require("bcryptjs/dist/bcrypt");

let usersSchema= mongoose.Schema({
    name:{type: String, required:true },
    phonenumber:{type: String, required:true, unique:true },
    email:{type: String, required:true, unique:true},
    password:{type:String, required:true },
    databalance:{type:Number,},
    registrationDate:{type:Date, default:Date.now()},
}) 

//PASSWORD HASHING
let saltRound=10;
usersSchema.pre("save", function(next){
    console.log(this.password)
    // bcrypt.hash(password,saltRound,callback)
    bcryptjs.hash(this.password,saltRound,(err,hashedPassword)=>{
        console.log(hashedPassword)
       if(err){console.log("password could not hash" + err)}
       else{ 
        this.password = hashedPassword
        next()}  
    })     
})

//PASSWORD UNHASHING
usersSchema.methods.validatePassword = function(password,callback){
    bcrypt.compare(password, this.password, (err, same)=>{
        console.log(same);
        if(!err){
            callback(err,same)
        }
        else{next()}
    })
}


let usersModel = mongoose.model("usersTable", usersSchema)
module.exports = usersModel
