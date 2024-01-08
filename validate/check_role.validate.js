






module.exports.checkRoleAdmin = function (req, res, next) {
     
     let check_role = req.session.role;
     if (check_role == "admin") {
          next();
     } else {
          
          res.redirect('/');
     }
}
module.exports.checkRoleManager = function (req, res, next) {
     let check_role = req.session.role;
     if (check_role == "qa manager") {
          next();
     } else {
          res.redirect('/');
     }
}
module.exports.checkRoleStaff = function (req, res, next) {
     let check_role = req.session.role;
     if (check_role == "staff") {
          next();
     } else {
          res.redirect('/');
     }
}