const express = require('express');
const devUser=require('./devusermodel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const reviewmodel = require('./reviewmodel');
const cors = require('cors');
const app=express();
app.use(express.json());
app.use(cors({origin:'*'}));

mongoose.connect('mongodb://localhost:27017/freelancinghub')   
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

app.use(cors({origin:'*'}));

app.get('/', (req, res)=>{
    return res.send('hello Mahathi');
 })

 // user register
 app.post('/register',async(req, res)=>{
    try{
        const {fullname,email,phonenumber,skills,password,confirmpassword}=req.body;
        const exist = await devUser.findOne({email});
        if(exist){
            return res.status(400).send('user already existed')
        }
        if(password != confirmpassword){
            return res.status(403).send('password Invalid');
        }
        let newUser = new devUser({
            fullname,email,phonenumber,skills,password,confirmpassword
        })
        newUser.save();
        return res.status(200).send('user registered successfully');
    }

    catch(err){
        console.log(err);
        return res.status(500).send('server Error')
    }
 })
 //user login
app.post('/login',async (req,res)=>{
    try{
        const {
            email, password}=req.body;
            const exist= await devUser.findOne({email});
            if(!exist){
                return res.status(400).send('user not exist')
            }
            if(exist.password !== password){
                return res.status(400).send('password invalid')

            }

            let payload ={
                user :{
                    id:exist.id ,
                    email :exist.email
                }
            }
            jwt.sign(payload,'jwtpassword',{expiresIn:360000000},(err,token)=>{
                if(err) throw err
                return res.json({token})
            })
    }catch(err){
        console.log(err);
        return res.status(500).send('server Error')
    }
   
})

app.get('/allprofile', middleware, async(req,res)=>{
    try{
        let allprofiles = await devUser.find();
        return res.json(allprofiles);

    }
    catch(err){
        console.log(err);
        return res.status(500).send('server Error')
    }
})
app.get('/myprofile',middleware, async(req,res)=>{
    try{
        let user = await devUser.findById(req.user.id);
        return res.json(user);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server Error');
    }
})

app.post('/addreview', middleware, async(req, res)=>{
    try{
        const{ taskworker, rating} = req.body;
        const exist =await devUser.findById(req.user.id);
        const newReview = new reviewmodel({
            taskprovider: exist.fullname,
            taskworker,rating
        })
        await newReview.save();
        return res.status(200).send('Review updated successfully')
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
})

app.get('/myreview', middleware, async(req, res)=>{
    try {
        let allreviews = await reviewmodel.find();
        let myreview = allreviews.filter(review => review.taskworker === req.user.id.toString());
        return res.status(200).json(myreview);
    } catch (err) {
        console.log(err);
        return res.status(500).send('server Error')
        
    }
})
app.listen(5000,()=> console.log('server is running......'))