const Sponsorlogo = require("../models/sponsorslogo");

const User = require('../models/users');

const { Op } = require("sequelize");

exports.sponsorlogoCreate = async (req, res) => {
try {
    let file = req.file;

    const userId = req.user.id;

    const { LogoImage, Title, URL, displayNo, status } = req.body;

    const findUser = await User.findByPk(userId);

    if (!findUser) {
        return res.status(400).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
    }

    const imageData = file ? file.filename : '';

    const findSponsorlogo = await Sponsorlogo.create({
        LogoImage: imageData,
        Title,
        URL,
        displayNo,
        status,
        userId
    });

    res.status(201).json({ status: true, message: res.__("SPONSORSLOGO_CREATED_SUCCESSFULLY"), data: findSponsorlogo});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
}

exports.getAllSponsorslogo = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const filters = {};
    if (req.query.role) {
        filters.role = req.query.role;
    }

    const searchQuery = req.query.search || '';

    const offset = (page - 1) * pageSize;

    const findSponsorlogo = await Sponsorlogo.findAndCountAll({
        where: { 
            ...filters,
            [Op.or]: [
                { Title: { [Op.like]: `%${searchQuery}%` } },
            ]
        },
        limit: pageSize,
        offset: offset
    });

    res.status(200).json({
        status: true,
        message: res.__("SPONSORSLOGO_RETRIEVED_SUCCESSFULLY"),
        totalItems: findSponsorlogo.count,
        totalPages: Math.ceil(findSponsorlogo.count / pageSize),
        currentPage: page,
        data: findSponsorlogo,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteSponsorlogo = async (req, res) => {
  try {
    const sponsorlogoId = req.params.id;
    const userId = req.user.id; 

    const findSponsorlogo = await Sponsorlogo.findByPk(sponsorlogoId);

    if (!findSponsorlogo) {
        return res.status(404).json({ status: false, message: res.__("SPONSORLOGO_NOT_FOUND") });
    }
    if (findSponsorlogo.userId!== userId) {
        return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
    }

    await findSponsorlogo.destroy();

    res.status(200).json({ status: true, message: res.__("SPONSORLOGO_DELETED_SUCCESSFULLY") });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
}

exports.updateSponsorlogo = async (req, res) => {
    try {
      const sponsorlogoId = req.params.id;
      const userId = req.user.id;

      const { LogoImage, Title, URL, displayNo, status } = req.body;

      const findSponsorlogo = await Sponsorlogo.findByPk(sponsorlogoId);

      if (!findSponsorlogo) {
        return res.status(404).json({ status: false, message: res.__("SPONSORLOGO_NOT_FOUND") });
      }

      if (findSponsorlogo.userId!== userId) {
        return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
      }

      await findSponsorlogo.update({
        LogoImage,
        Title, 
        URL, 
        displayNo,
        status
      });
      
      res.status(200).json({ status: true, message: res.__("SPONSORLOGO_UPDATED_SUCCESSFULLY") });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
}