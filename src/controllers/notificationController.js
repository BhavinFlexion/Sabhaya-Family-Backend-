const Notification = require('../models/notification');

const User = require('../models/users');

exports.notificationCreate = async (req, res) => {
    try {
        const userId = req.user.id;

        const { mobileNumber, message, date, status } = req.body;

        if (!mobileNumber ||!message ||!date ||!status) {
            return res.status(400).json({status: false, message: res.__("FIELD_NOT_REQUIRED") });
        }

        const findUser = await User.findByPk(userId);

        if (!findUser) {
            return res.status(400).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        const findNotification = await Notification.create({
            mobileNumber,
            message,
            date,
            status,
            userId
        });

        res.status(201).json({ status: true, message: res.__("NOTIFICATION_CREATED_SUCCESSFULLY"), findNotification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.getAllnotification = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const filters = {};
    if (req.query.role) {
        filters.role = req.query.role;
    }
    const offset = (page - 1) * pageSize;

    const findNotification = await Notification.findAndCountAll({
        limit: pageSize,
        offset: offset
    });

    res.status(200).json({
        status: true,
        message: res.__("Notification_RETRIEVED_SUCCESSFULLY"),
        totalItems: findNotification.count,
        totalPages: Math.ceil(findNotification.count / pageSize),
        currentPage: page,
        data: findNotification,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id; 

        const findNotification = await Notification.findByPk(notificationId);

        if (!findNotification) {
            return res.status(404).json({ status: false, message: res.__("NOTIFICATION_NOT_FOUND") });
        }

        if (findNotification.userId !== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        await findNotification.destroy();

        res.status(200).json({ status: true, message: res.__("NOTIFICATION_DELETED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id; 

        const { mobileNumber, message, date, status } = req.body;

        const findNotification = await Notification.findByPk(notificationId);

        if (!findNotification) {
            return res.status(404).json({ status: false, message: res.__("NOTIFICATION_NOT_FOUND") });
        }

        if (findNotification.userId!== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
        }

        await findNotification.update({
            mobileNumber,
            message,
            date,
            status
        });

        res.status(200).json({ status: true, message: res.__("NOTIFICATION_UPDATED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}