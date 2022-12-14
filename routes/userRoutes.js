const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const userCollection=require('../models/userSchema')

router.get('/',(req,res)=>{

    if (req.session.adminSession) {
        res.redirect('/adminProfilePage')
    }

    else if(req.session.userSession){
        res.redirect('/userProfilePage')
    }

    else if(!req.session.userSession){

        res.render('userLogin',{wrong:req.session.userWrong})
        req.session.userWrong=false
    }
    
})

// let userObject; //to access user details globally

router.post('/userValidation',(req,res)=>{

    async function validation(){
        let jijin=await userCollection.find({email:req.body.email})

        try{

        if ((req.body.email==jijin[0].email)&&req.body.password==jijin[0].password){
  
            req.session.userSession=jijin//creating session
            // userObject=jijin
            res.redirect('/userProfilePage')
        
        }
        else{
            req.session.userWrong=true
            res.redirect('/')//if password wrong but the email is correct
        }
        }
        catch(err){
            req.session.userWrong=true
            res.redirect('/')//if email is wrong
        }
    
    }
    validation() 
})

router.get('/userProfilePage',async(req,res)=>{
    
    if (req.session.userSession) {

        res.render('userProfile',{userData:req.session.userSession})
    }
    else{
        res.redirect('/')
    }
    
})

router.get('/userLogout',(req,res)=>{

    req.session.destroy()
    res.redirect('/')

})

router.get('/userRegisterPage',(req,res)=>{

    res.render('userRegister',{repeated:req.session.userRepeated})
    req.session.userRepeated=false

})

router.post('/registrationCompleted',(req,res)=>{
    
    async function insertMethod(){
        let jijin= await userCollection.find({email:req.body.email})
        try{

            if(jijin[0].email){
                req.session.userRepeated=true
                res.redirect('/userRegisterPage')
                
            }
            
        }
        catch(err){
            await userCollection.insertMany([
                {
                    email:req.body.email,
                    password:req.body.password,
                    name:req.body.name,
                    age:req.body.age
                }
            ])
        
            res.redirect('/')

        }

    }
    insertMethod() 

})

module.exports={router,userCollection}