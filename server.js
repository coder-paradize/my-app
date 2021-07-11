var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
var app = express();
var mongoClient= require('mongodb').MongoClient;
const { MongoClient } = require('mongodb');
const { Console } = require('console');
const { userInfo } = require('os');
//app.use(express.json());       // to support JSON-encoded bodies

app.use(express.raw({type: "application/json"}));
app.use(express.json({strict: false}));
app.use(express.urlencoded({extended: true})); // include this line

//app.use(bodyParser.urlencoded({ 
//    extended: true 
//    })); 

//app.use(bodyParser.json()); 

 app.get('/', function(req,res){
     res.sendFile(path.join(__dirname,"index.html"));
 });

 app.get('/get-profile',function(req,res){
    var response = res;
    const mongodbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }
        console.log('connecting to db');
    MongoClient.connect('mongodb://admin:ericsson@3.133.138.212:27017',mongodbOptions, function( err , client){
        if (err) throw err; 
        console.log('connected');
        var db = client.db('user-account');
        console.log('Querying user-account');
        var query = { userid : 1 };
        console.log('going to findone');
        db.collection('users').findOne(query, function( err , result ){
          if (err) throw err;
          console.log('got response');
          client.close();
          console.log('closing Connetion & Response sent');
          response.send(result);   
        }); 
    });
 });

 app.post('/update-profile', urlencodedParser, function(req, res){
        var userObj = req.body;
        var response = res;
        console.log(userObj);
        console.log('connecting to db');          
        const mongodbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
            }
        MongoClient.connect('mongodb://admin:ericsson@3.133.138.212:27017', mongodbOptions, function(err ,client){
            if (err) throw err; 
            var db = client.db('user-account');

            userObj['userid'] = 1;            
            var query = { userid: 1 };
            var newValues = { $set: userObj }
            console.log(newValues);
            console.log('successfuly connected to db');
            db.collection('users').updateOne(query, newValues, {upsert: true}, function(err, res){
                if(err) throw err;
                console.log('successfully updated or inserted');
                client.close();
                response.send(userObj);    
            });
        });
 });

 app.get('/profile-picture', function(req,res){
     var img = fs.readFileSync('profile-1.jpg');
     res.writeHead(200, {'content-type': 'image/jpg' });
     res.end(img,'binary');
 });

 app.listen(3000, function(){
 console.log("application is listining on port 3000");
 });