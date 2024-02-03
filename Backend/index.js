require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app =express();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk')

const my_AWSAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const my_AWSSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const aws_region = process.env.AWS_REGION;


AWS.config.update({
    accessKeyId:  my_AWSAccessKeyId ,
    secretAccessKey:my_AWSSecretKey,
    region: aws_region,
  });
  
const docClient = new AWS.DynamoDB.DocumentClient();


mongoose.connect(process.env.Mongo_URI)

app.use(cookieParser())
app.use(express.json())
app.use(cors({
        credentials:true,
        origin:'http://localhost:5173',
    }
))


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret= process.env.JWT_SECRET;

app.post('/register',async (req, res) => {
    const {name,email,password} = req.body;
    try {
        const userDoc = await User.create({
            name: name,
            email: email,
            password: bcrypt.hashSync(password,bcryptSalt),
        })
        res.json(userDoc)
    } catch (error) {
        res.status(422).json('error')
    }
})

app.post('/login', async (req, res) => {
    const {email,password} = req.body;
    try {
        const userDoc = await User.findOne({email:email})
        if(userDoc){
            const passOk =  bcrypt.compareSync(password, userDoc.password)
            if(passOk){
                jwt.sign({email:userDoc.email,id:userDoc._id,name:userDoc.name},jwtSecret,{},(err,token) => {
                    if(err) res.json('Unable to login');
                    res.cookie('token', token).json(userDoc)
                })
            }
            else res.status(422).json('error')
        }
        else {
            res.status(422).json('error')
        }
    } catch (error) {
        res.status(500).json('error')
    }
})

app.get('/profile',(req,res)=>{
    const {token} = req.cookies
    
    if(token){
        jwt.verify(token,jwtSecret,{},async (err,data) =>{
            if(err)res.json("Data retreival failed('/profile')");

            try {
                const {name,email,_id} =await User.findById(data.id);
                res.json({name,email,_id});
            } catch (error) {
                res.json(null);
            }
        })
        
    }
})

app.post('/logout',(req, res)=>{
    res.cookie('token','').json(true);
})

app.post('/addtask',async (req,res)=>{
    const {title,description,date} = req.body;
    const {token} = req.cookies
    let UserID ='';
    if(token){
        jwt.verify(token,jwtSecret,{},async (err,data) =>{
            if(err)res.json("Unable to add task('/addtask')");
            UserID=data.id;
            if(UserID){
                try {
                    const params = {
                        TableName: 'Tasks',
                        Item: {
                            'UserID': UserID,
                            'TaskID ' : "TaskID_"+Math.random(),
                            'title': title,
                            'description': description,
                            'date': date,
                            'status': false,
                        }
                    };
                    await docClient.put(params, (err,data)=>{
                        if(err)res.json("Unable to add task('/addtask-aws')");
                        res.json('Task Add')
                    })
                    
                } catch (error) {
                    res.status(422).json('err')
                }
            }
        })
    
    }
    
})

app.get('/dataretreival',async (req,res)=>{
    const {token} = req.cookies
    let UserID ='';
    if(token){
        jwt.verify(token,jwtSecret,{},async (err,data) =>{
            if(err)res.json("data retreival failed('/dataretreival')");
            UserID=data.id;
            if(UserID){
                try {
                    const params ={
                        TableName:'Tasks',
                        FilterExpression:'#UserID=:UserID',
                        ExpressionAttributeNames:{
                            '#UserID':'UserID',
                        },
                        ExpressionAttributeValues:{
                            ':UserID':UserID,
                        }
                    }
                    await docClient.scan(params,(err,data)=>{
                        if(err) res.json("data retreival failed('/dataretreival-aws')") ;                        
                        res.json(data.Items)
                    })
                } catch (error) {
                    res.status(422).json('err');
                }
            }
        })
        
    }
    
})

app.post('/taskdone',async (req, res)=>{
    const {task}=req.body;
    const params = {
        TableName: 'Tasks',
        Key: {
            'TaskID ': task["TaskID "],
            'UserID': task.UserID
        },
        UpdateExpression: 'set #status = :a',
        ExpressionAttributeNames:{
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':a': !task.status
        },
        ReturnValues: 'UPDATED_NEW'
    };
    
    docClient.update(params, function(err, data) {
        if (err) {
            console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));
        } else {
            console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
            res.json(data);
        }
    });
    
})

app.post('/taskdelete',async (req, res)=>{
    const {task}=req.body;
    const params = {
        TableName: 'Tasks',
        Key: {
            'TaskID ': task["TaskID "],
            'UserID': task.UserID
        }
    };
    
    docClient.delete(params, function(err, data) {
        if (err) {
            console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));
        } else {
            console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
            res.json(data);
        }
    });
    
})

app.post('/updatetask',async (req, res)=>{
    const {task,title,description,date}=req.body;
    // console.log({task, title, description, date})
    const params = {
        TableName: 'Tasks',
        Key: {
            'TaskID ': task["TaskID "],
            'UserID': task.UserID
        },
        UpdateExpression: 'set #title = :a, #description =:b, #date =:c',
        ExpressionAttributeNames:{
            '#title': 'title',
            '#description': 'description',
            '#date': 'date'
        },
        ExpressionAttributeValues: {
            ':a': title,
            ':b': description,
            ':c': date
        },
        ReturnValues: 'UPDATED_NEW'
    };
    
    docClient.update(params, function(err, data) {
        if (err) {
            console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));
        } else {
            console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
            res.json(data);
        }
    });
    
})

app.listen(process.env.PORT || 4000)