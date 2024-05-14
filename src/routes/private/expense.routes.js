const express = require('express');

const router = express.Router();

const expenseController = require('../../controllers/expenseController');

var authValidator = require("../../validator/authValidator")

router.post('/create', authValidator.Expenseupdate(), expenseController.expenseCreate);
 
router.get('/get',expenseController.getAllExpense);

router.delete('/delete/:id', expenseController.deleteExpense);

router.put('/update/:id', expenseController.updateExpense);

module.exports = router;