const Student = require('../models/student');

const User = require('../models/users');

const { STATUS_FIELD } = require("../helper/constant");

const { Op } = require("sequelize");

exports.studentCreate = async (req, res) => {
    try {
        let file = req.file;
        const userId = req.user.id;

        const {image, name, schoolName, standard, percentage, totalMarks, outOfMarks, grade, message, status } = req.body;

        const findUser = await User.findByPk(userId);

        if (!findUser) {
            return res.status(400).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        if (status!== STATUS_FIELD.ACTIVE && status!== STATUS_FIELD.DEACTIVE) {
            return res.status(400).json({ status: false, message: res.__("INVALID_STATUS") });
        }

        const imageData = file ? file.filename : '';
        
        const data = await Student.create({
            image: imageData,
            name,
            schoolName,
            standard,
            percentage,
            totalMarks,
            outOfMarks,
            grade,
            message,
            status,
            userId,
        });

        res.status(201).json({ status: true, message: res.__("STUDENT_CREATED_SUCCESSFULLY"), data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.getStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        const findStudent = await Student.findByPk(studentId);

        if (!findStudent) {
            return res.status(404).json({ status: false, message: res.__("STUDENT_NOT_FOUND") });
        }

        res.status(200).json({ status: true, message: res.__("STUDENT_RETRIEVED_SUCCESSFULLY"), data: findStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.getAllStudent = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10; 

        const filters = {};
        if (req.query.role) {
            filters.role = req.query.role;
        }

        const searchQuery = req.query.search || '';

        const offset = (page - 1) * pageSize;

        const findStudent = await Student.findAndCountAll({
            where: { 
                ...filters,
                [Op.or]: [
                    { name: { [Op.like]: `%${searchQuery}%` } },
                    { schoolName: { [Op.like]: `%${searchQuery}%` } },
                ]
            },
            limit: pageSize,
            offset: offset
        });

        if (!findStudent.rows || findStudent.rows.length === 0) {
            return res.status(404).json({ status: false, message: res.__("STUDENT_NOT_FOUND") });
        }


        res.status(200).json({
            status: true,
            message: res.__("ALL_STUDENTS_RETRIEVED_SUCCESSFULLY"),
            totalItems: findStudent.count,
            totalPages: Math.ceil(findStudent.count / pageSize),
            currentPage: page,
            data: findStudent.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const userId = req.user.id; 

        const findStudent = await Student.findByPk(studentId);

        if (!findStudent) {
            return res.status(404).json({ status: false, message: res.__("STUDENT_NOT_FOUND") });
        }

        if (findStudent.userId !== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        await findStudent.destroy();

        res.status(200).json({ status: true, message: res.__("STUDENT_DELETED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const userId = req.user.id; 

        const { image, name, schoolName, standard, percentage, totalMarks, outOfMarks, grade, message, status } = req.body;

        const findStudent = await Student.findByPk(studentId);

        if (!findStudent) {
            return res.status(404).json({ status: false, message: res.__("STUDENT_NOT_FOUND") });
        }

        if (findStudent.userId !== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
        }
    
        await findStudent.update({
            image,
            name,
            schoolName,
            standard,
            percentage,
            totalMarks,
            outOfMarks,
            grade,
            message,
            status
        });

        res.status(200).json({ status: true, message: res.__("STUDENT_UPDATED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}