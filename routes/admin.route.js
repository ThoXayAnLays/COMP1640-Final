var express = require('express');
var router = express.Router();
var multer = require('multer');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: 'dtphprlvv',
    api_key: '745482641659555',
    api_secret: 'dUw_X0cIU2wbKqOULNoUL7X8JDM'
  });
    

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname); // Add a timestamp to the filename to avoid conflicts
//     }
// });


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads',
    }
  });


const upload = multer({ storage: storage });
var admin_controller = require('../controllers/admin.controller');
var validate = require('../validate/profile.validate');




var ad_validate = require('../validate/ad_create.validate');
var check_role = require('../validate/check_role.validate');
var role_validate = require('../validate/role.validate');
var campaign_validate = require('../validate/campaign.validate');
module.exports = router;





router.get('/', check_role.checkRoleAdmin, admin_controller.index);





router.get('/search', check_role.checkRoleAdmin, admin_controller.search);



router.get('/create', check_role.checkRoleAdmin, admin_controller.create);










router.post('/create',
    check_role.checkRoleAdmin,
    upload.single('imageURL'),
    ad_validate.ad_create,
    admin_controller.postCreate);


router.get('/create_manager', check_role.checkRoleAdmin, admin_controller.create_manager);


router.post('/create_manager',
    upload.single('imageURL'),
    ad_validate.ad_createmanager,
    admin_controller.post_create_manager);



router.get('/manage_role', check_role.checkRoleAdmin, admin_controller.manage_role);

router.get('/get_staff', check_role.checkRoleAdmin, admin_controller.get_staff);

router.get('/get_admin', check_role.checkRoleAdmin, admin_controller.get_admin);

router.get('/get_qamanager', check_role.checkRoleAdmin, admin_controller.get_qamanager);

router.get('/get_qcmanager', check_role.checkRoleAdmin, admin_controller.get_qcmanager);



router.post('/delete', check_role.checkRoleAdmin, admin_controller.delete);





router.get('/edit/:id', check_role.checkRoleAdmin, admin_controller.edit);

router.post('/update',
    check_role.checkRoleAdmin,
    role_validate.role_validate,
    admin_controller.update);

router.get('/campaign', check_role.checkRoleAdmin, admin_controller.campaign);






router.get('/create_campaign', check_role.checkRoleAdmin, admin_controller.create_campaign);

router.post('/create_campaign',
    check_role.checkRoleAdmin,
    campaign_validate.campaign_validate,
    admin_controller.add_campaign);







router.post('/delete_campaign',
    check_role.checkRoleAdmin,
    admin_controller.delete_campaign);




router.get('/edit_campaign/:id',
    check_role.checkRoleAdmin,
    admin_controller.edit_campaign);



router.post('/update_campaign',
    check_role.checkRoleAdmin,
    campaign_validate.update_validate,
    admin_controller.update_campaign);

// router.get('/manage_idea', admin_controller.manage_idea)

// router.get('/download', admin_controller.download)

// router.get('/export', admin_controller.exportcsv)

// router.get('/dashboard', admin_controller.dashboard)
