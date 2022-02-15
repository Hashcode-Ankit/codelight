// const { append } = require("express/lib/response");
// const fs = require("fs"); 
// var posts_true=new Array
// var posts=new Array
// var category=new Array
// function initialize(){
//     fs.readFile('data/posts.json', 'utf8', (err, data) => {
//         if (err) throw err;
//         const obj = JSON.parse(data);
//         obj.forEach(element => {
//             posts.push(element)
//             if(element.published==true){
//                posts_true.push(element)
//             }
//         });
//     });
//     fs.readFile('data/categories.json', 'utf8', (err, cat) => {
//                 if (err) throw err;
//                 const obj2 = JSON.parse(cat);
//                 obj2.forEach(element => {
//                 category.push(element)
//                 });
//       });
//    return new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         if(posts.length>0 && category.length>0){
//             resolve("Data Successfull")
//             console.log(category.length)
//         }
//        reject(Error("No data found"))
//     },3000)
    
// })
// }

// function getAllPosts(){
//     return new Promise((resolve,reject)=>{
//         if(posts.length>0 && category.length>0){
//             resolve(posts)
//         }
//         else{
//             reject(Error("No data found"))
//         }
//     })
// }
// function getPublishedPosts(){
//     return new Promise((resolve,reject)=>{
//         if(posts.length>0 && category.length>0){
//             resolve(posts_true)
//         }
//         else{
//             reject(Error("No data found"))
//         }
//     })
// }
// function getCategories(){
//     return new Promise((resolve,reject)=>{
//         if(posts.length>0 && category.length>0){
//             resolve(category)
//         }
//         else{
//             reject(Error("No data found"))
//         }
//     })
// }
// module.exports={initialize,getCategories,getPublishedPosts,getAllPosts}


function randomGrade(){
  var  mark=Math.floor(Math.random()*41)/10
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if(mark>=2.5){
                resolve(mark)
            }
            else{
            reject(Error("Thas's no good!"))
            }
                },3000)
                
            })
}

randomGrade().catch(data=>{
    console.log(data)
  })
randomGrade().then(data=>{
  console.log(data)
  });



