var express = require('express');
var router = express.Router();
var controller = require('../controllers/auth.controller');
var validate = require('../validate/auth.validate');

module.exports = router;




/* These are routes defined for authentication in an Express.js application. */

router.get('/login', controller.login);
 
router.post('/login',validate.authValidate, controller.postLogin);

router.get('/logout', controller.logout);