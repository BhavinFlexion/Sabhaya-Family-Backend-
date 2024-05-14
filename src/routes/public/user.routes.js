const express = require('express');

const router = express.Router();

var authValidator = require("../../validator/authValidator")

var userController = require('../../controllers/userController');

router.post('/sign-up', authValidator.signup(), userController.signUp);

router.post('/sign-In', authValidator.signIn(), userController.signIn);

router.post('/forgotPassword',authValidator.forgotPass(), userController.forgotPassword);

router.post('/resetPassword', authValidator.resetPass(), userController.resetPassword);

router.get('/get-User', userController.getUser);

module.exports = router;