const express=require('express')
const app=express()
const sessions=require('express-session')
const userRouterRecievd=require('./routes/userRoutes')
const userRouter=userRouterRecievd.router
const adminRouter=require('./routes/adminRoutes')
const mongoose=require('mongoose')
/********************Connection setUp of mongoose Driver**************************/ 
mongoose.connect('mongodb://127.0.0.1:27017/ChatMates_DataBase',{
    useNewUrlParser:true,
    useUnifiedTopology:true
    },(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('Data Base connected')
    }
})

/*---------------------------Setups-----------------------------*/

app.use(express.urlencoded({extended:true}))//to get data from post method

app.set('view engine','ejs')//setting up  view engine

app.use(sessions({//setup session
    resave:true,//to resave the session
    saveUninitialized:true,
    secret:'khfihuifgyscghi6543367567vhbjjfgt45475nvjhgjgj+6+9878', //random hash key string to genarate session id     
}))

app.use((req, res, next) => {//setup cache
    res.set("Cache-Control", "no-store");
    next();
});

app.listen(3000,()=>console.log('Server started'))

app.use('/',userRouter)
app.use('/',adminRouter)