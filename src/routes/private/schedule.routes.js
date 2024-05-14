const express = require('express');

const router = express.Router();

const scheduleController = require('../../controllers/scheduleController');

var authValidator = require("../../validator/authValidator")

router.post('/create', authValidator.Scheduleupdate(), scheduleController.scheduleCreate);

router.get('/get',scheduleController.getSchedule);

router.delete('/delete/:id',scheduleController.deleteSchedule);

router.put('/update/:id',scheduleController.updateSchedule);

module.exports = router;