
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb+srv://dangquanghuywork:az123321@dbcomp1640.j00tnue.mongodb.net/?retryWrites=true&w=majority');

const AdmZip = require('adm-zip');
const ObjectsToCsv = require('objects-to-csv');


module.exports.index = async function (req, res) {

    let page = parseInt(req.query.page) || 1; // n
    let perPage = 5; // x
    let start = (page - 1) * perPage;
    let end = page * perPage;

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let AllUser = await dbo.collection('user').find({}).toArray();
    let alldepartment = await dbo.collection('department').find({}).toArray();
    req.session.alldepartment = alldepartment;
    let total_page = AllUser.length / perPage;
    let total = AllUser.length;
    total_page = Math.ceil(total_page);
    let ttp = []
    for (let i = 1; i <= total_page; i++) {
        ttp.push(i)
    }
    AllUser = AllUser.slice(start, end);

    res.render('admin/index', {
        user: User,
        page: page,
        total_page: ttp,
        total: total,
        alluser: AllUser,
        layout: 'layouts/admin'
    });
}




module.exports.search = async function (req, res) {

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const AllUser = await dbo.collection('user').find({}).toArray();
    let search = req.query.search
    let result = AllUser.filter(function (user) {
        return user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });


    res.render('admin/index', {
        user: User,
        alluser: result,
        search: search,
        layout: 'layouts/admin'
    });
}

module.exports.create = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const Alldepartment = await dbo.collection('department').find({}).toArray();
    res.render('admin/create', {
        user: User,
        alldepartment: Alldepartment,
        layout: 'layouts/admin'
    });
}

module.exports.postCreate = async function (req, res) {

    var errors = [];
    let re_gender = [];
    let re_department = [];
    let username = req.body.username;
    let gender = req.body.gender;
    let department = req.body.department;
    if (gender == "0") {
        errors.push('Gender is required');
    } else {
        re_gender.push(gender);
    }
    if (department == "0") {
        errors.push('Department is required');
    } else {
        re_department.push(department);
    }

    let user = {
        name: req.body.name,
        username: req.body.username,
        // hash password by bcrypt
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        role: 'staff',
        department: req.body.department,
        // imgURL: req.file.path.split('\\').slice(1).join('/')
        imgURL: req.file.path
    }
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id


    await client.connect();
    const dbo = client.db('COMP1640');
    let check_user = await dbo.collection('user').find({ 'username': username }).toArray();
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let alldepartment = await dbo.collection('department').find({}).toArray();
    if (check_user.length > 0) {
        errors.push('Username is exist');
        res.render('admin/create', {
            errors: errors,
            alldepartment: alldepartment,
            user: User,
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            re_gender: re_gender,
            re_department: re_department,
            layout: 'layouts/admin'
        });
    }
    else {
        await dbo.collection('user').insertOne(user);
        res.redirect('/admin');
    }
}

module.exports.manage_role = async function (req, res) {
    let page = parseInt(req.query.page) || 1; // n
    let perPage = 5; // x
    let start = (page - 1) * perPage;
    let end = page * perPage;

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let AllUser = await dbo.collection('user').find({}).toArray();
    let total_page = AllUser.length / perPage;
    let total = AllUser.length;
    total_page = Math.ceil(total_page);
    let ttp = []
    for (let i = 1; i <= total_page; i++) {
        ttp.push(i)
    }
    AllUser = AllUser.slice(start, end);

    res.render('admin/manage_role', {
        user: User,
        page: page,
        total_page: ttp,
        total: total,
        alluser: AllUser,
        layout: 'layouts/admin'
    });
}

module.exports.get_staff = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    let role_arr = ["staff"]
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const AllUser = await dbo.collection('user').find({ role: "staff" }).toArray();

    res.render('admin/manage_role', {
        user: User,
        alluser: AllUser,
        role_arr: role_arr,
        layout: 'layouts/admin'
    });
}

module.exports.get_admin = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    let role_arr = ["admin"]
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const AllUser = await dbo.collection('user').find({ role: "admin" }).toArray();
    res.render('admin/manage_role', {
        user: User,
        alluser: AllUser,
        role_arr: role_arr,
        layout: 'layouts/admin'
    });
}

