const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb+srv://dangquanghuywork:az123321@dbcomp1640.j00tnue.mongodb.net/?retryWrites=true&w=majority');
// var url = 'mongodb+srv://dangquanghuywork:az123321@dbcomp1640.j00tnue.mongodb.net/?retryWrites=true&w=majority'
const AdmZip = require('adm-zip');
const ObjectsToCsv = require('objects-to-csv');
const { request } = require('express');
const fs = require('fs');
const path = require('path');
const { DownloaderHelper } = require('node-downloader-helper');
const downloadFolder = path.join(__dirname, 'public', 'download_file');

module.exports.index = async function (req, res) {

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id



    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let AllIdea = await dbo.collection('ideas').find({}).sort({ date: 1 }).toArray();
    let total_like = 0;
    let total_dislike = 0;
    let total_post = AllIdea.length;
    let total_comment = 0;
    for (let i = 0; i < AllIdea.length; i++) {
        total_like += AllIdea[i].like;
        total_dislike += AllIdea[i].dislike;
        total_comment += AllIdea[i].comment.length;
    }


    let like_rate = (total_like / (total_like + total_dislike)) * 100;
    let dislike_rate = (total_dislike / (total_like + total_dislike)) * 100;



    let alldepartment = await dbo.collection('department').find({}).toArray();
    let name_department = [];
    for (let i = 0; i < alldepartment.length; i++) {
        let department = alldepartment[i];
        name_department.push(department.name);
    }
    let total_idea_department = [];
    for (let i = 0; i < alldepartment.length; i++) {
        let department = alldepartment[i];
        let total_idea = await dbo.collection('ideas').find({ department: department.name }).toArray();
        total_idea_department.push(total_idea.length);
    }




    let top_ten = await dbo.collection('ideas').find({}).sort({ like: -1 }).limit(10).toArray();




    // create an array to store months of all ideas
    let month = [];
    for (let i = 0; i < AllIdea.length; i++) {
        let date = new Date(AllIdea[i].date);
        let month_idea_string = date.toLocaleString('default', { month: 'short' });
        // push only unique month to array
        if (!month.includes(month_idea_string)) {
            month.push(month_idea_string);
        }

    }



    let moth_temp = [];
    for (let i = 0; i < AllIdea.length; i++) {
        let date = new Date(AllIdea[i].date);
        let idea_month = date.getMonth() + 1;
        if (!moth_temp.includes(idea_month)) {
            moth_temp.push(idea_month);
        }
    }


    let total_idea_month = [];
    let total_interact_month = [];
    for (let i = 0; i < moth_temp.length; i++) {
        let total_idea = await dbo.collection('ideas').find({}).toArray();
        let total_idea_in_month = 0;
        let total_interact_in_month = 0;
        for (let j = 0; j < total_idea.length; j++) {
            let date = new Date(total_idea[j].date);
            let idea_month = date.getMonth() + 1;
            if (idea_month == moth_temp[i]) {
                total_idea_in_month++;
                total_interact_in_month += total_idea[j].like + total_idea[j].dislike + total_idea[j].comment.length;
            }
        }
        total_idea_month.push(total_idea_in_month);
        total_interact_month.push(total_interact_in_month);
    }



    let total_user = await dbo.collection('user').find({}).toArray();
    let total_staff = await dbo.collection('user').find({ role: "staff" }).toArray();
    let total_admin = await dbo.collection('user').find({ role: "admin" }).toArray();
    let total_qamanager = await dbo.collection('user').find({ role: "qa manager" }).toArray();
    let total_qcmanager = await dbo.collection('user').find({ role: "qc manager" }).toArray();

    let staff_rate = Math.round((total_staff.length / total_user.length) * 100);
    let admin_rate = Math.round((total_admin.length / total_user.length) * 100);
    let qamanager_rate = Math.round((total_qamanager.length / total_user.length) * 100);
    let qcmanager_rate = Math.round((total_qcmanager.length / total_user.length) * 100);


    res.render('manager/dashboard', {
        user: User,
        total_post: total_post,
        name_department: name_department,
        total_idea_department: total_idea_department,
        like_rate: like_rate,
        dislike_rate: dislike_rate,
        total_like: total_like,
        total_dislike: total_dislike,
        total_comment: total_comment,
        top_ten: top_ten,
        month: month,

        total_idea_month: total_idea_month,
        total_interact_month: total_interact_month,
        staff_rate: staff_rate,
        admin_rate: admin_rate,
        qamanager_rate: qamanager_rate,
        qcmanager_rate: qcmanager_rate,
        layout: 'layouts/manage'
    });
}

