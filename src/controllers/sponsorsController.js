const Sponsors = require('../models/sponsors');

const User = require('../models/users');

const { Op } = require("sequelize");

exports.sponsorCreate = async (req, res) => {
  try {
    let file = req.file;
    const userId = req.user.id;

    const { village, member, totalAdvertisement, amount, received, sponsorName, advertisementCategory, sponsorImage, status } = req.body;
    
    const findUser = await User.findByPk(userId);

    if (!findUser) {
        return res.status(400).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
    }

    const imageData = file ? file.filename : '';

    const findSponsor = await Sponsors.create({
        village,
        member,
        totalAdvertisement,
        amount,
        received,
        sponsorName,
        advertisementCategory,
        sponsorImage: imageData,
        status,
        userId
      });
      
      res.status(201).json({ status: true, message: res.__("SPONSOR_CREATED_SUCCESSFULLY"), data: findSponsor });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
};

exports.getAllSponsors = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const filters = {};
    if (req.query.role) {
        filters.role = req.query.role;
    }

    const searchQuery = req.query.search || '';

    const offset = (page - 1) * pageSize;

    const findSponsor = await Sponsors.findAndCountAll({
        where: { 
            ...filters,
            [Op.or]: [
                { sponsorName: { [Op.like]: `%${searchQuery}%` } },
                { advertisementCategory: { [Op.like]: `%${searchQuery}%` } },
            ]
        },
        limit: pageSize,
        offset: offset
    });

    res.status(200).json({
        status: true,
        message: res.__("SPONSOR_RETRIEVED_SUCCESSFULLY"),
        totalItems: findSponsor.count,
        totalPages: Math.ceil(findSponsor.count / pageSize),
        currentPage: page,
        data: findSponsor,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
  
exports.deleteSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const userId = req.user.id; 


    const findSponsor = await Sponsors.findByPk(sponsorId);

    if (!findSponsor) {
        return res.status(404).json({ status: false, message: res.__("SPONSOR_NOT_FOUND") });
    }

    if (findSponsor.userId!== userId) {
        return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
    }

    await findSponsor.destroy();

    res.status(200).json({ status: true, message: res.__("SPONSOR_DELETED_SUCCESSFULLY")});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};

exports.updateSponsor = async (req, res) => {
    try {
      const sponsorId = req.params.id;
      const userId = req.user.id; 

      const { village, member, totalAdvertisement, amount, received, sponsorName, advertisementCategory, sponsorImage, status } = req.body;

      const findSponsor = await Sponsors.findByPk(sponsorId);
      
      if (!findSponsor) {
        return res.status(404).json({ status: false, message: res.__("SPONSOR_NOT_FOUND") });
      }

      if (findSponsor.userId!== userId) {
        return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
      }

      await findSponsor.update({
        village, 
        member, 
        totalAdvertisement, 
        amount, 
        received, 
        sponsorName, 
        advertisementCategory, 
        sponsorImage, 
        status 
      });
    
      res.status(200).json({ status: true, message: res.__("SPONSOR_UPDATED_SUCCESSFULLY")});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};