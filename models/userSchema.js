const mongoose=require('mongoose')

const newSchema=new mongoose.Schema({//defining structure of collections
    email:String,
    password:String,
    name:String,
    age:String
})

const userCollection=new mongoose.model('user_collection_in_mongo',newSchema)//creating collection using the defined schema and assign to new Model

module.exports=userCollection