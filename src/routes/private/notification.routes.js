const express = require('express');

const router = express.Router();

const notificationController = require('../../controllers/notificationController');

var authValidator = require("../../validator/authValidator")

router.post('/create', authValidator.Notificationupdate(), notificationController.notificationCreate);

router.get('/get',notificationController.getAllnotification);

router.delete('/delete/:id',notificationController.deleteNotification);

router.put('/update/:id',notificationController.updateNotification);

module.exports = router;