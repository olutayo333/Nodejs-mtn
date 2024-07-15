const bcryptjs = require("bcryptjs")
const userModel = require("../models/user.model")
const dataModel = require("../models/data.model")
const adminModel = require("../models/admin.model")
let jwt = require("jsonwebtoken")
let nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs/dist/bcrypt");


//USER REGISTRATION
const register = (req,res)=>{
    let userData = { 
        name:req.body.name,  
        phonenumber:req.body.phonenumber,
        email:req.body.email,
        password:req.body.password,
        databalance:req.body.databalance
    }
    let form = new userModel(userData)
    let userEmail= req.body.email

    userModel.find({email:userEmail})
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

    
    //USER LOGIN
    let signinemail;
        const signin = (req, res)=>{
            //console.log(req.body);
            let {email,password} = req.body
            signinemail = req.body.email
            console.log(signinemail);
            userModel.findOne({email:email})
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
                            res.send({user, token, message:" Login successful!", status:true, })
                        }
                        console.log("hurray user exist");
                    })
                
                }
            })
            .catch((err)=>{console.log(err);})
        }

    //AUTORIZATION FOR THE DASHBOARD
    const getDashboard = (req,res)=>{
         console.log("iz workign")
        let token = req.headers.authorization.split(" ")[1];
        let secret = process.env.SECRET
        jwt.verify(token, secret, (err,result)=>{
        if(err){console.log(err); res.send({status:false, message:"can't signin"})}
        else{
                userModel.findOne({email:signinemail})
                .then((user)=>{
                    if(!user){
                        res.send({message:"user not found", status:"false"})
                    }
                    else{
                        res.send({status:true, message:"user found", user})
                    }
                })
                .catch((err)=>{console.log("could not fetch data" + err); res.send({status:false})})
            }
        })
    }

//DATA DETAILS
const dataDetails= (req,res)=>{
    let dataData= {
        name:req.body.name,
        phonenumber:req.body.phonenumber,
        email:req.body.email,
        price:req.body.price,
        dataamout:req.body.dataamount,
    }
    let form = new dataModel(dataData)

    form.save()
    .then(()=>{
        res.send({status:true, message:"data saved successfully"})
    })
    .catch((err)=>{res.send({status:false, messgae:"data coul not be saved", err})})
}

//UPDATE DATA PURCHASED
const addData = (req, res)=>{
    //console.log(req.body);
    
     let databalance = req.body.databalance; let email = req.body.email;

    userModel.findOneAndUpdate({email:email}, {databalance}, {new:true} )
    .then((result)=>{
    console.log(result);
    res.send({status:true, message:"Data Balance Updated Successfully"})
    })
    .catch((err)=>{res.send({status:false, message:" Data update failed" + " " + err}); console.log(err, "couldnt update");})
}

//FETCH USER DETAILS
const userDetails = (req,res)=>{
    let {email} = req.body
    userModel.findOne({email:email})
    .then((user)=>{
        if(!user){
            res.send({status:false, message:"user not found"})
        }
        else{
            res.send({status:true, user, message:"user found"})
        }
    })
}




module.exports={register, signin, userDetails, dataDetails, addData, getDashboard}