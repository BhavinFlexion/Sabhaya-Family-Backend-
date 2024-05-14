const Schedule = require('../models/schedule');

const User = require('../models/users');

const { Op } = require("sequelize");

exports.scheduleCreate = async (req, res) => {
    try {
        const userId = req.user.id;

        const { title, date, description, displayNo } = req.body;

        if (!title || !date || !displayNo) {
            return res.status(400).json({status: false, message: res.__("FIELD_NOT_REQUIRED") });
        }

        const findUser = await User.findByPk(userId);

        if (!findUser) {
            return res.status(400).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        const data = await Schedule.create({
            title,
            date,
            description,
            displayNo,
            userId
        });

        res.status(201).json({ status: true, message: res.__("SCHEDULE_CREATED_SUCCESSFULLY"), data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.getSchedule = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const filters = {};
    if (req.query.role) {
        filters.role = req.query.role;
    }

    const searchQuery = req.query.search || '';

    const offset = (page - 1) * pageSize;

    const findSchedule = await Schedule.findAndCountAll({
        where: { 
            ...filters,
            [Op.or]: [
                { title: { [Op.like]: `%${searchQuery}%` } },
                { displayNo: { [Op.like]: `%${searchQuery}%` } },
            ]
        },
        limit: pageSize,
        offset: offset
    });

    res.status(200).json({
        status: true,
        message: res.__("SCHEDULE_RETRIEVED_SUCCESSFULLY"),
        totalItems: findSchedule.count,
        totalPages: Math.ceil(findSchedule.count / pageSize),
        currentPage: page,
        data: findSchedule,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        const userId = req.user.id; 

        const findSchedule = await Schedule.findByPk(scheduleId);

        if (!findSchedule) {
            return res.status(404).json({ status: false, message: res.__("SCHEDULE_NOT_FOUND") });
        }

        if (findSchedule.userId !== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        await findSchedule.destroy();

        return res.status(200).json({ status: true, message: res.__("SCHEDULE_DELETED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateSchedule = async (req, res) => {
    try {
        const scheduleId  = req.params.id;
        const userId = req.user.id;

        const { title, date, description, displayNo } = req.body; 

        if (!scheduleId) {
            return res.status(400).json({ status: false, message: res.__("SCHEDULE_ID_IS_REQUIRED") });
        }

        let findSchedule = await Schedule.findByPk(scheduleId);

        if (!findSchedule) {
            return res.status(404).json({ status: false, message: res.__("SCHEDULE_NOT_FOUND") });
        }


        findSchedule.title = title || findSchedule.title; 
        findSchedule.date = date || findSchedule.date; 
        findSchedule.description = description || findSchedule.description; 
        findSchedule.displayNo = displayNo || findSchedule.displayNo; 


        if (findSchedule.userId !== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
        }

        findSchedule = await findSchedule.save();

        res.status(200).json({ status: true, message: res.__("SCHEDUL_UPDATED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}