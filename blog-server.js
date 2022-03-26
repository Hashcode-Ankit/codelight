const { append } = require("express/lib/response");
const fs = require("fs"); 
const { resolve } = require("path");
const Sequelize = require('sequelize');
const { gte } = Sequelize.Op;

var sequelize = new Sequelize('dvbukn3l9novg', 'ajagvpjrwuhvhq', '8ec9626cff1d29a505b8cf77f1a2b7c7a5a0f62c8116d9521bbe5b368c87c817', {
    host: 'ec2-44-194-92-192.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});
var Post = sequelize.define('Post', {
    body: Sequelize.TEXT, 
    title: Sequelize.STRING, 
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN 
});

var Category= sequelize.define('Category', {
    category : Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});


function initialize(){
   return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        sequelize.sync({ force: true }).then(()=> {
            resolve("Connected")
        }).catch(()=> {
            reject("Unable to Sync to the Database")
        });   
    },3000)
    
})
}

function getAllPosts(){
    return new Promise((resolve,reject)=>{
       Post.findAll().then(function(data){
             resolve(data) ;
          }).catch(function(error){
           reject("no results returned")    
          });
    })
}
function getPublishedPosts(){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where:{
                published:true
            }
        }).then(function(data){
          resolve(data) ;
       }).catch(function(error){
          reject(Error("no results returned"))
      });
    })
}
function getCategories(){
    return new Promise((resolve,reject)=>{
        Category.findAll().then(function(data){
          resolve(data) ;
       }).catch(function(error){
          reject(Error("no results returned"))
      });
    })
}
function addPost(postData){
    postData.published = (postData.published) ? true : false;
    for(prop in postData){
        if(postData[prop]==""){
            postData[prop] = null
        }
    }
    postData.postDate=new Date();
    
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            
            Post.create({
                body: postData.body, 
                title: postData.title, 
                postDate: postData.postDate,
                featureImage: postData.featureImage,
                published: postData.published 
            }).then(function(){
                resolve("Success")
            }).catch(function(){
                reject("unable to create post")
            })
        },3000)
    })
}
function getPostsByCategory(categoryValue){
      return new Promise((resolve,reject)=>{
          Post.findAll({
              where:{
                  category:categoryValue
              }
          }).then(function(data){
            resolve(data) ;
         }).catch(function(error){
            reject(Error("no results returned"))
        });
    })
}
function getPostsByMinDate(minDate){
      return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then(function(data){
            resolve(data) ;
        }).catch(function(error){
            reject(Error("no results returned"))
        });
    })
}
function getPostsById(p_id){
    return new Promise((resolve,reject)=>{
    Post.findAll({
        where:{
            id:p_id
        }
    }).then(function(data){
      resolve(data) ;
   }).catch(function(error){
      reject("no results returned")
  });
})
}
function getPublishedPostsByCategory(categoryValue){
      return new Promise((resolve,reject)=>{
      Post.findAll({
        where:{
            category: categoryValue,
            published :true
        }
    }).then(function(data){
            resolve(data);
    }).catch(function(error){
            reject("no results returned");
    });
    })
}
function addCategory(categoryData){
    for(prop in categoryData){
        if(categoryData[prop]==""){
            categoryData[prop] = null
        }
    } 
    return new Promise((resolve,reject)=>{
    Category.create({
       category:categoryData.category
    }).then(function(){
        resolve("Success")
    }).catch(function(){
        reject("unable to create category")
    }) 
})
}
function deleteCategoryById(c_id){
    return new Promise((resolve,reject)=>{
        Category.destroy({
            where:{
                id: c_id
            }
        }).then(function(){resolve("Deleted Successfully")}).catch(function(){reject("Not Deleted")})
    })   
}
function deletePostById(p_id){
    return new Promise((resolve,reject)=>{
        Post.destroy({
            where:{
                id: p_id
            }
        }).then(function(){resolve("Deleted Successfully")}).catch(function(){reject("Not Deleted")})
    }) 
}

module.exports={initialize,getCategories,getPublishedPosts,getAllPosts,addPost,getPostsByCategory,getPostsByMinDate,getPostsById,getPublishedPostsByCategory,addCategory,deletePostById,deleteCategoryById}

