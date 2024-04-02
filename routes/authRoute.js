const {Router} = require(`express`);
const authController = require(`../controllers/authControllers`)// we import the from controller
const authRoute = Router();

//remember, we want to create 4 routes, 2get and 2post /signup and login

authRoute.get(`/login`, authController.login_get);
authRoute.post(`/login`, authController.login_post);
authRoute.get(`/signup`, authController.signup_get);
authRoute.post(`/signup`, authController.signup_post);
authRoute.get(`/logout`, authController.logout_get);

module.exports= authRoute;
