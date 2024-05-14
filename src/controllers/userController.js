const User = require("../models/users");

const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");

const bcrypt = require("bcrypt");

const moment = require('moment');

const { EMAILCONSTANT } = require("../helper/constant");

const { sendEmail } = require("../helper/email.helper");

exports.signUp = async (req, res) => {
    try {
        const { name, fatherName, village, email, mobileNumbar, password, confirmPassword, role } = req.body;
      
        if (!name || !email || !password || !confirmPassword) {
          return res.status(400).json({ message: res.__("ERR_INVALID_CREDENTIALS_REQUIRED") });
        }
      
        if (password !== confirmPassword) {
          return res.status(400).json({ message: res.__("PASSWORDS_DO_NOT_MATCH") });
        }
      
        const findUserByEmail = await User.findOne({ where: { email } });
        const findUserByMobile = await User.findOne({ where: { mobileNumbar } });
      
        if (findUserByEmail || findUserByMobile) {
          return res.status(400).json({ message: res.__("USER_ALREADY_EXISTS") });
        }
      
        const hashedPassword = await bcrypt.hash(password, 10);
      
        const newUser = await User.create({
          name,
          fatherName,
          village,
          email,
          mobileNumbar,
          password: hashedPassword,
          confirmPassword: hashedPassword,
          role,
        });
      
        res.status(201).json({ status: true, message: res.__("USER_CREATED_SUCCESSFULLY"), user: newUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
      
};

exports.signIn = async (req, res) => {
    try {
        const { email , password} = req.body; 

        if (!email) {
            return res.status(400).json({ message: res.__("EMAIL_OR_MOBILE_NUMBER_IS_REQUIRED") });
        }

        const findUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { mobileNumbar: email }
                ]
            }
        });

        if (!findUser) {
            return res.status(404).json({ message: res.__("USER_NOT_FOUND") });
        }

        if (!password) {
            return res.status(400).json({ message: res.__("PASSWORD_REQUIRED") });
        }

        if (!findUser.password) {
            return res.status(400).json({ message: res.__("PASSWORD_NOT_SET_FOR_USER") });
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: res.__("INVALID_PASSWORD") });
        }

        const token = jwt.sign({ userId: findUser.id, email: findUser.email, mobileNumbar: findUser.mobileNumbar }, "secret-key", { expiresIn: "1h" });

        res.status(201).json({ status: true, message: res.__("LOGIN_SUCCESSFULLY"), token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body; 

        if (!email) {
            return res.status(400).json({ message: res.__("EMAIL_OR_MOBILE_NUMBER_IS_REQUIRED") });
        }

        const findUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { mobileNumbar: email }
                ]
            }
        });

        if (!findUser) {
            return res.status(404).json({ message: res.__("USER_NOT_FOUND") });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = moment().add(5, 'minutes'); 

        findUser.otp = otp;
        findUser.otpExpiry = otpExpiry;
        await findUser.save();

        let templateData = {
            date: moment().format('DD-MM-YYYY HH:mm:ss'),
            email: findUser.email, 
            OTP: otp
        };

        sendEmail(findUser.email, EMAILCONSTANT.FORGOT, templateData);

        res.status(200).json({ message: res.__("OTP_SENT_TO_YOUR_EMAIL") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
  
      const findUser = await User.findOne({ where: { email, otp } });
  
      if (!findUser) {
        return res.status(400).json({status: false, message: res.__("FIELD_NOT_REQUIRED ") });
      }
  
      if (findUser.otpExpiry < new Date()) {
        return res.status(400).json({status: false, message: res.__("INVALID_OTP") });
      }
  
      const compareNewPass = await bcrypt.compare(newPassword, findUser.password);
      if (compareNewPass) {
        return res.status(400).json({status: false, message: res.__("NEWPASSWORD_DIFFERENT_THE_OLD_ONE") });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      findUser.password = hashedPassword;
      findUser.otp = null;
      findUser.otpExpiry = null;  
      await findUser.save();
  
      return res.status(200).json({status: true, message: res.__("PASSWORD_RESET_SUCCESSFULLY") });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const filters = {};
    if (req.query.role) {
        filters.role = req.query.role;
    }

    const searchQuery = req.query.search || '';

    const offset = (page - 1) * pageSize;

    const findUsers = await User.findAndCountAll({
        where: { 
            ...filters,
            [Op.or]: [
                { name: { [Op.like]: `%${searchQuery}%` } },
                { email: { [Op.like]: `%${searchQuery}%` } },
                { mobileNumbar: { [Op.like]: `%${searchQuery}%` } }
            ]
        },
        limit: pageSize,
        offset: offset
    });

    if (!findUsers.rows || findUsers.rows.length === 0) {
        return res.status(404).json({ status: false, message: res.__("USER_NOT_FOUND") });
    }

    res.status(200).json({
        status: true,
        message: res.__("USER_RETRIEVED_SUCCESSFULLY"),
        totalItems: findUsers.count,
        totalPages: Math.ceil(findUsers.count / pageSize),
        currentPage: page,
        data: findUsers.rows,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