module.exports.get_qamanager = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    let role_arr = ["qamanager"]
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const AllUser = await dbo.collection('user').find({ role: "qa manager" }).toArray();
    res.render('admin/manage_role', {
        user: User,
        alluser: AllUser,
        role_arr: role_arr,
        layout: 'layouts/admin'
    });
}
module.exports.get_qcmanager = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    let role_arr = ["qcmanager"]
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const AllUser = await dbo.collection('user').find({ role: "qc manager" }).toArray();
    res.render('admin/manage_role', {
        user: User,
        alluser: AllUser,
        role_arr: role_arr,
        layout: 'layouts/admin'
    });
}


module.exports.delete = async function (req, res) {

    let id = req.body.delete_id;
    id = JSON.stringify(id);
    id = id.replace(/"/g, "");

    await client.connect();
    const dbo = client.db('COMP1640');
    await dbo.collection('user').deleteOne({ "_id": new ObjectId(id) });
    res.redirect('/admin');
}


module.exports.edit = async function (req, res) {
    let id = req.params.id;
    let user_temp = req.session.UserInfo[0]
    let tmp_id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const tmp_User = await dbo.collection('user').findOne({ "_id": new ObjectId(tmp_id) });
    res.render('admin/edit', {
        edit_user: User,
        user: tmp_User,
        layout: 'layouts/admin'
    });
}

module.exports.update = async function (req, res) {

    let id = req.body.id;
    let role = req.body.role;
    await client.connect();
    const dbo = client.db('COMP1640');
    await dbo.collection('user').updateOne({ "_id": new ObjectId(id) }, { $set: { role: role } });
    res.redirect('/admin');
}

module.exports.campaign = async function (req, res) {

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let AllCampaign = await dbo.collection('campaign').find({}).toArray();
    let total_campaign = AllCampaign.length;

    let end_date = []
    for (let i = 0; i < AllCampaign.length; i++) {
        end_date.push(AllCampaign[i].end_date)
    }

    res.render('admin/campaign', {
        user: User,
        total_campaign: total_campaign,
        end_date: end_date,
        allcampaign: AllCampaign,
        layout: 'layouts/admin'
    });
}

module.exports.create_campaign = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });

    res.render('admin/add_campaign', {
        user: User,
        layout: 'layouts/admin'
    });
}

module.exports.add_campaign = async function (req, res) {

    let errors = [];
    let title = req.body.title;
    let description = req.body.description;
    let start_date = req.body.first_date;
    let end_date = req.body.final_date;

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id

    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const campaign = await dbo.collection('campaign').find({ title: title }).toArray();
    let temp_campaign = {
        title: title,
        description: description,
        start_date: start_date,
        end_date: end_date
    }

    if (campaign.length > 0) {
        errors.push('Campaign title is already exist')
        res.render('admin/add_campaign', {
            errors: errors,
            user: User,
            values: req.body,
            layout: 'layouts/admin'
        });
    } else {
        await dbo.collection('campaign').insertOne(temp_campaign);
        res.redirect('/admin/campaign');
    }

}


module.exports.delete_campaign = async function (req, res) {

    let id = req.body.delete_id;
    id = JSON.stringify(id);
    id = id.replace(/"/g, "");

    await client.connect();
    const dbo = client.db('COMP1640');
    await dbo.collection('campaign').deleteOne({ "_id": new ObjectId(id) });
    res.redirect('/admin/campaign');
}


module.exports.edit_campaign = async function (req, res) {

    let id = req.params.id;
    let user_temp = req.session.UserInfo[0]
    let tmp_id = user_temp._id

    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(tmp_id) });
    const Campaign = await dbo.collection('campaign').findOne({ "_id": new ObjectId(id) });
    res.render('admin/edit_campaign', {
        edit_campaign: Campaign,
        user: User,
        layout: 'layouts/admin'
    });
}



module.exports.update_campaign = async function (req, res) {

    let id = req.body.id;
    let end_date = req.body.final_date;
    await client.connect();
    const dbo = client.db('COMP1640');
    await dbo.collection('campaign').updateOne({ "_id": new ObjectId(id) }, { $set: { end_date: end_date } });
    res.redirect('/admin/campaign');
}

// module.exports.manage_idea = async function(req, res){

