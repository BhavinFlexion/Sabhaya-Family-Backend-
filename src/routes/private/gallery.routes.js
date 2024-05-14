const express = require('express');

const router = express.Router();

const galleryController = require('../../controllers/galleryController');

var authValidator = require("../../validator/authValidator")

const upload = require('../../middleware/uploadImage');

router.post('/create', upload.array("multipleImages", 5), authValidator.Galleryupdate() ,galleryController.createGallery);

router.get('/get',galleryController.getAllgallery);

router.delete('/delete/:id',galleryController.deleteGallery);

router.put('/update/:id',galleryController.updateGallery);

module.exports = router;
