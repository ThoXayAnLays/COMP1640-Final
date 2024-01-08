var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/user.controller');
var validate = require('../validate/profile.validate');
var password_validate = require('../validate/password.validate');

var multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: 'dtphprlvv',
    api_key: '745482641659555',
    api_secret: 'dUw_X0cIU2wbKqOULNoUL7X8JDM'
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads',
    }
});
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname); // Add a timestamp to the filename to avoid conflicts
//     }
// });
const upload = multer({ storage: storage });


module.exports = router;


router.get('/profile', user_controller.get_profile);

router.post('/update',
    upload.single('imageURL'),
    validate.profileValidate,
    user_controller.update_profile);




router.get('/change_password', user_controller.get_change_password);

router.post('/change_password', password_validate.passwordValidate, user_controller.update_password); 