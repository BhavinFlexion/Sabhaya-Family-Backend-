const express = require('express');

const router = express.Router();

const sponsorsController = require('../../controllers/sponsorsController');

var authValidator = require("../../validator/authValidator")

const upload = require('../../middleware/singleImage');

router.post('/create', upload.single("sponsorImage"), authValidator.Sponsorsupdate(), sponsorsController.sponsorCreate);

router.get('/get',sponsorsController.getAllSponsors);

router.delete('/delete/:id', sponsorsController.deleteSponsor);

router.put('/update/:id', sponsorsController.updateSponsor);

module.exports = router;