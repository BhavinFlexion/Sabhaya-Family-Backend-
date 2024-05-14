const express = require('express');

const router = express.Router();

const studentController = require('../../controllers/studentController');

var authValidator = require("../../validator/authValidator")

const upload = require('../../middleware/singleImage');

router.post('/create', upload.single("image"), authValidator.Studentupdate(), studentController.studentCreate);

router.get('/get/:id',studentController.getStudent);

router.get('/get',studentController.getAllStudent);

router.delete('/delete/:id', studentController.deleteStudent);

router.put('/update/:id', studentController.updateStudent);

module.exports = router;