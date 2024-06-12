const express= require('express');
const app=express();
const path=require('path');
const bodyparser=require('body-parser');
const mongoose=require('mongoose')
const port=5000;
const uri='mongodb://localhost:27017/todoo';

mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true})
.then(() => console.log("db connected"))
.catch(err => console.log(err));

const userschema=new mongoose.Schema ({
    username: String,
    password: String,
    tasks: [String]
});
const User=mongoose.model('User', userschema)

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
    const user=new User({username, password});
    user.save()
    .then(() => {
        console.log("User inserted");
        res.render("home");
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Error inserting");
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
            res.redirect(`/user/${username}/${user._id}`)
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

app.post("/user/:username/:userid", (req, res)=> {
    const username=req.params.username
    const userid=new mongoose.Types.ObjectId(req.params.userid)
    const taskname=req.body.taskname
    //console.log(username, userid, taskname)
    User.findOne({_id: userid})
    .then(user=> {
        user.tasks.push(taskname)
        user.save()
        res.redirect(`/user/${username}/${userid}`)
    })
    .catch(err=> {
        console.log(err)
        res.status(500).send("Error adding task")
    })
})

app.get("/tasks/:userid", (req, res)=> {
    const userid=req.params.userid
    let usertasks=[]
    User.findOne({_id: userid})
    .then(user=> {
        usertasks=user.tasks
        res.render("tasks", {tasks: usertasks})
    })
    .catch(err=> {
        console.log(err)
        res.status(505).send("Error obtaining tasks")
    })
})

app.listen(port, () =>{
    console.log("Listening on port 5000");
});