module.exports.manage_idea = async function (req, res) {

    let page = parseInt(req.query.page) || 1; // n
    let perPage = 5; // x
    let start = (page - 1) * perPage;
    let end = page * perPage;

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let AllIdea = await dbo.collection('ideas').find({}).toArray();
    let total_idea = AllIdea.length;
    let total_page = total_idea / perPage;
    total_page = Math.ceil(total_page);
    AllIdea = AllIdea.slice(start, end);
    let ttp = []
    for (let i = 1; i <= total_page; i++) {
        ttp.push(i)
    }
    for (let i = 0; i < AllIdea.length; i++) {
        let idea = AllIdea[i];
        let date = new Date(idea.date);
        date = date.toISOString().slice(0, 10);
        idea.date = date;
    }
    res.render('manager/manage_idea', {
        user: User,
        allidea: AllIdea,
        page: page,
        total_page: ttp,
        total_idea: total_idea,
        layout: 'layouts/manage'
    });
}

module.exports.download = async function (req, res) {
    //download all files in all ideas to zip file
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });

    let AllIdea = await dbo.collection('ideas').find({}).toArray();
    let zip = new AdmZip();

    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
    }

    for(let i = 0; i < AllIdea.length; i++){
        let idea = AllIdea[i];
        let title = idea.title;
        let fileurl = idea.file_idea;

        let foldername = title;
        // add folder in zip file that name is title of idea
        for(let j = 0; j < fileurl.length; j++){
            let file_download = new DownloaderHelper(fileurl[j], downloadFolder);
            file_download.on('end', () => console.log('Download Completed'));
            await file_download.start();
            zip.addLocalFolder(downloadFolder, foldername);
        }
        // remove file in public/download_file
        let files = fs.readdirSync(downloadFolder);
        for (const file of files) {
            fs.unlinkSync(path.join(downloadFolder, file), err => {
                if (err) throw err;
            });
        }

        
    }
    let zipname = "all_ideas.zip";
    let zip_path = 'public/' + zipname;
    zip.writeZip(zip_path);
    res.download(zip_path);
}

module.exports.exportcsv = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });

    let export_idea = [];
    let AllIdea = await dbo.collection('ideas').find({}).toArray();
    for (let i = 0; i < AllIdea.length; i++) {
        let idea = AllIdea[i];
        let date = new Date(idea.date);
        date = date.toISOString().slice(0, 10);
        idea.date = date;
    }

    for (let i = 0; i < AllIdea.length; i++) {
        let temp = {
            user_name: AllIdea[i].user_name,
            title: AllIdea[i].title,
            content: AllIdea[i].content,
            campaign: AllIdea[i].campaign,
            department: AllIdea[i].department,
            category: AllIdea[i].category,
            like: AllIdea[i].like,
            dislike: AllIdea[i].dislike,
            comment: AllIdea[i].comment.length,
            statuss: AllIdea[i].status,
            created_date: AllIdea[i].date
        }
        export_idea.push(temp);
    }
    let csv = new ObjectsToCsv(export_idea);
    let csvname = "all_ideas.csv";
    let csv_path = 'public/' + csvname;
    await csv.toDisk(csv_path);
    res.download(csv_path);
}

module.exports.category = async function (req, res) {

    let page = parseInt(req.query.page) || 1; // n
    let perPage = 3; // x
    let start = (page - 1) * perPage;
    let end = page * perPage;


    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let allcategory = await dbo.collection('category').find({}).toArray();
    let total_page = allcategory.length / perPage;
    let total = allcategory.length;

    total_page = Math.ceil(total_page);

    let ttp = []
    for (let i = 1; i <= total_page; i++) {
        ttp.push(i)
    }
    allcategory = allcategory.slice(start, end);


    res.render('manager/category', {
        user: User,
        allcategory: allcategory,
        page: page,
        total: total,
        total_page: ttp,
        layout: 'layouts/manage'
    });
}
module.exports.department = async function (req, res) {
    let page = parseInt(req.query.page) || 1; // n
    let perPage = 3; // x
    let start = (page - 1) * perPage;
    let end = page * perPage;

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let Alldepartment = await dbo.collection('department').find({}).toArray();
    let total_page = Alldepartment.length / perPage;
    total_page = Math.ceil(total_page);
    let total = Alldepartment.length;
    let ttp = []
    for (let i = 1; i <= total_page; i++) {
        ttp.push(i)
    }
    Alldepartment = Alldepartment.slice(start, end);

    res.render('manager/department', {
        user: User,
        page: page,
        total_page: ttp,
        total: total,
        Alldepartment: Alldepartment,
        layout: 'layouts/manage'
    });
}

module.exports.create_category = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });

    res.render('manager/create_category', {
        user: User,
        layout: 'layouts/manage'
    });
}

module.exports.post_create_category = async function (req, res) {
    var errors = [];
    let name = req.body.name;
    let description = req.body.description;

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id;
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });

    const category = await dbo.collection('category').find({ name: name }).toArray();

    let temp_category = {
        name: name,
        description: description
    }
    if (category.length > 0) {
        errors.push('Category title is already exist')
        res.render('manager/create_category', {
            errors: errors,
            user: User,
            values: req.body,
            layout: 'layouts/manage'
        });
    } else {
        await dbo.collection('category').insertOne(temp_category);
        res.redirect('/manager/category');
    }
}

