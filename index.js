const express= require('express');
const app=express();
const path=require('path')
const port=5000;

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'templates'))

app.get('/', (req, res) => {
    res.render("home")
});

app.get('/register', (req, res) => {
    if(req.method="GET")
        res.render("register")
    else {
        //
    }
})

app.get('/login', (req, res) => {
    if(req.method="GET")
        res.render("login")
    else {
        //
    }
})

app.listen(port, () =>{
    console.log("Listening on port 5000");
});