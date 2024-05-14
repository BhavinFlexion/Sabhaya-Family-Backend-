const Expense = require("../models/expense");

const User = require("../models/users");

const { Op } = require("sequelize");

exports.expenseCreate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, amount, date } = req.body;
        
        if (!title ||!amount ||!date) {
            return res.status(400).json({ status: false, message: res.__("FIELD_NOT_REQUIRED") });
        }

        const findUser = await User.findByPk(userId);

        if (!findUser) {
            return res.status(400).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }
        
        const data = await Expense.create({
            title,
            amount,
            date,
            userId
        });

        res.status(201).json({ status: true, message: res.__("EXPENSE_CREATED_SUCCESSFULLY"), data: data});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllExpense = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const filters = {};
    if (req.query.role) {
        filters.role = req.query.role;
    }

    const searchQuery = req.query.search || '';

    const offset = (page - 1) * pageSize;

    const findExpense = await Expense.findAndCountAll({
        where: { 
            ...filters,
            [Op.or]: [
                { title: { [Op.like]: `%${searchQuery}%` } },
                { amount: { [Op.like]: `%${searchQuery}%` } },
            ]
        },
        limit: pageSize,
        offset: offset
    });

    res.status(200).json({
        status: true,
        message: res.__("EXPENSE_RETRIEVED_SUCCESSFULLY"),
        totalItems: findExpense.count,
        totalPages: Math.ceil(findExpense.count / pageSize),
        currentPage: page,
        data: findExpense,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
    const ExpenseId = req.params.id;
    const userId = req.user.id;

    const findExpense = await Expense.findByPk(ExpenseId);
        
    if (!findExpense) {
        return res.status(404).json({ status: false, message: res.__("EXPENSE_NOT_FOUND") });
    }

    if (findExpense.userId!== userId) {
        return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
    }

    await findExpense.destroy();

    res.status(200).json({ status: true, message: res.__("EXPENSE_DELETED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
    const ExpenseId = req.params.id;
    const userId = req.user.id;

    const { title, amount, date } = req.body;

    const findExpense = await Expense.findByPk(ExpenseId);

    if (!findExpense) {
        return res.status(404).json({ status: false, message: res.__("EXPENSE_NOT_FOUND") });
    }

    if (findExpense.userId!== userId) {
        return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
    }

    await findExpense.update({
        title,
        amount,
        date,
    });
    
    res.status(200).json({ status: true, message: res.__("EXPENSE_UPDATED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};