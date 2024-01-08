



module.exports.authValidate = function(req, res, next) {
    var errors = [];
    let name = req.body.Username
    let pass = req.body.Password
    if (!name) {
        errors.push("Username is required");
    }   
    if (!pass) {
        errors.push("Password is required");
    }
     
    if (errors.length) {
        res.render('auth/login', {
            errors: errors,
            reName: req.body.Username,
            rePass: req.body.Password,
            layout: false
        });
        return;
    }
    next()
} 
