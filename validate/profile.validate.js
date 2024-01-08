module.exports.profileValidate = function (req, res, next) {
    let errors = [];
    let re_gender = [];
    let gender = req.body.gender;
    let tmp_role = req.session.UserInfo[0].role;
    let name = req.body.name;
    let phone = req.body.phone;
    let values = req.body;
    let image = req.file;


    if (!name) {
        errors.push('Name is required');
    }
    if (!phone) {
        errors.push('Phone is required');
    } else {
        if (phone[0] != 0 || phone.length != 10 || isNaN(phone)) {
            errors.push('Phone is invalid');
        }
    }
    if (!image) {
        errors.push('Image is required');
    }


    if (gender == "0") {
        errors.push('Gender is required');
    } else {
        re_gender.push(gender);
    }
    if (errors.length) {
        // check role in session
        if (tmp_role == "staff") {
            res.render('user/profile', {
                errors: errors,
                values: values,
                check: req.session.UserInfo[0].role,
                user: req.session.UserInfo[0],
                re_gender: re_gender,
                layout: 'layouts/blog'
            });
        }else if(tmp_role == "admin"){
            res.render('user/profile', {
                errors: errors,
                values: values,
                user: req.session.UserInfo[0],
                re_gender: re_gender,
                layout: 'layouts/admin'
            });
        }else{
            res.render('user/profile', {
                errors: errors,
                values: values,
                user: req.session.UserInfo[0],
                
                re_gender: re_gender,
                layout: 'layouts/manage'
            });
        }
        return;
    }
    next();
}