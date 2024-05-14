const { celebrate, Joi, Segments } = require('celebrate');

const {  ROLE_FIELD, GENDER_FIELD, BUSINESS_TYPE, STATUS_FIELD, ADVERTISEMENTS_TYPE } = require('../helper/constant');

module.exports = {
    signup: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().alphanum().min(2).max(30).required(),
            fatherName: Joi.string().alphanum().min(3).max(30).required(),
            village: Joi.string().alphanum().min(3).max(30).required(), 
            email: Joi.string().email().trim(true).required(),
            mobileNumbar: Joi.string().alphanum().min(0).max(10).required(),
            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?`\\-=[\\]\\\\;\',./\b\n\r\t\f]{3,30}$'))
                .min(8)
                .required(),
            confirmPassword: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?`\\-=[\\]\\\\;\',./\b\n\r\t\f]{3,30}$'))
            .min(8)
            .required(),
            role: Joi.string().min(3).max(30).required().valid(ROLE_FIELD.ADMIN, ROLE_FIELD.USER, ROLE_FIELD.VOLUNTEER).default(ROLE_FIELD.USER), 
        })
    }),
    signIn: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().trim(true).required(),
            // mobileNumbar: Joi.string().alphanum().min(0).max(10).required(),
            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?`\\-=[\\]\\\\;\',./\b\n\r\t\f]{3,30}$'))
                .min(7)
                .required(),
        })
    }),
    forgotPass: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().trim(true).required(),
        })
    }),
    resetPass: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().trim(true).required(),
            otp: Joi.string().alphanum().min(1).max(6).required(),
            newPassword : Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?`\\-=[\\]\\\\;\',./\b\n\r\t\f]{3,30}$'))
                .min(7)
                .required(),
        })
    }),
    Membersupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().min(2).max(10).required(),
            fatherName: Joi.string().min(2).max(10).required(),
            familyMembersCount: Joi.number().required(),
            gender: Joi.string().min(3).max(30).required().valid(GENDER_FIELD.MALE, GENDER_FIELD.FEMALE, GENDER_FIELD.OTHER),
            email: Joi.string().email().trim(true).required(),
            bloodGroup: Joi.string().required(),
            residentAddress: Joi.string().min(1).max(99).required(),
            village: Joi.string().min(1).max(10).required(),
            occupation: Joi.string().min(1).max(40).required(),
            businessType: Joi.string().required().valid(BUSINESS_TYPE.JOB, BUSINESS_TYPE.OWNER),
            businessName: Joi.string().min(1).max(50).required(),
            businessAddress: Joi.string().required(),
            status: Joi.string().required().valid(STATUS_FIELD.ACTIVE, STATUS_FIELD.DEACTIVE).default(STATUS_FIELD.ACTIVE), 
        })
    }),
    Studentupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().min(2).max(100).required(),
            schoolName: Joi.string().min(2).max(100).required(),
            standard: Joi.string().required(),
            percentage: Joi.number().required(),
            totalMarks: Joi.number().integer().required(),
            outOfMarks: Joi.number().integer().required(),
            grade: Joi.string().required(),
            message: Joi.string().min(1).max(100).required(),
            status: Joi.string().required().valid(STATUS_FIELD.ACTIVE, STATUS_FIELD.DEACTIVE).default(STATUS_FIELD.ACTIVE),       
        })
    }),
    Scheduleupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string().required(),
            date: Joi.date().required(),
            description: Joi.string().allow("").optional(),
            displayNo: Joi.number().integer().required(), 
        })
    }),
    Galleryupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string().required(),
            type: Joi.string().required(),
            status: Joi.string().required().valid(STATUS_FIELD.ACTIVE, STATUS_FIELD.DEACTIVE).default(STATUS_FIELD.ACTIVE),
        })
    }),
    Notificationupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            mobileNumber: Joi.string().required(),
            message: Joi.string().required(),
            date: Joi.date().required(),
            status: Joi.string().required().valid(STATUS_FIELD.ACTIVE, STATUS_FIELD.DEACTIVE).default(STATUS_FIELD.ACTIVE),
        })
    }),
    Advertisementupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            advertisements:Joi.string().valid(ADVERTISEMENTS_TYPE.SELF, ADVERTISEMENTS_TYPE.OTHER),
            title: Joi.string().required(),
            type: Joi.string().required(),
            address: Joi.string().required(),
            status: Joi.string().required().valid(STATUS_FIELD.ACTIVE, STATUS_FIELD.DEACTIVE).default(STATUS_FIELD.ACTIVE)
        })
    }),
    Sponsorsupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            village: Joi.string().min(2).max(100).required(),
            member: Joi.number().required(),
            totalAdvertisement: Joi.number().integer().required(),
            amount: Joi.number().integer().required(),
            received: Joi.number().integer().required(),
            sponsorName: Joi.string().required(),
            advertisementCategory: Joi.string().min(1).max(100).required(),
            status: Joi.string().required().valid(STATUS_FIELD.ACTIVE, STATUS_FIELD.DEACTIVE).default(STATUS_FIELD.ACTIVE), 
        })
    }),
    Sponsorslogoupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            LogoImage: Joi.string().allow(null).optional(),
            Title: Joi.string().required(),
            URL: Joi.string().required(),
            displayNo: Joi.number().integer().required(),
            status: Joi.string().required().valid(STATUS_FIELD.ACTIVE, STATUS_FIELD.DEACTIVE).default(STATUS_FIELD.ACTIVE),
        })
    }),
    Expenseupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string().required(),
            date: Joi.date().required(),
            amount: Joi.number().integer().min(0).required(),
        })
    }),
    Villageupdate: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            village: Joi.string().min(2).max(22).required(),
            taluka: Joi.string().min(2).max(15).required(),
            district: Joi.string().min(2).max(15).required(),
        })
    }),
   };