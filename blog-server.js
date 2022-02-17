const { append } = require("express/lib/response");
const fs = require("fs"); 
var posts_true=new Array
var posts=new Array
var category=new Array
function initialize(){
    fs.readFile('data/posts.json', 'utf8', (err, data) => {
        if (err) throw err;
        const obj = JSON.parse(data);
        obj.forEach(element => {
            posts.push(element)
            if(element.published==true){
               posts_true.push(element)
            }
        });
    });
    fs.readFile('data/categories.json', 'utf8', (err, cat) => {
                if (err) throw err;
                const obj2 = JSON.parse(cat);
                obj2.forEach(element => {
                category.push(element)
                });
      });
   return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        if(posts.length>0 && category.length>0){
            resolve("Data Successfull")
        }
       reject(Error("No data found"))
    },3000)
    
})
}

function getAllPosts(){
    return new Promise((resolve,reject)=>{
        if(posts.length>0 && category.length>0){
            resolve(posts)
        }
        else{
            reject(Error("No data found"))
        }
    })
}
function getPublishedPosts(){
    return new Promise((resolve,reject)=>{
        if(posts.length>0 && category.length>0){
            resolve(posts_true)
        }
        else{
            reject(Error("No data found"))
        }
    })
}
function getCategories(){
    return new Promise((resolve,reject)=>{
        if(posts.length>0 && category.length>0){
            resolve(category)
        }
        else{
            reject(Error("No data found"))
        }
    })
}
function addPost(postData){
    postData = JSON.parse(JSON.stringify(postData));
    if(postData.published!=='undefined'){
        postData.published=true;
        posts_true.push(postData)
    }
    else{
        postData.published=false;
    }
    postData.id=posts.length/2+1;
    posts.push(postData)
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
                resolve(postData)
               reject(Error("No data found"))
        },3000)
    })
}
function getPostsByCategory(categoryValue){
    let ret=new Array
    posts.forEach(function (item, index) {  
        if(item.category==categoryValue){
            ret.push(item);
        }
      });
      return new Promise((resolve,reject)=>{
        if(ret.length>0){
            resolve(ret)
        }
        else{
            reject(Error("no results returned"))
        }
    })
}
function getPostsByMinDate(minDate){
    let ret=new Array
    date2=new Date(minDate)
    posts.forEach(function (item, index) { 
        date1=new Date(item.postDate)
        if(date1>=date2){
            ret.push(item);
        }
      });
      return new Promise((resolve,reject)=>{
        if(ret.length>0){
            resolve(ret)
        }
        else{
            reject(Error("no results returned"))
        }
    })
}
function getPostsById(id){
    let ret=new Array
    posts.forEach(function (item, index) { 
        if(item.id==id){
            ret.push(item);
        }
      });
      return new Promise((resolve,reject)=>{
        if(ret.length>0){
            resolve(ret)
        }
        else{
            reject(Error("no results returned"))
        }
    })
}
module.exports={initialize,getCategories,getPublishedPosts,getAllPosts,addPost,getPostsByCategory,getPostsByMinDate,getPostsById}

