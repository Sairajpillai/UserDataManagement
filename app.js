if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
  }

const express = require('express');
const app = express();
const path=require('path');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const User = require('./model/user');
const methodOverride = require('method-override')
const multer = require('multer')
const {storage}=require('./cloudinary')
const upload = multer({storage})



mongoose.connect('mongodb://localhost:27017/user-management',{
    useNewUrlParser: true,
   // useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})


app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


app.get('/',(req,res)=>{
    res.redirect('/users')
})




app.get('/users',async(req,res)=>{
    const users = await User.find({});
    res.render('userDisplay',{users});
    })

app.get('/users/new',(req,res)=>{
    res.render('userAdd');
    })

app.get('/users/:id',async(req,res)=>{
    const user = await User.findById(req.params.id);
    res.render('userShow',{user});
})



app.post('/addUsers',upload.array('image'),async(req,res)=>{
    const user = new User(req.body.user);
    user.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    await user.save();
    res.redirect(`/users/${user._id}`)
})


app.get('/users/:id/edit',async(req,res)=>{
    const user = await User.findById(req.params.id);
    res.render('userEdit',{user})
})


app.put('/users/:id',upload.array('image'),async(req,res)=>{
    const {id}=req.params;
    const user = await User.findByIdAndUpdate(id,{...req.body.user});
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    user.images.push(...imgs)
    await user.save();
    if(req.body.deleteImages){
        const upduser = await user.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    
    res.redirect(`/users/${user._id}`)
})

app.delete('/users/:id',async(req,res)=>{
    const {id}=req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/users');
})


app.listen(3000,()=>{
    console.log("Working on port number 3000")
})