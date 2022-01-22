var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/about", function(req,res){
    res.send("<a href='about.html'>Go to the about page</a>");
});

// setup another route to listen on /about
app.get("/", function(req,res){
    res.send("<a href='home.html' </a>");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);