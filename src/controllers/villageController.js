const Village = require('../models/Village');

const { Op } = require("sequelize");

const User = require('../models/users');

const xlsx = require('xlsx');

const fs = require('fs');

const path = require('path');

const { ROLE_FIELD } = require("../helper/constant");

exports.villageCreate = async (req, res) => {
    try {
        const { role } = req.user;
    
        if (role !== ROLE_FIELD.ADMIN) {
            return res.status(403).json({ status: false, message: res.__("UNAUTHORIZED_TO_CREATE_VILLAGE") });
        }
    
        const { village, taluka, district } = req.body;
    
        if (!village || !taluka || !district) {
            return res.status(400).json({ status: false, message: res.__("FIELD_NOT_REQUIRED") });
        }
    
        const data = await Village.create({
            village,    
            taluka,
            district,
            userId: req.user.id
        });
    
        res.status(201).json({ status: true, message: res.__("VILLAGE_CREATED_SUCCESSFULLY"), data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.getAllVillage = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;

    const pageSize = parseInt(req.query.pageSize) || 10;

    const filters = {};

    if (req.query.role) {
        filters.role = req.query.role;
    }

    const searchQuery = req.query.search || '';

    const offset = (page - 1) * pageSize;

    const village = await Village.findAndCountAll({
        where: {
            ...filters,
            [Op.or]: [
            { village: { [Op.like]: `%${searchQuery}%` } },
            { taluka: { [Op.like]: `%${searchQuery}%` } },
            { district: { [Op.like]: `%${searchQuery}%` } }
        ]
        },
            offset,
            limit: pageSize
        });

    res.status(200).json({ 
        status: true, 
        message: res.__("VILLAGE_RETRIEVED_SUCCESSFULLY"),
        totalItems: village.count,
        totalPages: Math.ceil(village.count / pageSize),
        currentPage: page,
        data: village,
    }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.VillageToExcel = async (req, res) => {
    try {
        const villages = await Village.findAll();

        const excelData = villages.map(village => ({
            Village: village.village,
            Taluka: village.taluka,
            District: village.district
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(excelData);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Villages');

        const filePath = path.join(__dirname, '../public/excel/exported.xlsx');

        xlsx.writeFile(workbook, filePath);

        res.download(filePath, 'villages.xlsx', () => {
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteVillage = async (req, res) => {
    try {
        const villageId = req.params.id;
        const { role } = req.user;
    
        if (role !== ROLE_FIELD.ADMIN) {
            return res.status(403).json({ status: false, message: res.__("UNAUTHORIZED_TO_CREATE_VILLAGE") });
        }

        const findVillage = await Village.findByPk(villageId);

        if (!findVillage) {
            return res.status(404).json({ status: false, message: res.__("VILLAGE_NOT_FOUND") });
        }

        await findVillage.destroy();

        res.status(200).json({ status: true, message: res.__("VILLAGE_DELETED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.updateVillage = async (req, res) => {
    try {
        const villageId = req.params.id;
        const { role } = req.user;
    
        if (role !== ROLE_FIELD.ADMIN) {
            return res.status(403).json({ status: false, message: res.__("UNAUTHORIZED_TO_CREATE_VILLAGE") });
        }

        const { village, taluka, district } = req.body;

        const findVillage = await Village.findByPk(villageId);

        if (!findVillage) {
            return res.status(404).json({ status: false, message: res.__("VILLAGE_NOT_FOUND") });
        }

        await findVillage.update({
            village,
            taluka,
            district,
        });

        res.status(200).json({ status: true, message: res.__("VILLAGE_UPDATED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}