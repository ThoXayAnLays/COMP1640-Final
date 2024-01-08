
module.exports.ad_create = function (req, res, next) {

    
    let errors = [];
    let re_role = [];
    let re_gender = [];
    let re_image = [];
    let re_department = [];
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let role = req.body.role;
    let gender = req.body.gender;
    let department = req.body.department;
    let image = req.file;


    if (!name) {
        errors.push('Name is required');
    }
    if (!username) {
        errors.push('Username is required');
    }
    if (!email) {
        errors.push('Email is required');
    } else {
        if (!email.includes('@')) {
            errors.push('Email is invalid');
        }
    }
    if (!password) {
        errors.push('Password is required');
    }
    if (!phone) {
        errors.push('Phone is required');
    } else {
        if (phone[0] != 0 || phone.length != 10 || isNaN(phone)) {
            errors.push('Phone is invalid');
        }
    }
    if (role == "0") {
        errors.push('Role is required');
    } else {
        re_role.push(role);
    }
    if (department == "0") {
        errors.push('Department is required');
    } else {
        re_department.push(department);
    }
    if (gender == "0") {
        errors.push('Gender is required');
    } else {
        re_gender.push(gender);
    }

    if (!image) {
        errors.push('Image is required');
    } else {
        re_image.push(image);
    }
    if (errors.length) {
        res.render('admin/create', {
            errors: errors,
            user: req.session.UserInfo[0],
            alldepartment: req.session.alldepartment,
            name: name,
            username: username,
            email: email,
            password: password,
            phone: phone,
            re_role: re_role,
            re_gender: re_gender,
            re_department: re_department,
            re_image: re_image,
            layout: 'layouts/admin'

        });
        return;
    }
    next();


}


module.exports.ad_createmanager = function (req, res, next) {
    let errors = [];
    let re_role = [];
    let re_gender = [];
    let re_image = [];
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let role = req.body.role;
    let gender = req.body.gender;
    let image = req.file;

    if (!name) {
        errors.push('Name is required');
    }
    if (!username) {
        errors.push('Username is required');
    }
    if (!email) {
        errors.push('Email is required');
    } else {
        if (!email.includes('@')) {
            errors.push('Email is invalid');
        }
    }
    if (!password) {
        errors.push('Password is required');
    }
    if (!phone) {
        errors.push('Phone is required');
    } else {
        if (phone[0] != 0 || phone.length != 10 || isNaN(phone)) {
            errors.push('Phone is invalid');
        }
    }
    if (role == "0") {
        errors.push('Role is required');
    } else {
        re_role.push(role);
    }
    if (gender == "0") {
        errors.push('Gender is required');
    } else {
        re_gender.push(gender);
    }

    if (!image) {
        errors.push('Image is required');
    } else {
        re_image.push(image);
    }
    if (errors.length) {
        res.render('admin/create_manager', {
            errors: errors,
            user: req.session.UserInfo[0],
            name: name,
            username: username,
            email: email,
            password: password,
            phone: phone,
            re_role: re_role,
            re_gender: re_gender,
            re_image: re_image
        });
        return;
    }
    next();
}