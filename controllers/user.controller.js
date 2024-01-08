const async = require('hbs/lib/async')

const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb+srv://dangquanghuywork:az123321@dbcomp1640.j00tnue.mongodb.net/?retryWrites=true&w=majority');
// var url = 'mongodb://127.0.0.1:27017'
// var url = 'mongodb+srv://dangquanghuywork:az123321@dbcomp1640.j00tnue.mongodb.net/?retryWrites=true&w=majority'
const bcrypt = require('bcrypt');

module.exports.get_profile = async function (req, res) {
    let user_temp = req.session.UserInfo
    let id = user_temp[0]._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    if (user_temp[0].role == "staff") {
        res.render('user/profile', {
            user: User,
            check: User.role,
            layout: 'layouts/blog'
        })
    } else if (user_temp[0].role == "admin") {
        res.render('user/profile', {
            user: User,
            layout: 'layouts/admin'
        })
    } else {
        res.render('user/profile', {
            user: User,
            layout: 'layouts/manage'
        })
    }
}
module.exports.update_profile = async function (req, res) {
    let id = req.body.id;
    let name = req.body.name;

    let phone = req.body.phone;
    let gender = req.body.gender;
    let imgURL = req.file.path
    await client.connect();
    const dbo = client.db('COMP1640');
    // update user in database
    await dbo.collection('user').updateOne({ "_id": new ObjectId(id) },
        { $set: { name: name, phone: phone, gender: gender, imgURL: imgURL } });


    res.redirect('/user/profile');
}

module.exports.get_change_password = async function (req, res) {
    let user_temp = req.session.UserInfo
    const id = user_temp[0]._id;
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    if (user_temp[0].role == "staff") {
        res.render('user/reset', {
            user: User,
            layout: 'layouts/blog'
        })
    } else if (user_temp[0].role == "admin") {
        res.render('user/reset', {
            user: User,
            layout: 'layouts/admin'
        })
    } else {
        res.render('user/reset', {
            user: User,
            layout: 'layouts/manage'
        })
    }
}

module.exports.update_password = async function (req, res) {
    var errors = [];
    let id = req.body._id
    let tmp_role = req.session.UserInfo[0].role;
    let oldPass = req.body.old_pass
    let newPass = req.body.new_pass
    let rePass = req.body.confirm_pass


    let server = await MongoClient.connect(url)
    let dbo = server.db("COMP1640")


    // let old_pass = await dbo.collection('user').find({ $and: [{ 'password': oldPass }] }).toArray()

    // using bcrypt to compare password
    let user = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let old_pass = await bcrypt.compare(oldPass, user.password);

    

    if (old_pass == true) {
        if (newPass != rePass) {
            errors.push("Confirm password is not match");
        }
        if (errors.length) {
            if (tmp_role == "staff") {
                res.render('user/reset', {
                    errors: errors,
                    oldPass: oldPass,
                    newPass: newPass,
                    user: user,
                    rePass: rePass,
                    layout: 'layouts/blog'
                });
                return;
            } else if (tmp_role == "admin") {
                res.render('user/reset', {
                    errors: errors,
                    oldPass: oldPass,
                    newPass: newPass,
                    user: user,
                    rePass: rePass,
                    layout: 'layouts/admin'
                });
                return;
            } else {
                res.render('user/reset', {
                    errors: errors,
                    oldPass: oldPass,
                    newPass: newPass,
                    user: user,
                    rePass: rePass,
                    layout: 'layouts/manage'
                });
                return;
            }
        }
        newPass = await bcrypt.hash(newPass, 10);
        await dbo.collection('user').updateOne({ "_id": new ObjectId(id) }, { $set: { password: newPass } });
        res.redirect('/user/change_password' );
    } else {
        errors.push("Old password is not match");
        if (tmp_role == "staff") {
            res.render('user/reset', {
                errors: errors,
                oldPass: oldPass,
                newPass: newPass,
                user: user,
                rePass: rePass,
                layout: 'layouts/blog'
            });

        } else if (tmp_role == "admin") {
            res.render('user/reset', {
                errors: errors,
                oldPass: oldPass,
                newPass: newPass,
                user: user,
                rePass: rePass,
                layout: 'layouts/admin'
            });

        } else {
            res.render('user/reset', {
                errors: errors,
                oldPass: oldPass,
                newPass: newPass,
                user: user,
                rePass: rePass,
                layout: 'layouts/manage'
            });

        }
    }
}