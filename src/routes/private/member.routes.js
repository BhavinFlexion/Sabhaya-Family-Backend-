const express = require('express');

const router = express.Router();

const memberController = require('../../controllers/memberController');

var authValidator = require("../../validator/authValidator")

const upload = require('../../middleware/singleImage');

router.post('/create', upload.single("profile"), authValidator.Membersupdate(), memberController.membarCreate);

router.get('/get', memberController.getMember);

router.delete('/delete/:id', memberController.deleteMember);

router.put('/update/:id', memberController.updateMember);

module.exports = router;