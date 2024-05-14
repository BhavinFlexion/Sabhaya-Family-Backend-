const Members = require('../models/member');
const User = require('../models/users');

const { Op } = require("sequelize");

exports.membarCreate = async (req, res) => {
    try {
        let file = req.file;
        const userId = req.user.id;

        const { profile, name, fatherName, familyMembersCount, gender, email, bloodGroup, residentAddress, village, occupation, businessType, businessName, businessAddress, status } = req.body;
       
        const findUser = await User.findByPk(userId);

        if (!findUser) {
            return res.status(400).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        const findMember = await Members.findOne({ where: { email } });
    
        if (findMember) {
            return res.status(400).json({ status: false, message: res.__("FIELD_NOT_REQUIRED") });
        }
    
        const imageData = file ? file.filename : '';
    
        const data = await Members.create({
            profile: imageData,
            name,
            fatherName,
            familyMembersCount,
            gender,
            email,
            bloodGroup,
            residentAddress,
            village,
            occupation,
            businessType,
            businessName,
            businessAddress,
            status,
            userId,
        });
    
        res.status(201).json({ status: true, message: res.__("MEMBER_CREATED_SUCCESSFULLY"), data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } 
};

exports.getMember = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const filters = {};
    if (req.query.role) {
        filters.role = req.query.role;
    }

    const searchQuery = req.query.search || '';

    const offset = (page - 1) * pageSize;

    const findMembers = await Members.findAndCountAll({
        where: { 
            ...filters,
            [Op.or]: [
                { name: { [Op.like]: `%${searchQuery}%` } },
                { fatherName: { [Op.like]: `%${searchQuery}%` } },
                { residentAddress: { [Op.like]: `%${searchQuery}%` } },
                { businessName: { [Op.like]: `%${searchQuery}%` } },
                { businessAddress: { [Op.like]: `%${searchQuery}%` } },
            ]
        },
        limit: pageSize,
        offset: offset
    });

    res.status(200).json({
        status: true,
        message: res.__("MEMBER_RETRIEVED_SUCCESSFULLY"),
        totalItems: findMembers.count,
        totalPages: Math.ceil(findMembers.count / pageSize),
        currentPage: page,
        data: findMembers,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const userId = req.user.id; 

        const findMember = await Members.findByPk(memberId);

        if (!findMember) {
            return res.status(404).json({ status: false, message: res.__("MEMBER_NOT_FOUND") });
        }

        if (findMember.userId !== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST") });
        }

        await findMember.destroy();

        res.status(200).json({ status: true, message: res.__("MEMBER_DELETED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const userId = req.user.id; 
        const { profile, name, fatherName, familyMembersCount, gender, email, bloodGroup, residentAddress, village, occupation, businessType, businessName, businessAddress, status } = req.body;

        const findMember = await Members.findByPk(memberId);

        if (!findMember) {
            return res.status(404).json({ status: false, message: res.__("MEMBER_NOT_FOUND") });
        }

        if (findMember.userId !== userId) {
            return res.status(403).json({ status: false, message: res.__("USERCREATEDBY_DOES_NOT_EXIST")});
        }

        const data = await findMember.update({
            profile,
            name,
            fatherName,
            familyMembersCount,
            gender,
            email,
            bloodGroup,
            residentAddress,
            village,
            occupation,
            businessType,
            businessName,
            businessAddress,
            status
        });

        res.status(200).json({ status: true, message: res.__("MEMBER_UPDATED_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}