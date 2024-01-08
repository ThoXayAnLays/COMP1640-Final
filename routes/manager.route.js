var express = require('express');
var router = express.Router();

var manager_controller = require('../controllers/manager.controller');

var check_role = require('../validate/check_role.validate');
module.exports = router;
var category_validate = require('../validate/category.validate');
var department_validate = require('../validate/department.validate');



router.get('/', check_role.checkRoleManager, manager_controller.index);
router.get('/search', check_role.checkRoleManager, manager_controller.search);


router.get('/category',
    check_role.checkRoleManager,
    manager_controller.category);

router.get('/create_category',
    check_role.checkRoleManager,
    manager_controller.create_category);

router.post('/create_category',
    check_role.checkRoleManager,
    category_validate.category_validate,
    manager_controller.post_create_category);

router.get('/edit_category/:id',
    check_role.checkRoleManager,
    manager_controller.edit_category);

router.post('/update_category',
    check_role.checkRoleManager,
    category_validate.update_category_validate,
    manager_controller.update_category);

router.post('/delete_category',
    check_role.checkRoleManager,
    manager_controller.delete_category);




router.get('/department',
    check_role.checkRoleManager,
    manager_controller.department);

router.get('/create_department',
    check_role.checkRoleManager,
    manager_controller.create_department);

router.post('/create_department',
    check_role.checkRoleManager,
    department_validate.department_validate,
    manager_controller.post_create_department);

router.get('/edit_department/:id',
    check_role.checkRoleManager,
    manager_controller.edit_department);
router.post('/update_department',
    check_role.checkRoleManager,
    department_validate.update_department_validate,
    manager_controller.update_department);


router.post('/delete_department',
    check_role.checkRoleManager,
    manager_controller.delete_department);





router.get('/manage_idea', check_role.checkRoleManager, manager_controller.manage_idea)
router.get('/download', check_role.checkRoleManager, manager_controller.download)
router.get('/export', check_role.checkRoleManager, manager_controller.exportcsv)
router.get('/download_idea/:arr', manager_controller.download_idea)