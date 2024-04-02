const mongoose = require(`mongoose`);
// since we want to use the validator package and it contains a lot of functions in it but the one we need is email validator, so we have to destructure it and bring out the email validator
const {isEmail}= require (`validator`);

//we will have to import bcrypt into the model cause its where it will work

const bcrypt = require(`bcrypt`);


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,`please enter an email`],
        unique:true, //this part makes sure no dublicate of the email can exist in the database
        lowercase:true, //converts everything to lowercase before saving it in the database
        validate:[isEmail, `please enter a valid email`]

        //the line above helps to validate an email by being an array and having a function inside it which accepts a value of what is passed to the schema , we can use a third party package(validator) to help us validate the mail
    },
    password:{
        type:String,
        required:[true, `please enter a password`],
        minlength: [6, `minimum password length is 6 characters`] //makes the length of the character of the password to not be greater that six
    }
})


//fire a function after the passwords are saved to the database

userSchema.pre(`save`, async function(next){
   // to use the bcrypt , remember that we will have to generate a salt,remember it is asynchronous so we will have to use await and async for it

   const salt = await bcrypt.genSalt();
   //the "this" refers to the instance of the user we want to create right now
   this.password= await bcrypt.hash(this.password,salt)
    next();
})

//remember to always call next when using mongoose middleware or hook


//this is where we create the model method to login user..it is a static method, and it will be an aynchronous function...and userSchema is the name of the schema 


userSchema.static.login= async function (email, password){
    //looking for the user(email) with this password in our database..we first find the email
    const user = await this.findOne({email});

    //then we run a check if the email user exist

    if (user){
      //this line is further to compare the password..remember that its the harshed password we need to compare.. means it the bcryt library we imported we will use..its compare method

      //user.password is the harshed password in the database
      //bcrypt helps us compare the harshed password under the hood

      const auth = await bcrypt.compare(password, user.password);

      //if the comparison comes truth, then we run another check to log in the user

      if(auth){
        return user
      }
    throw Error (`incorrect password`);
    }
    throw Error(`incorrect email`);

    //then we send all this code back to our authcontroller
}







//now we have to make a model off this schema we just defined

const User = mongoose.model(`user`,userSchema);
//the 2nd argument above will be the schema
//the name of the model should be singular of whatever we defined our database collection to be called i.e  my database coll is "users", so the model name will be "user"

//then next below we will export the model

module.exports= User;