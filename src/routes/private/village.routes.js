const express = require('express');

const router = express.Router();

const villageController = require('../../controllers/villageController');

var authValidator = require("../../validator/authValidator")

router.post('/create', authValidator.Villageupdate(), villageController.villageCreate);

router.get('/get',villageController.getAllVillage);

router.delete('/delete/:id', villageController.deleteVillage);

router.put('/update/:id', villageController.updateVillage);

module.exports = router;