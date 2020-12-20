const express = require("express");
const bodyParser = require("body-parser");
const  app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const mongodb = require("mongodb");
const product = require("./models/product");
const details = require("./models/employee");
const mongoose = require("mongoose");
const { Buffer } = require("buffer");
const alert = require("alert");
const ajax = require("ajax");
const { db } = require("./models/product");
const { POINT_CONVERSION_UNCOMPRESSED } = require("constants");
const { start } = require("repl");



mongoose.connect("mongodb://localhost:27017/products", {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true});

app.use(bodyParser.urlencoded({extended:true}))

var storage =  multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload =multer({
    storage:storage
})


app.post('/uploadFile', upload.single('myFile'),(req,res,next)=>{
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img={
 
        contentType: req.file.mimetype,
        path: req.file.path,
        image: new Buffer.from(encode_img,'base64')
        
    };
    db.collection('image').insertOne(final_img,(err,result)=>{
        
        if(err){
            const error = new Error("please upload a file");
            error.httpStatusCode = 400;
            return next(error);
        }
        else{
            console.log('database finished');
                 }
        res.contentType(final_img.contentType);
        //res.send(final_img.image);
        res.redirect('/next');
        

    })

})

 app.post('/uploadFile',function(req,res){
     var employeeid = req.body.employeeid;
     var employeename = req.body.employeename;
     var employeemail = req.body.employeemail;
     var employeenumber = req.body.employeenumber;
     details.create({
         employeeid: employeeid,
         employeename :employeename,
         employeemail:employeemail,
         employeenumber: employeenumber
     });

     res.redirect('/next');
 })


 var last = 0;

app.post('/uploadInfo',function(req,res){
    var id = ++last;
    var productid = req.body.productid;
    var name = req.body.productname;
    var invoiceno = req.body.invoiceno;
    var cost = req.body.cost;
    var date = req.body.date;
    var ownedby = req.body.ownedby;
    var purpose = req.body.purpose;
    var workingcondition = req.body.workingcondition;
    var type = req.body.type;

    
    product.create({
        id: id,
        productid: productid,
        cost:cost,
        name: name,
        invoiceno: invoiceno,
        date: date,
        ownedby: ownedby,
        purpose: purpose,
        workingcondition: workingcondition,
        type: type
    });
    res.redirect('/next');
})

app.get("/product/:page",function(req,res){

    // const page = req.query.page
    // const limit = req.query.page
    
    // const startIndex = (page-1)*limit
    // const endIndex= page*limit

    // const resultProduct = product.slice(startIndex, endIndex)
    // res.json(resultProduct)

    const limit = 3;
    const start = req.params.page * limit;
    db.collection("products").find().sort({
        "id":1
    }).skip(start).limit(limit).toArray(
        function(error, product){
            res.render("display.ejs",{product: product, page: req.params.page});
            //res.json(product);
        }
    )
})





    // db.collection('details').insertOne(final,(err,result)=>{
    //     if(err){
    //         const error = new Error("please upload information");
    //         error.httpStatusCode = 400;
    //         return next(error);
    //     }
    //     else{
    //         console.log('database completes');
    //              }
        // res.contentType(final.contentType);
        //res.send(final_img.image);



// app.post('/uploadMultiple', upload.array('myFiles',12),(req,res,next)=>{
//     const files = req.files;
//     if (!files){
//         const error = new Error('please upload file');
//         error.httpStatusCode = 400;
//         return next(error);
//     }
//     res.send(files);
// })

// app.post('/uploadPhoto', upload.single('myImage'),(res,req,next) =>{
//     var img = fs.readFileSync(req.file);
//     var encode_img = img.toString('base64');
//     var final_img={
//         contentType: req.file.mimetype,
//         path: req.file.path,
//         image: new Buffer(encode_img,'base64')

//     };

//     // db.collection('image').insertOne(final_img,(err, result)=>{
//     //     console.log(result);
//     //     if(err){
//     //         return console.log(err);
//     //     }
//     //     else{
//     //         console.log('database finished');
//     //     }

//          res.contentType(final_img.contentType);
//          res.send(final_img.image);
//     // })
// })



var storage =  multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})



const MongoClient = mongodb.MongoClient;

const url = 'mongodb://localhost:27017';
MongoClient.connect(url, {
    useUnifiedTopology:true, useNewUrlParser:true
},(err,client)=>{
    if(err) return console.log(err);
   const db = client.db('products');
    
    app.listen(5000,()=>{
        console.log('mongo db server');
    })
})

// const productSchema = new mongoose.Schema({
//     img:{
//         type: Image
//     }
// })
app.get("/",function(req,res){
    res.redirect("/login");
})


app.post('/login',function(req,res){
  var username=  req.body.username;
   var password=req.body.password;
   if(username == "ashwin@gmail.com"  && password == "1234567"){
    alert('logged in');
    res.redirect('/next');
    
}
});


app.use(express.static("public/images"));

app.use(express.static("public"));

app.get('/login', function(req,res){
    res.render("login.ejs");
})

 app.get('/header',function(req,res){
   
      res.render("main.ejs");

 })

 app.get('/next',function(req,res){
     res.render("header.ejs")
 })
 
 app.get('/product',function(req,res){
     product.find({},function(err,product){
         if(err){
             console.log(err);
         }
         else{

            res.render("product.ejs",{product: product});

         }
     })
    
 })

 app.get('/display',function(req,res){
     console.log(req.body.start +","+ req.body.limit);
     product.find({},function(err,product){
         if(err){
             console.log(err);
         }
         else{
            res.render("display.ejs",{
                product: product,
                //"Limit" : Limit
            });
         }
     })
    
 
 })

app.listen(3000,()=>{
    console.log('requesting');
})

