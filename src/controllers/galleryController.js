const Gallery = require('../models/gallery');

const User = require('../models/users');

const { Op } = require("sequelize");

exports.createGallery = async (req, res) => {
    try {
        let file = req.file;
        const userId = req.user.id;

        const { title, type, status } = req.body;
        
        const multipleImages = req.files.map(file => file.filename);

        const findUser = await User.findByPk(userId);

        if (!findUser) {
            return res.status(400).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }
        
        const data = await Gallery.create({
            title,
            multipleImages: JSON.stringify(multipleImages),
            type,
            status,
            userId
        });
        
        res.status(201).json({ status: true, message: res.__("GALLERY_CREATED_SUCCESSFULLY"), data: data});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};

exports.getAllgallery = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const filters = {};
    if (req.query.role) {
        filters.role = req.query.role;
    }

    const searchQuery = req.query.search || '';

    const offset = (page - 1) * pageSize;

    const findGallery = await Gallery.findAndCountAll({
        where: { 
            ...filters,
            [Op.or]: [
                { title: { [Op.like]: `%${searchQuery}%` } },
                { type: { [Op.like]: `%${searchQuery}%` } },
            ]
        },
        limit: pageSize,
        offset: offset
    });

    res.status(200).json({
        status: true,
        message: res.__("GALLERY_RETRIEVED_SUCCESSFULLY"),
        totalItems: findGallery.count,
        totalPages: Math.ceil(findGallery.count / pageSize),
        currentPage: page,
        data: findGallery,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGallery = async (req, res) => {
    try {
        const galleryId = req.params.id;
        const userId = req.user.id; 
    
        const findGallery = await Gallery.findByPk(galleryId);
    
        if (!findGallery) {
          return res.status(404).json({ status: false, message: res.__("GALLERY_NOT_FOUND") });
        }

        if (findGallery.userId !== userId) {
          return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
      }
    
        await Gallery.destroy({
          where: {
            id: galleryId
          }
        });
    
        res.status(200).json({ status: true, message: res.__("GALLERY_DELETED_SUCCESSFULLY") });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
};

exports.updateGallery = async (req, res) => {
    try {
        const galleryId = req.params.id;
        const userId = req.user.id; 
        
        const { title, multipleImages, type, status } = req.body;

        const findGallery = await Gallery.findByPk(galleryId);

        if (!findGallery) {
          return res.status(404).json({ status: false, message: res.__("GALLERY_NOT_FOUND") });
        }

        if (findGallery.userId !== userId) {
          return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
      }

        if (title) {
          findGallery.title = title;
        }
        if (multipleImages !== undefined) {
          findGallery.multipleImages = JSON.parse(multipleImages); 
        }
        if (type) {
          findGallery.type = type;
        }
        if (status) {
          findGallery.status = status;
        }

        await findGallery.save();

        res.status(200).json({ status: true, message: res.__("GALLERY_UPDATED_SUCCESSFULLY") });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};
