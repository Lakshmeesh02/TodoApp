const express= require('express');
const app=express();
const path=require('path');
const bodyparser=require('body-parser');
const mongoose=require('mongoose')
const port=5000;
let usercount=1
const uri='mongodb://localhost:27017/todoo';

mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true})
.then(() => console.log("db connected"))
.catch(err => console.log(err));

const userschema=new mongoose.Schema ({
    userid: {type: Number, unique: true, required: true},
    username: String,
    password: String
});
const User=mongoose.model('User', userschema)

const taskSchema=new mongoose.Schema ({
    userid: Number,
    taskname: String
});
const Task=mongoose.model('Task', taskSchema)

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));
app.use(bodyparser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.render("home");
}); 

app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register',(req,res) => {
    const username=req.body.username;
    const password=req.body.password;
    const userid=usercount++
    const user=new User({userid, username, password});
    user.save()
    .then(() => {
        console.log("User inserted");
        res.render("home");
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Error insering");
    })
});

app.get('/login', (req, res) => {
    res.render("login")
});

app.post('/login', (req, res) => {
    const username=req.body.username
    const password=req.body.password

    User.findOne({username, password})
    .then(user=> {
        if(!user) {
            res.status(401).send("Invalid credentials")
        }
        else {
            res.redirect(`/user/${username}/${user.userid}`)
        }
    })
    .catch(err=> {
        console.log(err)
        res.status(500).send("Error logging in")
    });
})

app.get("/user/:username/:userid", (req, res)=> {
    const username=req.params.username
    const userid=req.params.userid
    res.render("userhome",{username:username, userid:userid})
})

app.post("/user/:username", (req, res)=> {
    const username=req.params.username
    const userid=req.query.id
    const taskname=req.body.taskname
    const task = new Task({userid, taskname})
    task.save()
    .then(()=> {
        console.log("Task inserted")
        res.redirect(`/user/${username}`)
    })
    .catch(err=> {
        console.log(err)
        res.status(500).send("Error inserting task")
    })
})

app.listen(port, () =>{
    console.log("Listening on port 5000");
});