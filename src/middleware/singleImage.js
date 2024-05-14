const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../singleuploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${Math.floor(Math.random() * 1000)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 1 * 1024 * 1024 } });

module.exports = upload