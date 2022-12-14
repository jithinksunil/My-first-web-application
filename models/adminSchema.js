const mongoose=require('mongoose')

const newSchema1=new mongoose.Schema({//defining structure of collections
    email:String,
    password:String,
    name:String,
    place:String
})

const adminCollection=new mongoose.model('adminCollection_in_mongodb',newSchema1)//creating collection using the defined schema

module.exports=adminCollection