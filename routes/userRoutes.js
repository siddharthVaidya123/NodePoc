const express = require("express");
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signUp);
userRouter.post('/forgotPassword', authController.forgortPassword);
userRouter.patch('/resetPassword', authController.resetPassword);
userRouter.patch('/updateMe',authController.protect, userController.UpdateMe);
userRouter.post('/login', authController.login);
userRouter.route("/").get(userController.getAllUsers).post(userController.createUsers);
userRouter.route("/:id").get(userController.getUserById).post(userController.updateUser).delete(userController.deleteUser);

module.exports = userRouter;
