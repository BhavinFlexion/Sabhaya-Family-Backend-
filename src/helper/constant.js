
const ROLE_FIELD = {
  ADMIN: "Admin",
  VOLUNTEER: "Volunteer",
  USER: "User",
};

const STATUS_FIELD = {
  ACTIVE: "Active",
  DEACTIVE: "deactive",
};

const GENDER_FIELD = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

const BUSINESS_TYPE = {
  JOB: "Job",
  OWNER: "Owner",
};

const ADVERTISEMENTS_TYPE = {
  SELF: "self",
  OTHER: "other",
};

const EMAILCONSTANT = {
  FORGOT: { template: 'forgot_password', subject: 'Sabhaya Parivar - Forgot password OTP' },
}

module.exports = {
  ROLE_FIELD,
  STATUS_FIELD,
  GENDER_FIELD,
  BUSINESS_TYPE,
  ADVERTISEMENTS_TYPE,
  EMAILCONSTANT,
};