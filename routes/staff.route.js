var express = require('express');
var router = express.Router();
var multer = require('multer');



const upload = multer({
    storage: multer.memoryStorage()
})

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); 
//   }
// });



var staff_controller = require('../controllers/staff.controller');
var check_role = require('../validate/check_role.validate');
module.exports = router;




router.get('/', check_role.checkRoleStaff, staff_controller.index);




router.post('/create',
  check_role.checkRoleStaff,
  // upload.single('file_idea'),
  // upload many file
  upload.any('file_idea', 10),
  staff_controller.postCreate);




router.get('/download/:id',
  check_role.checkRoleStaff,
  staff_controller.download);



router.post('/like/:id', check_role.checkRoleStaff, staff_controller.like);

router.post('/dislike/:id',
  check_role.checkRoleStaff,
  staff_controller.dislike);





router.get('/search',
  check_role.checkRoleStaff,
  staff_controller.search_idea)

router.get('/filter/:id',
  check_role.checkRoleStaff,
  staff_controller.filter);

router.get('/filter_category/:id',
  check_role.checkRoleStaff,
  staff_controller.filter_category);

router.get('/filter_department/:id',
  check_role.checkRoleStaff,
  staff_controller.filter_department);




router.post('/comment/:id',
  check_role.checkRoleStaff,
  staff_controller.comment);


router.post('/checkcomment/:id',
  check_role.checkRoleStaff,
  staff_controller.checkcomment);

router.post('/chat/', staff_controller.chat);

router.get('/my_post', check_role.checkRoleStaff, staff_controller.mypost)