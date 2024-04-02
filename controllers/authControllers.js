const User =require(`../models/users`);

const jwt = require(`jsonwebtoken`); //this is the jwt but we have to ask where we want the jwt to be implemented, so it will be after the signup..so we will first create it as a function then put it into the signup

//since we have updated the model, to have their individual error messages, we need to find a way to create a function that returns those message

//handle error function

const handleError =(err)=>{
   console.log(err.message, err.code);

   let errors ={ email: ``, password:``}

   //incorrect email
   if(err.message==="incorrect email"){
      errors.email = "that email is not registered"
   }


   //incorrect password
   if(err.message==="incorrect password"){
      errors.password = "that password is not registered"
   }
   //duplicate error code

   if(err.code===11000){
      errors.email= `that email is already registered`;
      return errors
   }

   //validation errors
   if(err.message.includes(`user validation failed`)){
      Object.values(err.errors).forEach(({properties})=>{
         errors[properties.path]= properties.message;
      });
   }
   return errors;
}

//jwt function below
//since each user has an id in the database, we will use it in the function ..and the property will take two arguments, one the id and the other is the secret(used to create the signature)..note jwt accept expiration in seconds unlike cookies in ms

const maxAge=  1*24*60*60;
const createToken = (id)=>{
   return jwt.sign({id},`ikegbunam milky`, {
      expiresIn: maxAge
   });
}

module.exports.signup_get=(req,res)=>{
   res.render(`signup`);
}

module.exports.login_get=(req,res)=>{
    res.render(`login`);
 }

 module.exports.signup_post= async(req,res)=>{
   const{email, password} = req.body;
   //we will want to use this destructured parameters to create a model in the database, so we will use a try catch

   //so we will import the user model here
   try{
      //we create an instance of the user in the database. since the user.create is asynchronous and returns a promise, we will have to use await to wait for the promise to return completely
      const user= await User.create({email,password});
      //below is where we import the jwt function we created before..so as to log the user in , immediately we create their profile

      const token = createToken(user._id)
      //this above finally creates the token with the user id, so now what we have to do is to save the cookie as a response

      res.cookie(`jwt`, token, {httpOnly: true, maxAge:maxAge*1000})
      //the maxage is changed to ms since we are creating a cookie now

      //then we send a response
      res.status(201).json({user: user._id});
   }catch(err){
      const errors = handleError(err);
      res.status(400).json({errors});
   }
  
 }

 module.exports.login_post=async(req,res)=>{
   const{email, password}= req.body;
   //since we have gotten the data from the user, we now want to compare them with the password we hashed in the database....so first, we will create a static method in our user model to compare the password and email and it will return user

//then we are going to use a try and catch block incase an error occurs from the method we created in the user model either incorrect password or email

try {
   //we use the User plus the static method we created just now 
   const user = await User.login(email, password);
   
   const token = createToken(user._id)
   res.cookie(`jwt`, token, {httpOnly: true, maxAge:maxAge*1000})
   res.status(200).json({user: user._id});
} catch (err) {
   const errors = handleError(err);
   res.status(400).json({errors})
}



   
 }


 //creating the logout function
 module.exports.logout_get = (req,res)=>{
   //in order to logout , we have to delete the jwt token, not to delete it from the server...we give it a short expiry date

   res.cookie("jwt","",{ maxAge:1});
   //then we redirect to the homepage once the coookie is expired ..and thats how we logout

   res.redirect(`/`)

 }