module.exports.create_department = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });

    res.render('manager/create_department', {
        user: User,
        layout: 'layouts/manage'
    });
}


module.exports.post_create_department = async function (req, res) {
    var errors = [];
    let name = req.body.name;
    let description = req.body.description;

    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id;
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });

    const department = await dbo.collection('department').find({ name: name }).toArray();

    let temp_department = {
        name: name,
        description: description
    }
    if (department.length > 0) {
        errors.push('Department title is already exist')
        res.render('manager/create_department', {
            errors: errors,
            user: User,
            values: req.body,
            layout: 'layouts/manage'
        });
    } else {
        await dbo.collection('department').insertOne(temp_department);
        res.redirect('/manager/department');
    }

}

module.exports.download_idea = async function (req, res) {

    let arr_id = req.params.arr.split(',');
    for (let i = 0; i < arr_id.length; i++) {
        arr_id[i] = new ObjectId(arr_id[i]);
    }
    await client.connect();

    const dbo = client.db('COMP1640');
    // find all idea with id in arr_id
    let AllIdea = await dbo.collection('ideas').find({ "_id": { $in: arr_id } }).toArray();
    let zip = new AdmZip();

    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
    }

    for(let i = 0; i < AllIdea.length; i++){
        let idea = AllIdea[i];
        let title = idea.title;
        let filename = idea.filename;
        let fileurl = idea.file_idea;

        let foldername = title;
        for(let j = 0; j < fileurl.length; j++){
            let file_download = new DownloaderHelper(fileurl[j], downloadFolder);
            file_download.on('end', () => console.log('Download Completed'));
            await file_download.start();
            zip.addLocalFolder(downloadFolder, foldername);
        }
        // remove file in public/download_file
        let files = fs.readdirSync(downloadFolder);
        for (const file of files) {
            fs.unlinkSync(path.join(downloadFolder, file), err => {
                if (err) throw err;
            });
        }
    }
    let zipname = "checked_idea.zip";
    let zip_path = 'public/' + zipname;
    zip.writeZip(zip_path);
    res.download(zip_path);
}

module.exports.delete_category = async function (req, res) {
    let id = req.body.delete_id;
    id = JSON.stringify(id);
    id = id.replace(/"/g, "");

    await client.connect();
    const dbo = client.db('COMP1640');
    await dbo.collection('category').deleteOne({ "_id": new ObjectId(id) });
    res.redirect('/manager/category');
}

module.exports.delete_department = async function (req, res) {
    let id = req.body.delete_id;
    id = JSON.stringify(id);
    id = id.replace(/"/g, "");

    await client.connect();
    const dbo = client.db('COMP1640');
    await dbo.collection('department').deleteOne({ "_id": new ObjectId(id) });
    res.redirect('/manager/department');
}

module.exports.edit_category = async function (req, res) {
    let id = req.params.id;
    let user_temp = req.session.UserInfo[0]
    let tmp_id = user_temp._id

    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(tmp_id) });
    const Category = await dbo.collection('category').findOne({ "_id": new ObjectId(id) });
    res.render('manager/edit_category', {
        edit_category: Category,
        user: User,
        layout: 'layouts/manage'
    });
}

module.exports.edit_department = async function (req, res) {
    let id = req.params.id;
    let user_temp = req.session.UserInfo[0]
    let tmp_id = user_temp._id

    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(tmp_id) });
    const Department = await dbo.collection('department').findOne({ "_id": new ObjectId(id) });
    res.render('manager/edit_department', {
        edit_department: Department,
        user: User,
        layout: 'layouts/manage'
    });
}

module.exports.update_category = async function (req, res) {
    let id = req.body.id;
    let description = req.body.description;
    await client.connect();
    const dbo = client.db('COMP1640');
    await dbo.collection('category').updateOne({ "_id": new ObjectId(id) }, { $set: { description: description } });
    res.redirect('/manager/category');
}

module.exports.update_department = async function (req, res) {
    let id = req.body.id;
    let description = req.body.description;
    await client.connect();
    const dbo = client.db('COMP1640');
    await dbo.collection('department').updateOne({ "_id": new ObjectId(id) }, { $set: { description: description } });
    res.redirect('/manager/department');
}
module.exports.search = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const Allidea = await dbo.collection('ideas').find({}).toArray();
    for (let i = 0; i < Allidea.length; i++) {
        let idea = Allidea[i];
        let date = new Date(idea.date);
        date = date.toISOString().slice(0, 10);
        idea.date = date;
    }
    let search = req.query.search
    let result = Allidea.filter(function (idea) {
        return idea.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });


    res.render('manager/manage_idea', {
        user: User,
        allidea: result,
        search: search,
        layout: 'layouts/manage'
    });
}