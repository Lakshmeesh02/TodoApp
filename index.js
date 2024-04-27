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
    password: String
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
        res.status(500).send("Error insering");
    })
});

app.get('/login', (req, res) => {
    if(req.method="GET")
        res.render("login");
    else {
        //
    }
});

app.listen(port, () =>{
    console.log("Listening on port 5000");
});