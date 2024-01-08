module.exports.department_validate = async function (req, res, next){
    let errors = [];
    let name = req.body.name;
    let description = req.body.description;
   
    if (!name) {
        errors.push("Title is required");
    }
    if (!description) {
        errors.push("Description is required");
    }
   
    if (errors.length) {
        res.render("manager/create_department", {
            errors: errors,
            user: req.session.UserInfo[0],
            values: req.body,
            layout: 'layouts/manage'
        });
        return;
    }
    next();
}
module.exports.update_department_validate = async function (req, res, next){
    let errors = [];
    let name = req.body.name;
    let description = req.body.description;
   
    if (!name) {
        errors.push("Title is required");
    }
    if (!description) {
        errors.push("Description is required");
    }
   
    if (errors.length) {
        res.render("manager/edit_department", {
            errors: errors,
            user: req.session.UserInfo[0],
            values: req.body,
            layout: 'layouts/manage'
        });
        return;
    }
    next();
}