module.exports.campaign_validate = async function (req, res, next) {

    let errors = [];
    let title = req.body.title;
    let description = req.body.description;
    let start_date = req.body.first_date;
    let end_date = req.body.final_date;
    let now = new Date();
    now = now.toISOString().slice(0, 10);
    if (!title) {
        errors.push("Title is required");
    }
    if (!description) {
        errors.push("Description is required");
    }
    if (!start_date) {
        errors.push("First closure date is required");
    } 
    else { 
        if (start_date > end_date) {
            errors.push("First closure date must be less than final closure date");
        }
        if(start_date < now){
            errors.push("First closure date must be greater than now");
        }
    }
    if (!end_date) {
        errors.push("Final closure date is required");
    }
    else{
        if (end_date < now) {
            errors.push("Final closure date must be greater than now");
        }
    }
    if (errors.length) {
        res.render("admin/add_campaign", {
            errors: errors,
            user: req.session.UserInfo[0],
            values: req.body,
            layout: 'layouts/admin'
        });
        return;
    }
    next();
}

module.exports.update_validate = async function (req, res, next) {
    let errors = [];
    let final_date = req.body.final_date;
    let start_date = req.body.first_date;

    if(!final_date){
        errors.push("Final closure date is required");
    }

    if (final_date < start_date) {
        errors.push("Final closure date must be greater than first closure date");
    }
    if (errors.length) {
        res.render("admin/edit_campaign", {
            errors: errors,
            user: req.session.UserInfo[0],
            values: req.body
        });
        return;
    }
    next();
}