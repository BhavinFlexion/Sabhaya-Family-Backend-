const Advertisement = require('../models/advertisement');

const User = require('../models/users');

const { Op } = require("sequelize");

exports.advertisementCreate = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { advertisements, title, type, address, status } = req.body;

        if (!advertisements ||!title ||!type ||!address ||!status) {
            return res.status(400).json({ status: false, message: res.__("FIELD_NOT_REQUIRED") });
        }
        
        const findUser = await User.findByPk(userId);

        if (!findUser) {
            return res.status(400).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        const findAdvertisement = await Advertisement.create({
            advertisements,
            title,
            type,
            address,
            status,
            userId
        });

        res.status(201).json({ status: true, message: res.__("ADVERTISEMENT_CREATED_SUCCESSFULLY"), findAdvertisement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.getAdvertisement = async (req, res) => {
try {   
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const filters = {};
    if (req.query.role) {
        filters.role = req.query.role;
    }

    const searchQuery = req.query.search || '';

    const offset = (page - 1) * pageSize;

    const findAdvertisement = await Advertisement.findAndCountAll({
        where: { 
            ...filters,
            [Op.or]: [
                { advertisements: { [Op.like]: `%${searchQuery}%` } },
                { title: { [Op.like]: `%${searchQuery}%` } },
                { type: { [Op.like]: `%${searchQuery}%` } },
                { address: { [Op.like]: `%${searchQuery}%` } },
            ]
        },
        limit: pageSize,
        offset: offset
    });

    res.status(200).json({
        status: true,
        message: res.__("ADVERTISEMENT_RETRIEVED_SUCCESSFULLY"),
        totalItems: findAdvertisement.count,
        totalPages: Math.ceil(findAdvertisement.count / pageSize),
        currentPage: page,
        data: findAdvertisement,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteAdvertisement = async (req, res) => {
    try {
        const advertisementId = req.params.id;
        const userId = req.user.id; 

        const findAdvertisement = await Advertisement.findByPk(advertisementId);

        if (!findAdvertisement) {
            return res.status(404).json({ status: false, message: res.__("ADVERTISEMENT_NOT_FOUND") });
        }

        if (findAdvertisement.userId !== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        await findAdvertisement.destroy();

        return res.status(200).json({ status: true, message: res.__("ADVERTISEMENT_DELETED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateAdvertisement = async (req, res) => {
    try {
        const advertisementId = req.params.id;
        const userId = req.user.id; 

        const { advertisements, title, type, address, status } = req.body;

        let findAdvertisement = await Advertisement.findByPk(advertisementId);

        if (!findAdvertisement) {
            return res.status(404).json({ status: false, message: res.__("ADVERTISEMENT_NOT_FOUND") });
        }

        if (findAdvertisement.userId !== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
        }

        if (advertisements) findAdvertisement.advertisements = advertisements;
        if (title) findAdvertisement.title = title;
        if (type) findAdvertisement.type = type;
        if (address) findAdvertisement.address = address;
        if (status) findAdvertisement.status = status;

        await findAdvertisement.save();

        return res.status(200).json({ status: true, message: res.__("ADVERTISEMENT_UPDATED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}