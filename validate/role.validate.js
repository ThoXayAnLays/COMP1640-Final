module.exports.role_validate = function (req, res, next) {
    let errors = [];
    let re_role = [];
    let role = req.body.role;
    let values = req.body;
    if (role=="0") {
        errors.push('Role is required');
    }else{
        re_role.push(role);
    }
    if (errors.length) {
        res.render('admin/edit', {
            errors: errors,
            values: values,
            user: req.session.UserInfo[0],
            re_role:re_role,
            layout: 'layouts/admin'
        });
        return;
    }
    next();

}