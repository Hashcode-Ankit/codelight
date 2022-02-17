/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _____Rajat Kumar_________________ Student ID: _155824204_____________ Date: _04-02-2022_______________
*
*  Online (Heroku) Link: ___https://obscure-oasis-06700.herokuapp.com/_____________________________________________________
*
********************************************************************************/ 

var express = require("express");
var app = express();
var path=require("path");
var blog= require('./blog-server.js');
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: 'der5s0fgu',
  api_key: '136372578766519',
  api_secret: 'NL-Of80OGGdvBPtkhCKZ98BDgI8',
  secure: true
  });
  
const upload = multer(); // no { storage: storage } 
var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.use(express.static('public'));
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});


app.get("/posts/add", function(req,res){
  res.sendFile(path.join(__dirname,"/views/addPost.html"));
});
app.use(upload.single("featureImage"));
app.post('/posts/add',(req, res, next)=>{
  console.log(req.body);
  if(req.file){
        let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
        (error, result) => {
              if (result) {
              resolve(result);
              } else {
              reject(error);
              }
           }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
        upload(req).then((uploaded)=>{
         processPost(uploaded.url);
        });
        } else {
             processPost("");
        }
        function processPost(imageUrl){
            req.body.featureImage = imageUrl;
            blog.addPost(req.body).then(data=>{
              console.log(data)
        })  
        }
        res.redirect('/posts');   
});
app.get("/posts", function(req,res){
    blog.getAllPosts().then(data=>{
      blogPosts=JSON.stringify(data, null, 2)
      res.send(blogPosts);
    })
    blog.getAllPosts().catch(e=>{
     console.log(e)
    })
});
app.get('/posts/category=:category', function(req, res) {
  blog.getPostsByCategory(req.params.category).then(data=>{
    cat=JSON.stringify(data,null,10)
    res.send(cat);
  });
  blog.getPostsByCategory(req.params.category).catch(e=>{
    res.send("no data returned");
  });
});
app.get('/posts/minDate=:minDate', function(req, res) {
  blog.getPostsByMinDate(req.params.minDate).then(data=>{
    cat=JSON.stringify(data,null,10)
    res.send(cat);
  });
  blog.getPostsByMinDate(req.params.minDate).catch(e=>{
    res.send("no data returned");
  });
});
app.get('/posts/:id', function(req, res) {
  blog.getPostsById(req.params.id).then(data=>{
    cat=JSON.stringify(data,null,10)
    res.send(cat);
  });
  blog.getPostsById(req.params.id).catch(e=>{
    res.send("no data returned");
  });
});
app.get("/categories", function(req,res){
  blog.getCategories().then(data=>{
    cat=JSON.stringify(data,null,10)
    res.send(cat);
  })
  blog.getCategories().catch(e=>{
   console.log(e)
  })
});
app.get("/blog", function(req,res){
  blog.getPublishedPosts().then(data=>{
    blogPosts=JSON.stringify(data)
    res.send(blogPosts);
  })
  blog.getPublishedPosts().catch(e=>{
   console.log(e)
  })
});
app.get('*', function (req, res) {
  res.send("Page Not Found 404");
})
// setup http server to listen on HTTP_PORT
blog.initialize().then(data=>{
  app.listen(HTTP_PORT, onHttpStart);
})
blog.initialize().catch(e=>{
  console.log(e)
});
