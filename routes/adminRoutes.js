const express=require('express')
const router=express.Router()
const app=express()
const mongoose=require('mongoose')
const adminCollection=require('../models/adminSchema')
const recievedUserCollection=require('../routes/userRoutes')
const userCollection=recievedUserCollection.userCollection
app.use(express.urlencoded({extended:true}))//to get data from post method

router.get('/adminLoginPage',(req,res)=>{
    
    if (!req.session.adminSession) {
        
        res.render('adminLogin',{wrong:req.session.adminWrong})
        req.session.adminWrong=false
    }
    else{
        res.redirect('/adminProfilePage')
    }

})

// let adminObject
router.post('/adminValidation',(req,res)=>{

    async function validation(){
        let jijin=await adminCollection.find({email:req.body.email})

        try{

            if (req.body.email===jijin[0].email&&req.body.password===jijin[0].password){

                let usersData=await userCollection.find()

                // adminObject=jijin
                req.session.adminSession=usersData//creating session
                res.redirect('/adminProfilePage')
            
            }
            else{
                req.session.wrong=true
                res.redirect('/adminLoginPage')
            }
        }
        catch(err){
            req.session.adminWrong=true
            res.redirect('/adminLoginPage')  
        }
    
    }
    validation()
})

router.get('/adminProfilePage',(req,res)=>{
    
    if (req.session.adminSession) {
        res.render('adminProfile',{details:req.session.adminSession})
    }
    else{
        res.redirect('/adminLoginPage')
    }

})

router.get('/adminLogout',(req,res)=>{

    req.session.destroy()
    res.redirect('/adminLoginPage')

})

router.get('/deleteUser',async(req,res)=>{
    await userCollection.findByIdAndDelete({_id:req.query.id})
    let jijin=await userCollection.find()
    req.session.adminSession=jijin
    res.redirect('/adminProfilePage')
})

router.get('/addUserPage',(req,res)=>{
    if (req.session) {
        res.render('addUser')
    }
    else{
        res.redirect('/adminLoginPage')
    }
    
    
})
router.post('/userAdded',async(req,res)=>{
    await userCollection.insertMany([
        {
            email:req.body.email,
            password:req.body.password,
            name:req.body.name,
            age:req.body.age
        }
    ])
    let jijin=await userCollection.find()
    req.session.adminSession=jijin
    res.redirect('/adminProfilePage')
    
})

router.get('/updateUserAction',async(req,res)=>{
    
    req.session.userUpdate=await userCollection.find({_id:req.query.id},{})
    res.redirect('/updateUser')
})

router.get('/updateUser',async(req,res)=>{

    if (req.session.userUpdate) {
        res.render('updateUser',{details:req.session.userUpdate})
    }
    else{
        res.redirect('/adminLoginPage')
    }
    
    
})

router.post('/userUpdated',async(req,res)=>{
    await userCollection.findByIdAndUpdate({_id:req.session.userUpdate[0]._id},
        {
            email:req.body.email,
            password:req.body.password,
            name:req.body.name,
            age:req.body.age
        }
    )
    let jijin=await userCollection.find()
    req.session.adminSession=jijin
    res.redirect('/adminProfilePage')
    
})

router.post('/searchUser',async(req,res)=>{
    req.session.adminSession=await userCollection.find({$or:[{email:req.body.search},{name:req.body.search}]})
    res.redirect('/adminProfilePage')

})


router.get("/clearSearch",async(req,res)=>{
    req.session.adminSession=await userCollection.find()
    res.redirect('/adminProfilePage')

})

module.exports=router