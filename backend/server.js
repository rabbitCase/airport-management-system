require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const sql = require('mysql2');
const app = express();
const port = 3000;

const delayrouter = require(path.join(__dirname,'routes/delayroute'));
const checkinrouter = require(path.join(__dirname,'routes/checkinroute'));
const lfrouter = require(path.join(__dirname,'routes/lostnfoundroute'));
const staffregistrationrouter = require(path.join(__dirname,'routes/regroute'));
const welcomerouter = require(path.join(__dirname,'routes/welcomeroute'));
const staffloginrouter = require(path.join(__dirname,'routes/loginroute'));
const loggedinrouter = require(path.join(__dirname,'routes/loggedinroute'));

const dbConnection = sql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "mit",
    connectionLimit: 20
});

app.use(express.text());
app.use(express.json());
app.use(cors());

app.use('/baggage',checkinrouter);
app.use('/delay',delayrouter);
app.use('/lostandfound',lfrouter);
app.use('/register',staffregistrationrouter);
app.use('/welcome',welcomerouter);
app.use('/login',staffloginrouter);
app.use('/logged-in',loggedinrouter);

app.get('/', (req, res) => {
    app.use(express.static(path.join(__dirname,"../frontend/home")));
    res.sendFile(path.join(__dirname,"../frontend/home/index.html"));
});

app.post('/welcome', (req,res) =>{
    console.log(req.body);
    res.json({status : "received", data : req.body});
});

app.post('/delay', (req,res) => {
    let flightid = req.body.flightid;
    let delay = req.body.delay;
    const query = ``;
    dbConnection.query(query, (err,result) =>{
        if (err) {
            console.log("Query error:", err);
            return res.json({ error: "Query failed", details : err });
        }
        res.json({message : "query executed"});
        console.log("Query result:", result);
    });
});

app.post('/baggage', (req,res) => {
    res.json({status : "received", data : req.body});
});

app.post('/lostandfound', (req,res) => {
    res.json({status : "received", data : req.body});
});

app.post('/register', (req,res) => {
    res.json({status : "received", data : req.body});
});

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});