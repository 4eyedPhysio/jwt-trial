const jwt = require("jsonwebtoken");

const requireAuth =(req, res, next)=>{
    //grabbing the token
   const token = req.cookies.jwt
   //checking if the token exists or not 
   if(token){
       //verify the token
       jwt.verify(token, "ikegbunam milky", (err, decodedToken)=>{
      if(err){
        console.log(err.message);
        res.redirect("/login")
      }else{
        console.log(decodedToken)
        next();
      }
       })
   }
   else{
    res.redirect(`/login`)
   }
}

//this function protects routes



//how to check the current user
const checkUser = ( req, res, next)=>{
  const token = req.cookies.jwt

if(token){
  jwt.verify(token, "ikegbunam milky", async(err, decodedToken)=>{
    if(err){
      console.log(err.message);
      res.locals.user = null;
      next();
    }else{
      console.log(decodedToken)
      let user = await User.findById(decodedToken.id);
      res.locals.user = user;
      next();
    }
     })
}else{
    res.locals.user = null;
    next();
}

}

module.exports = {requireAuth, checkUser};