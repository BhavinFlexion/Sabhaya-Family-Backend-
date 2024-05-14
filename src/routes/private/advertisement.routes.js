const express = require('express');

const router = express.Router();

const advertisementController = require('../../controllers/advertisementController');

var authValidator = require("../../validator/authValidator")

router.post('/create', authValidator.Advertisementupdate(), advertisementController.advertisementCreate);

router.get('/get',advertisementController.getAdvertisement);

router.delete('/delete/:id',advertisementController.deleteAdvertisement);

router.put('/update/:id',advertisementController.updateAdvertisement);

module.exports = router;