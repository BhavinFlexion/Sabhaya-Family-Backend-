const express = require('express');

const router = express.Router();

const sponsorsLogoController = require('../../controllers/sponsorsLogoController');

var authValidator = require("../../validator/authValidator")

const upload = require('../../middleware/singleImage');

router.post('/create', upload.single("LogoImage"), authValidator.Sponsorslogoupdate(), sponsorsLogoController.sponsorlogoCreate);

router.get('/get',sponsorsLogoController.getAllSponsorslogo);

router.delete('/delete/:id', sponsorsLogoController.deleteSponsorlogo);

router.put('/update/:id', sponsorsLogoController.updateSponsorlogo);

module.exports = router;