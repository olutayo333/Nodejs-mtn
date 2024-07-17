const bcryptjs = require("bcryptjs")
const userModel = require("../models/user.model")
const dataModel = require("../models/data.model")

const adminModel = require("../models/admin.model")
let jwt = require("jsonwebtoken")
let nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs/dist/bcrypt");


//DASHBOARD
const adminDashboard = (req, res)=>{
    userModel.find()
    .then((result)=>{console.log("users loaded successfully"); 
    res.send({status:true, message:"users loaded successfully", result })})
    
    .catch((err)=>{console.log("could not load users", err); 
    res.send({status:false, message:"could not load users"})})
}
//TRANSACTION DETAILS
const transactions = (req, res)=>{
    dataModel.find()
    .then((result)=>{
        res.send({status:true, message:"transactions loaded successfully", result})
    })
    .catch((err)=>{console.log("could not load users", err); 
    res.send({status:false, message:"could not load transactions"})})
}

//ADMIN REGISTRATION
const adminRegister = (req,res)=>{
    let adminData = { 
        name:req.body.name,  
        phonenumber:req.body.phonenumber,
        email:req.body.email,
        password:req.body.password,
    }
    let form = new adminModel(adminData)
    let userEmail= req.body.email

    adminModel.find({email:userEmail})
        .then ((result)=>{ console.log(result);
            if(result.length>0){ res.send({status:false, message:"Email Already Exist, Please proceed to Login"}); console.log('user already exist')}
            else{
                form.save()
                .then(()=>{console.log("data saved succesfully ");res.send({status:true, message:"signup was successful"})})
                .catch((err)=>{console.log('Data could not be saved' + err); res.send({status:false, message:"signup not successful"})})                
            }
        })
        .catch((err)=>{console.log(err)})
        console.log(req.body)          
}

//ADMIN LOGIN
let adminemail;
const adminSignin = (req, res)=>{
    //console.log(req.body);
    let {email,password} = req.body
    adminemail = req.body.email

    adminModel.findOne({email:email})
    .then((user)=>{
        //console.log(user);
        if(!user){
            res.send({status:false, message:"user not found"})
        }
        else{
            user.validatePassword(password, (err, same)=>{
                if (!same){
                    res.send({status:false, message:"Incorrect Password"})
                }
                else{
                    let secret = process.env.SECRET
                    let token = jwt.sign({email}, secret, {expiresIn:900}); 
                    //console.log(token);//60, "1h", "1d"
                    res.send({user, token, message:" Login successful!", status:true, })
                }
                console.log("hurray user exist");
            })
        
        }
    })
    .catch((err)=>{console.log(err);})
}

const deleteuser = (req, res)=>{
    let userID = req.body.id; console.log(req.body);
    userModel.findOneAndDelete({_id:userID})
    .then((result)=>{console.log(result); res.send({status:true, message:"Deleted successfully", result})})
    .catch((err)=>{console.log(err+ "couldnt delete"); res.send({status:false, message:"could not Delete", result})})
}

const edituser = (req, res)=>{
    console.log(req.body);
    let name = req.body.name; let email = req.body.email; let phonenumber= req.body.phonenumber; let id=req.body.id;

    userModel.findOneAndUpdate({_id:id}, {name, email, phonenumber}, {new:true})
    .then((result)=>{
    console.log(result);
    res.send({status:true, message:"Edited Successfully"})
    })
    .catch((err)=>{res.send({status:false, message:" Edit failed" + " " + err}); console.log(err, "couldnt edit");})
}


module.exports={ adminRegister, adminSignin, adminDashboard, edituser, deleteuser, transactions}