//     let page = parseInt(req.query.page) || 1; // n
//     let perPage = 5; // x
//     let start = (page - 1) * perPage;
//     let end = page * perPage;

//     let user_temp = req.session.UserInfo[0]
//     let id = user_temp._id
//     await client.connect();
//     const dbo = client.db('COMP1640');
//     const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
//     let AllIdea = await dbo.collection('ideas').find({}).toArray();
//     let total_idea = AllIdea.length;
//     let total_page = total_idea / perPage;
//     total_page = Math.ceil(total_page);
//     AllIdea = AllIdea.slice(start, end);
//     let ttp = []
//     for (let i = 1; i <= total_page; i++) {
//         ttp.push(i)
//     }
//     for (let i = 0; i < AllIdea.length; i++) {
//         let idea = AllIdea[i];
//         let date = new Date(idea.date);
//         date = date.toISOString().slice(0, 10);
//         idea.date = date;
//     }
//     res.render('admin/manage_idea', {
//         user: User,
//         allidea: AllIdea,
//         page: page,
//         total_page: ttp,
//         total_idea: total_idea,
//         layout: 'layouts/admin'
//     });
// }

// module.exports.download = async function (req, res) {
//     //download all files in all ideas to zip file
//     let user_temp = req.session.UserInfo[0]
//     let id = user_temp._id
//     await client.connect();
//     const dbo = client.db('COMP1640');
//     const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
//     let AllIdea = await dbo.collection('ideas').find({}).toArray();
//     let zip = new AdmZip();
//     for (let i = 0; i < AllIdea.length; i++) {
//         let file = AllIdea[i].file_idea;
//         let filename = AllIdea[i].title;
//         let file_path =  'public/' + file;
//         zip.addLocalFile(file_path, filename);
//     }
//     let zipname = "all_ideas.zip";
//     let zip_path =  'public/' + zipname;
//     zip.writeZip(zip_path);
//     res.download(zip_path);
// }

// module.exports.exportcsv = async function (req, res) {
//     let user_temp = req.session.UserInfo[0]
//     let id = user_temp._id
//     await client.connect();
//     const dbo = client.db('COMP1640');
//     const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
//     let export_idea=[];
//     let AllIdea = await dbo.collection('ideas').find({}).toArray();
//     for (let i = 0; i < AllIdea.length; i++) {
//         let idea = AllIdea[i];
//         let date = new Date(idea.date);
//         date = date.toISOString().slice(0, 10);
//         idea.date = date;
//     }
//     for (let i = 0; i < AllIdea.length; i++) {
//         let temp = {
//             user_name : AllIdea[i].user_name,
//             title : AllIdea[i].title,
//             content : AllIdea[i].content,
//             campaign :AllIdea[i].campaign,
//             department : AllIdea[i].department,
//             category : AllIdea[i].category,
//             like :AllIdea[i].like,
//             dislike : AllIdea[i].dislike,
//             comment: AllIdea[i].comment.length,
//             statuss : AllIdea[i].status,
//             created_date : AllIdea[i].date
//         }
//         export_idea.push(temp);
//     }
//     let csv = new ObjectsToCsv(export_idea);
//     let csvname = "all_ideas.csv";
//     let csv_path =  'public/' + csvname;
//     await csv.toDisk(csv_path);
//     res.download(csv_path);
// }

module.exports.create_manager = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    res.render('admin/create_manager', {
        user: User,
        layout: 'layouts/admin'
    });
}


// module.exports.dashboard = async function(req, res){

//     let user_temp = req.session.UserInfo[0]
//     let id = user_temp._id
//     await client.connect();
//     const dbo = client.db('COMP1640');
//     const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
//     let AllIdea = await dbo.collection('ideas').find({}).sort({date: 1}).toArray();

//     let total_like = 0;
//     let total_dislike = 0;
//     let total_post = AllIdea.length;
//     let total_comment = 0;
//     for (let i = 0; i < AllIdea.length; i++) {
//         total_like += AllIdea[i].like;
//         total_dislike += AllIdea[i].dislike;
//         total_comment += AllIdea[i].comment.length;
//     }
//     let like_rate = (total_like /(total_like + total_dislike))*100;
//     let dislike_rate = (total_dislike /(total_like + total_dislike))*100;
//     let alldepartment = await dbo.collection('department').find({}).toArray();

