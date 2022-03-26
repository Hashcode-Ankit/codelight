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
var exphbs =require('express-handlebars')
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const stripJs = require('strip-js');

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
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

app.engine('hbs', exphbs.engine({
  extname : '.hbs',
  helpers:{
  navLink: function(url, options){
    return '<li' + 
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
  },
  equal: function (lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
  },
  safeHTML: function(context){
    return stripJs(context);
  },
  formatDate: function(dateObj){
    let year = dateObj.getFullYear();
    let month = (dateObj.getMonth() + 1).toString();
    let day = dateObj.getDate().toString();
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
    }
}
}));
app.set('view engine', 'handlebars');
// setup a 'route' to listen on the default url path (http://localhost)
app.use(express.static('public'));
app.get("/", async function(req,res){
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blog.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blog.getPublishedPosts();
      }

      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
      let post = posts[0]; 
      viewData.posts = posts;
      viewData.post = post;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      let categories = await blog.getCategories();
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }
  res.render(path.join(__dirname,"/views/blog.hbs"), {data: viewData})

});

app.get("/about", function(req,res){
  res.render(path.join(__dirname,"/views/about.hbs"));
});


app.get("/posts/add", function(req,res){
   blog.getCategories().then((data)=>{

    res.render(path.join(__dirname,"/views/addPost.hbs"), {categories: data});
   })
   blog.getCategories().catch((err)=>{
    res.render(path.join(__dirname,"/views/addPost.hbs"), {categories: []});
   })
});
app.use(upload.single("featureImage"));
app.post('/posts/add',(req, res, next)=>{
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
        })  
        }
        res.redirect('/posts');   
});
app.get("/posts", function(req,res){
    blog.getAllPosts().then(data=>{
      res.render(path.join(__dirname,"/views/posts.hbs"), {posts: data});
    }).catch(e=>{
      res.render("posts", {message: "no results"});
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
    res.render(path.join(__dirname,"/views/categories.hbs"), {categories: data});
  }).catch((e)=>{
    res.render(path.join(__dirname,"/views/categories.hbs"), {message: "no results"});
  })
});
// app.get("/blog", function(req,res){
//   blog.getPublishedPosts().then(data=>{
//     blogPosts=JSON.stringify(data)
//     res.send(blogPosts);
//   })
//   blog.getPublishedPosts().catch(e=>{
//    console.log(e)
//   })
// });
app.get('/blog', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blog.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blog.getPublishedPosts();
      }

      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
      let post = posts[0]; 
      viewData.posts = posts;
      viewData.post = post;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      let categories = await blog.getCategories();
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }
  res.render(path.join(__dirname,"/views/blog.hbs"), {data: viewData})

});
app.get('/blog/:id', async (req, res) => {
  let viewData = {};

  try{
      let posts = [];
      if(req.query.category){
          posts = await blog.getPublishedPostsByCategory(req.query.category);
      }else{
          posts = await blog.getPublishedPosts();
      }
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
      viewData.posts = posts;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      viewData.post = await blog.getPostsById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }

  try{
      let categories = await blog.getCategories();
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }
  res.render(path.join(__dirname,"/views/blog.hbs"),{data: viewData})
});
app.use(express.urlencoded({extended: true}));
app.get("/categories/add", function(req,res){
  res.render(path.join(__dirname,"/views/addCategory.hbs"));
});
app.post('/categories/add',(req, res, next)=>{
  blog.addCategory(req.body).then().catch();
  res.redirect('/categories');  
});
app.get("/categories/delete/:id", function(req,res){
  blog.deleteCategoryById(req.params.id).then(()=>{
    res.render(path.join(__dirname,"/views/addCategory.hbs"));
  }).catch(()=>{
    res.render(path.join(__dirname,"/views/addCategory.hbs"),{message:"Unable to Remove Category / Category not found"});
  })
});
app.get("/posts/delete/:id", function(req,res){
  blog.deletePostById(req.params.id).then(()=>{
    res.render(path.join(__dirname,"/views/posts.hbs"));
  }).catch(()=>{
    res.render(path.join(__dirname,"/views/posts.hbs"),{message:"Unable to Remove Category / Category not found"});
  })
});
app.get('*', function (req, res) {
  res.render(path.join(__dirname,"/views/404.hbs"))
})

// setup http server to listen on HTTP_PORT
blog.initialize(true).then(data=>{
  app.listen(HTTP_PORT, onHttpStart);
})
blog.initialize(false).catch(e=>{
  console.log(e)
});
