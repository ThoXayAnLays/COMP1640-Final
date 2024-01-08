module.exports.passwordValidate = async function(req, res, next) {
    var errors = [];
    let oldPass = req.body.old_pass
    let newPass = req.body.new_pass
    let rePass = req.body.confirm_pass
    let user_temp = req.session.UserInfo[0]
    if (!oldPass) {
        errors.push("Old password is required");
    }  
    if (!newPass) {
        errors.push("New password is required");
    }   
    if (!rePass) {
        errors.push("Confirm password is required");
    }  
    if (errors.length) {
        if(user_temp.role == "staff")
        {
            res.render('user/reset', {
                errors: errors,
                user: user_temp,
                oldPass: oldPass,
                newPass: newPass,
                rePass: rePass,
                user: user_temp,
                layout: 'layouts/blog'
            });
        }else if(user_temp.role == "admin"){
            res.render('user/reset', {
                errors: errors,
                oldPass: oldPass,
                newPass: newPass,
                rePass: rePass,
                user: user_temp,
                layout: 'layouts/admin'
            });
        }else{
            res.render('user/reset', {
                errors: errors,
                oldPass: oldPass,
                newPass: newPass,
                rePass: rePass,
                user: user_temp,
                layout: 'layouts/manage'
            });
        }
        return;
    }
    next()
} 