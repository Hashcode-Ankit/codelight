var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var userSchema = new Schema({
  "userName":  String,
  "password": String,
  "email": String,
  "loginHistory": [ {
    "dateTime": Date,
    "userAgent": String,
  }]
});
let User;
function initialize(){
    let db = mongoose.createConnection(`mongodb+srv://rajatkumar:EG7otzhCsPU0uTtJ@cluster0.suctt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);;
    return new Promise((resolve,reject)=>{

        db.on('error', (err)=>{
            reject(Error("Db not Connected"));
          });
        db.once('open', ()=>{
        User = db.model("users", userSchema);
        resolve("db1 success!");
        });
    })
}

function registerUser(userData) {
    return new Promise((resolve,reject)=>{
    if(userData.password != userData.password2){
        reject("Password do not match");
    }

    bcrypt.hash(userData.password, 10).then((hash)=>{ 
     userData.password=hash;
     let newUser= new User(userData);
     newUser.save((err)=>{
         if(err){
             reject(Error("User Name Already Taken "))
         }
         else if(err){
             reject("There was an error creating the user:"+err);
         }
         else{
             resolve();
         }
     })
    })
    .catch(err=>{
        console.log(err); // Show any errors that occurred during the process
    });
   
})
}

function checkUser(userData){
    return new Promise((resolve,reject)=>{
        User.find({userName: userData.userName})
        .exec().then((data)=>{
            if(data.length==0){
                reject("Unable to Find user"+userData.userName)
            }
            bcrypt.compare(userData.password, data[0].password).then((result) => {
                if(!result){
                    reject("Incorrect Password for user : "+ userData.userName);
                }
                else{
                   data[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent})
                   User.updateOne(
                       {userName: data[0].userName},
                       {$set : { loginHistory : data[0].loginHistory}}
                       ).exec().then(()=>{
                          resolve(data[0])
                       }).catch(function(error){
                        reject("There was an error verifying the user : "+err)
                    });
                }
            })
           
        }).catch(function(error){
            reject("unable to find the user : "+ userData.userName +error)
        });
    })
}

module.exports={initialize,registerUser,checkUser }