//     let name_department = [];
//     for (let i = 0; i < alldepartment.length; i++) {
//         let department = alldepartment[i];
//         name_department.push(department.name);
//     }

//     let total_idea_department=[] ;
//     for (let i = 0; i < alldepartment.length; i++) {
//         let department = alldepartment[i];
//         let total_idea = await dbo.collection('ideas').find({department: department.name}).toArray();
//         total_idea_department.push(total_idea.length);
//     }

//     let top_ten = await dbo.collection('ideas').find({}).sort({like: -1}).limit(10).toArray();

//     // create an array to store months of all ideas
//     let month = [];
//     for (let i = 0; i < AllIdea.length; i++) {
//         let date = new Date(AllIdea[i].date);
//         let month_idea_string = date.toLocaleString('default', { month: 'short' });
//         // push only unique month to array
//         if (!month.includes(month_idea_string)){
//             month.push(month_idea_string);
//         }

//     }



//     let moth_temp = [];
//     for(let i = 0; i < AllIdea.length; i++){
//         let date = new Date(AllIdea[i].date);
//         let idea_month = date.getMonth() +1;
//         if(!moth_temp.includes(idea_month)){
//             moth_temp.push(idea_month);
//         }
//     }
//     let total_idea_month = [];
//     let total_interact_month = [];
//     for(let i = 0; i < moth_temp.length; i++){
//         // using regex to find all idea in month
//         let total_idea = await dbo.collection('ideas').find({}).toArray();
//         let total_idea_in_month = 0;
//         let total_interact_in_month = 0;
//         for(let j = 0; j < total_idea.length; j++){
//             let date = new Date(total_idea[j].date);
//             let idea_month = date.getMonth() +1;
//             if(idea_month == moth_temp[i]){
//                 total_idea_in_month++;
//                 total_interact_in_month += total_idea[j].like + total_idea[j].dislike + total_idea[j].comment.length;
//             }

//         }
//         total_idea_month.push(total_idea_in_month);
//         total_interact_month.push(total_interact_in_month);
//     }
//     let total_user = await dbo.collection('user').find({}).toArray();
//     let total_staff = await dbo.collection('user').find({role: "staff"}).toArray();
//     let total_admin = await dbo.collection('user').find({role: "admin"}).toArray();
//     let total_qamanager = await dbo.collection('user').find({role: "qa manager"}).toArray();
//     let total_qcmanager = await dbo.collection('user').find({role: "qc manager"}).toArray();

//     let staff_rate = Math.round((total_staff.length/total_user.length)*100) ;
//     let admin_rate = Math.round((total_admin.length/total_user.length)*100);
//     let qamanager_rate =Math.round( (total_qamanager.length/total_user.length)*100);
//     let qcmanager_rate = Math.round((total_qcmanager.length/total_user.length)*100);


//     res.render('admin/dashboard',{
//         user: User,
//         total_post: total_post,
//         name_department: name_department,
//         total_idea_department: total_idea_department,
//         like_rate: like_rate,
//         dislike_rate: dislike_rate,
//         total_like: total_like,
//         total_dislike: total_dislike,
//         total_comment: total_comment,
//         top_ten: top_ten,
//         month: month,
//         total_idea_month: total_idea_month,
//         total_interact_month: total_interact_month,
//         staff_rate: staff_rate,
//         admin_rate: admin_rate,
//         qamanager_rate: qamanager_rate,
//         qcmanager_rate: qcmanager_rate,
//         layout: 'layouts/admin'
//     });
// }

module.exports.post_create_manager = async function (req, res) {
    var errors = [];
    let re_role = [];
    let re_gender = [];
    let username = req.body.username;
    let role = req.body.role;
    let gender = req.body.gender;
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
    let user = {
        name: req.body.name,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        role: req.body.role,
        department: 'none',
        imgURL: req.file.path
    }
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    let check_user = await dbo.collection('user').find({ 'username': username }).toArray();
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    if (check_user.length > 0) {
        errors.push('Username is exist'); 
        res.render('admin/create_manager', {
            errors: errors,
            user: User,
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            re_role: re_role,
            re_gender: re_gender,
        });
    }
    else {
        await dbo.collection('user').insertOne(user);
        res.redirect('/admin');
    }
}