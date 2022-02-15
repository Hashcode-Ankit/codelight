var express = require("express");
var app = express();
var path=require("path");
var blog=require("/home/ankkitsharma/Documents/web322-app/blog-service.js")

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.use(express.static('public'));
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
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
})
