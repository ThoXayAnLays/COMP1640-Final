const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb+srv://dangquanghuywork:az123321@dbcomp1640.j00tnue.mongodb.net/?retryWrites=true&w=majority');
const nodemailer = require('nodemailer');
const AdmZip = require('adm-zip');
const socket = require('../socket/socket_io')
const { DownloaderHelper } = require('node-downloader-helper');

const fs = require('fs');
const https = require('https'); 
const path = require('path');
const url = require('url');
const downloadFolder = path.join(__dirname, 'public', 'download_file');


const firebase = require('firebase/app');
const { getStorage, ref, uploadBytes } = require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyCt2puKjz5SaVit51drY7QAzvvbOZdWxUM",
    authDomain: "comp1640-e4877.firebaseapp.com",
    projectId: "comp1640-e4877",
    storageBucket: "comp1640-e4877.appspot.com",
    messagingSenderId: "850610504942",
    appId: "1:850610504942:web:894e2a6f70a60ec03bdfff",
    measurementId: "G-RG206H64C0"
};

firebase.initializeApp(firebaseConfig);

const storage = getStorage();

module.exports.index = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    let open_campaign = []
    var now = new Date();
    now = now.toISOString().slice(0, 10);
    now = new Date(now);
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let AllCampaign = await dbo.collection('campaign').find({}).toArray();
    let allstaff = await dbo.collection('user').find({ role: 'staff' }).toArray();
    let allcategory = await dbo.collection('category').find({}).toArray();
    let alldepartment = await dbo.collection('department').find({}).toArray();
    for (let i = 0; i < AllCampaign.length; i++) {
        let campaign = AllCampaign[i];
        let end = new Date(campaign.end_date);
        if (end > now) {
            open_campaign.push(campaign.title);
        }
    }
    let all_idea = await dbo.collection('ideas').find({}).sort({ date: -1 }).toArray();
    for (let i = 0; i < all_idea.length; i++) {
        let idea = all_idea[i];
        let date = new Date(idea.date);
        date = date.toISOString().slice(0, 10);
        idea.date = date;
    }
    res.render('staff/index', {
        user: User,
        allcampaign: AllCampaign,
        allstaff: allstaff,
        all_idea: all_idea,
        allcategory: allcategory,
        alldepartment: alldepartment,
        user_id: id,
        open_campaign: open_campaign,
        layout: 'layouts/blog'
    });
}
module.exports.postCreate = async function (req, res, next) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id

    let title = req.body.title_idea;
    let content = req.body.content;
    let campaign = req.body.campaign;
    let status = req.body.status;
    let category = req.body.category;
    let like = 0;
    let dislike = 0;
    let comment = [];
    let like_user = [];
    let dislike_user = [];

    const files = req.files || [];

    const fileUrls = [];

    for (let i = 0; i < files.length; i++) {

        const storageRef = ref(storage, req.files[i].originalname);
        uploadBytes(storageRef, req.files[i].buffer).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        filepublic = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(req.files[i].originalname)}?alt=media`;
        fileUrls.push(filepublic);
    }

    const filename = req.files.map(file => file.originalname);



    // let file_idea = req.files.map(file => file.path.split('\\').slice(1).join('/'));



    var now = new Date();
    //  now = now.toISOString().slice(0, 10);

    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let user_id = User._id;
    let user_name = User.name;
    let user_img = User.imgURL;
    let department = User.department;



    if (status == 'anonymous') {
        user_name = 'Anonymous';
        user_img = 'https://res.cloudinary.com/dtphprlvv/image/upload/v1681842939/uploads/anonymous_bww0xe.png';
    }
    let idea = {
        user_id: user_id,
        user_name: user_name,
        user_img: user_img,
        title: title,
        content: content,
        campaign: campaign,
        category: category,
        like: like,
        dislike: dislike,
        comment: comment,
        file_idea: fileUrls,
        like_user: like_user,
        filename: filename,
        dislike_user: dislike_user,
        date: now,
        department: department,
        status: status
    }
    await dbo.collection('ideas').insertOne(idea);

    let total_post = await dbo.collection('ideas').find({}).sort({ date: 1 }).toArray();
    let total = total_post.length;
    socket.emit('total_post', {
        total: total
    });

    let month = [];
    // get month in string
    for (let i = 0; i < total_post.length; i++) {
        let date = new Date(total_post[i].date);
        let month_idea_string = date.toLocaleString('default', { month: 'short' });

        if (!month.includes(month_idea_string)) {
            month.push(month_idea_string);
        }

    }
    let moth_temp = [];
    // get month in number
    for (let i = 0; i < total_post.length; i++) {
        let date = new Date(total_post[i].date);
        let idea_month = date.getMonth() + 1;
        if (!moth_temp.includes(idea_month)) {
            moth_temp.push(idea_month);
        }
    }
    let total_idea_month = [];
    for (let i = 0; i < moth_temp.length; i++) {
        let total_idea = await dbo.collection('ideas').find({}).toArray();
        let total_idea_in_month = 0;
        for (let j = 0; j < total_idea.length; j++) {
            let date = new Date(total_idea[j].date);
            let idea_month = date.getMonth() + 1;
            if (idea_month == moth_temp[i]) {
                total_idea_in_month++;
            }
        }
        total_idea_month.push(total_idea_in_month);
    }
    socket.emit('total_idea_month', {
        month: month,
        total_idea_month: total_idea_month,
    });



    res.redirect('/staff');
}




module.exports.download = async function (req, res) {
    let id = req.params.id;
    await client.connect();
    const dbo = client.db('COMP1640');
    let idea = await dbo.collection('ideas').findOne({ "_id": new ObjectId(id) });
    let fileurl = idea.file_idea;
    let foldername = "Download";
    let zip = new AdmZip();

    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
    }

    for (let j = 0; j < fileurl.length; j++) {
        let file_download = new DownloaderHelper(fileurl[j], downloadFolder);
        file_download.on('end', () => console.log('Download Completed'));
        await file_download.start();
        zip.addLocalFolder(downloadFolder, foldername);
    }
    let files = fs.readdirSync(downloadFolder);
    for (const file of files) {
        fs.unlinkSync(path.join(downloadFolder, file), err => {
            if (err) throw err;
        });
    }
    zip.writeZip('public/' + foldername + '.zip');
    res.download('public/' + foldername + '.zip');

}


module.exports.like = async function (req, res) {




    let id = req.params.id;
    let user_id = req.session.UserInfo[0]._id;
    await client.connect();
    const dbo = client.db('COMP1640');
    let idea = await dbo.collection('ideas').findOne({ "_id": new ObjectId(id) });
    let likes = idea.like;
    let like_user = idea.like_user;
    if (like_user.indexOf(user_id) == -1) {
        like_user.push(user_id);
        likes += 1;
    }
    await dbo.collection('ideas').updateOne({ "_id": new ObjectId(id) }, { $set: { like: likes, like_user: like_user } });



    socket.emit('like', {
        likes: likes,
        id: id
    });

    let all_idea = await dbo.collection('ideas').find({}).sort({ date: 1 }).toArray();
    let total = 0;
    for (let i = 0; i < all_idea.length; i++) {
        let idea = all_idea[i];
        total += idea.like;
    }
    socket.emit('total', {
        total: total
    });

    let month = [];
    for (let i = 0; i < all_idea.length; i++) {
        let date = new Date(all_idea[i].date);
        let month_idea_string = date.toLocaleString('default', { month: 'short' });
        // push only unique month to array
        if (!month.includes(month_idea_string)) {
            month.push(month_idea_string);
        }

    }
    let moth_temp = [];
    for (let i = 0; i < all_idea.length; i++) {
        let date = new Date(all_idea[i].date);
        let idea_month = date.getMonth() + 1;
        if (!moth_temp.includes(idea_month)) {
            moth_temp.push(idea_month);
        }
    }

    let total_interact_month = [];
    for (let i = 0; i < moth_temp.length; i++) {
        // using regex to find all idea in month
        let total_idea = await dbo.collection('ideas').find({}).toArray();
        let total_interact_in_month = 0;
        for (let j = 0; j < total_idea.length; j++) {
            let date = new Date(total_idea[j].date);
            let idea_month = date.getMonth() + 1;
            if (idea_month == moth_temp[i]) {
                total_interact_in_month += total_idea[j].like + total_idea[j].dislike + total_idea[j].comment.length;
            }
        }
        total_interact_month.push(total_interact_in_month);
    }

    socket.emit('total_interact_month', {
        month: month,
        total_interact_month: total_interact_month,
    });


    res.send({ like_user: like_user });
}
module.exports.dislike = async function (req, res) {


    let id = req.params.id;
    let user_id = req.session.UserInfo[0]._id;
    await client.connect();
    const dbo = client.db('COMP1640');
    let idea = await dbo.collection('ideas').findOne({ "_id": new ObjectId(id) });
    let dislikes = idea.dislike;
    let dislike_user = idea.dislike_user;
    if (dislike_user.indexOf(user_id) == -1) {
        dislike_user.push(user_id);
        dislikes += 1;
    }
    await dbo.collection('ideas').updateOne({ "_id": new ObjectId(id) }, { $set: { dislike: dislikes, dislike_user: dislike_user } });




    socket.emit('dislike', {
        dislikes: dislikes,
        id: id
    });



    let all_idea = await dbo.collection('ideas').find({}).sort({ date: 1 }).toArray();
    let total_dislike = 0;
    for (let i = 0; i < all_idea.length; i++) {
        let idea = all_idea[i];
        total_dislike += idea.dislike;
    }
    socket.emit('total_dislike', {
        total_dislike: total_dislike
    });

    let month = [];
    for (let i = 0; i < all_idea.length; i++) {
        let date = new Date(all_idea[i].date);
        let month_idea_string = date.toLocaleString('default', { month: 'short' });
        // push only unique month to array
        if (!month.includes(month_idea_string)) {
            month.push(month_idea_string);
        }

    }
    let moth_temp = [];
    for (let i = 0; i < all_idea.length; i++) {
        let date = new Date(all_idea[i].date);
        let idea_month = date.getMonth() + 1;
        if (!moth_temp.includes(idea_month)) {
            moth_temp.push(idea_month);
        }
    }

    let total_interact_month = [];
    for (let i = 0; i < moth_temp.length; i++) {
        // using regex to find all idea in month
        let total_idea = await dbo.collection('ideas').find({}).toArray();
        let total_interact_in_month = 0;
        for (let j = 0; j < total_idea.length; j++) {
            let date = new Date(total_idea[j].date);
            let idea_month = date.getMonth() + 1;
            if (idea_month == moth_temp[i]) {
                total_interact_in_month += total_idea[j].like + total_idea[j].dislike + total_idea[j].comment.length;
            }
        }
        total_interact_month.push(total_interact_in_month);
    }

    socket.emit('total_interact_month_dislike', {
        month: month,
        total_interact_month: total_interact_month,
    });

    res.send({ dislike_user: dislike_user });
}

module.exports.filter = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    let open_campaign = []
    var now = new Date();
    now = now.toISOString().slice(0, 10);
    now = new Date(now);







    // filter idea by campaign
    let campaign = req.params.id;
    await client.connect();
    const dbo = client.db('COMP1640');
    let allcategory = await dbo.collection('category').find({}).toArray();
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let AllCampaign = await dbo.collection('campaign').find({}).toArray();
    let alldepartment = await dbo.collection('department').find({}).toArray();
    let filter_campaign = await dbo.collection('campaign').findOne({ "_id": new ObjectId(campaign) });
    let allstaff = await dbo.collection('user').find({ role: 'staff' }).toArray();
    let all_idea = await dbo.collection('ideas').find({ campaign: filter_campaign.title }).toArray();



    for (let i = 0; i < all_idea.length; i++) {
        let idea = all_idea[i];
        let date = new Date(idea.date);
        date = date.toISOString().slice(0, 10);
        idea.date = date;
    }

    for (let i = 0; i < AllCampaign.length; i++) {
        let campaign = AllCampaign[i];
        let end = new Date(campaign.end_date);
        if (end > now) {
            open_campaign.push(campaign.title);
        }
    }


    res.render('staff/index', {
        user: User,
        allcampaign: AllCampaign,
        allstaff: allstaff,
        all_idea: all_idea,
        alldepartment: alldepartment,
        allcategory: allcategory,
        open_campaign: open_campaign,
        layout: 'layouts/blog'
    });
}

module.exports.filter_department = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    let open_campaign = []
    var now = new Date();
    now = now.toISOString().slice(0, 10);
    now = new Date(now);


    // filter idea by department
    let department = req.params.id;
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let AllCampaign = await dbo.collection('campaign').find({}).toArray();
    let alldepartment = await dbo.collection('department').find({}).toArray();
    let allcategory = await dbo.collection('category').find({}).toArray();
    let filter_department = await dbo.collection('department').findOne({ "_id": new ObjectId(department) });
    let allstaff = await dbo.collection('user').find({ role: 'staff' }).toArray();
    let all_idea = await dbo.collection('ideas').find({ department: filter_department.name }).toArray();


    for (let i = 0; i < all_idea.length; i++) {
        let idea = all_idea[i];
        let date = new Date(idea.date);
        date = date.toISOString().slice(0, 10);
        idea.date = date;
    }
    for (let i = 0; i < AllCampaign.length; i++) {
        let campaign = AllCampaign[i];
        let end = new Date(campaign.end_date);
        if (end > now) {
            open_campaign.push(campaign.title);
        }
    }
    res.render('staff/index', {
        user: User,
        allcampaign: AllCampaign,
        allstaff: allstaff,
        allcategory: allcategory,
        alldepartment: alldepartment,
        all_idea: all_idea,
        open_campaign: open_campaign,
        layout: 'layouts/blog'
    });
}

module.exports.search_idea = async function (req, res) {



    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    const All_ideas = await dbo.collection('ideas').find({}).toArray();
    let AllCampaign = await dbo.collection('campaign').find({}).toArray();
    let allstaff = await dbo.collection('user').find({ role: 'staff' }).toArray();
    let search = req.query.search_idea
    let result = All_ideas.filter(function (idea) {
        return idea.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });


    res.render('staff/index', {
        user: User,
        all_idea: result,
        allcampaign: AllCampaign,
        allstaff: allstaff,
        search: search,
        layout: 'layouts/blog'
    });
}

module.exports.comment = async function (req, res) {
    let id = req.params.id;
    let user_id = req.session.UserInfo[0]._id;



    let comment_text = req.body.comment;
    let anonymous = req.body.check_anony;
    await client.connect();
    let dbo = client.db('COMP1640');
    let idea = await dbo.collection('ideas').findOne({ "_id": new ObjectId(id) });
    let comment_arr = idea.comment;
    let owner_id = idea.user_id;
    let owener = await dbo.collection('user').findOne({ "_id": new ObjectId(owner_id) });
    let owener_email = owener.email;
    let user = await dbo.collection('user').findOne({ "_id": new ObjectId(user_id) });
    let user_name = user.name;
    let user_img = user.imgURL;






    if (anonymous == 'true') {
        user_name = 'Anonymous';
        user_img = 'https://res.cloudinary.com/dtphprlvv/image/upload/v1681842939/uploads/anonymous_bww0xe.png';
    }




    if (owner_id != user_id) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'rtkayn@gmail.com',
                pass: 'mwjwwmxqqjuplych'
            }
        });
        let mailOptions = {
            from: 'rtkayn@gmail.com',
            to: owener_email,
            subject: 'Comment',
            text: user_name + ' commented on your idea: Tittle: ' +idea.title
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }






    let comment_id = new ObjectId();
    let comment_temp = {
        comment_id: comment_id,
        user_id: user_id,
        user_name: user_name,
        user_img: user_img,
        comment_text: comment_text,
    }
    comment_arr.push(comment_temp);
    await dbo.collection('ideas').updateOne({ "_id": new ObjectId(id) }, { $set: { comment: comment_arr } });






    socket.emit('comment', {
        comment_arr: comment_arr,
        user_name: user_name,
        user_img: user_img,
        comment_text: comment_text,
        id: id
    });


    let all_idea = await dbo.collection('ideas').find({}).sort({ date: 1 }).toArray();
    let total_comment = 0;
    for (let i = 0; i < all_idea.length; i++) {
        let idea = all_idea[i];
        total_comment += idea.comment.length;
    }
    socket.emit('total_comment', {
        total_comment: total_comment
    });

    let month = [];
    for (let i = 0; i < all_idea.length; i++) {
        let date = new Date(all_idea[i].date);
        let month_idea_string = date.toLocaleString('default', { month: 'short' });
        // push only unique month to array
        if (!month.includes(month_idea_string)) {
            month.push(month_idea_string);
        }

    }
    let moth_temp = [];
    for (let i = 0; i < all_idea.length; i++) {
        let date = new Date(all_idea[i].date);
        let idea_month = date.getMonth() + 1;
        if (!moth_temp.includes(idea_month)) {
            moth_temp.push(idea_month);
        }
    }

    let total_interact_month = [];
    for (let i = 0; i < moth_temp.length; i++) {
        // using regex to find all idea in month
        let total_idea = await dbo.collection('ideas').find({}).toArray();
        let total_interact_in_month = 0;
        for (let j = 0; j < total_idea.length; j++) {
            let date = new Date(total_idea[j].date);
            let idea_month = date.getMonth() + 1;
            if (idea_month == moth_temp[i]) {
                total_interact_in_month += total_idea[j].like + total_idea[j].dislike + total_idea[j].comment.length;
            }
        }
        total_interact_month.push(total_interact_in_month);
    }

    socket.emit('total_interact_month_comment', {
        month: month,
        total_interact_month: total_interact_month,
    });
    res.send({ comment_arr: comment_arr });
}

module.exports.showcomment = async function (req, res) {
    let id = req.params.id;
    await client.connect();
    const dbo = client.db('COMP1640');
    let idea = await dbo.collection('ideas').findOne({ "_id": new ObjectId(id) });
    let comment_arr = idea.comment;
    res.send({ comment_arr: comment_arr });
}




module.exports.filter_category = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    let open_campaign = []
    var now = new Date();
    now = now.toISOString().slice(0, 10);
    now = new Date(now);


    // filter idea by category
    let category = req.params.id;
    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
    let AllCampaign = await dbo.collection('campaign').find({}).toArray();
    let allcategory = await dbo.collection('category').find({}).toArray();
    let alldepartment = await dbo.collection('department').find({}).toArray();
    let filter_category = await dbo.collection('category').findOne({ "_id": new ObjectId(category) });
    let allstaff = await dbo.collection('user').find({ role: 'staff' }).toArray();
    let all_idea = await dbo.collection('ideas').find({ category: filter_category.name }).toArray();



    for (let i = 0; i < all_idea.length; i++) {
        let idea = all_idea[i];
        let date = new Date(idea.date);
        date = date.toISOString().slice(0, 10);
        idea.date = date;
    }
    for (let i = 0; i < AllCampaign.length; i++) {
        let campaign = AllCampaign[i];
        let end = new Date(campaign.end_date);
        if (end > now) {
            open_campaign.push(campaign.title);
        }
    }
    res.render('staff/index', {
        user: User,
        allcampaign: AllCampaign,
        allstaff: allstaff,
        allcategory: allcategory,
        all_idea: all_idea,
        alldepartment: alldepartment,
        open_campaign: open_campaign,
        layout: 'layouts/blog'
    });

}

module.exports.checkcomment = async function (req, res) {
    let id = req.params.id;
    let check;
    await client.connect();
    const dbo = client.db('COMP1640');
    const idea = await dbo.collection('ideas').findOne({ "_id": new ObjectId(id) });
    let campaign = idea.campaign;
    const campaign_temp = await dbo.collection('campaign').findOne({ title: campaign });
    // check if campaign is open
    let now = new Date();
    now = now.toISOString().slice(0, 10);
    if (campaign_temp.end_date <= now) {
        check = 'closed'
    } else {
        check = 'open'
    }

    res.send({ check: check });
}


module.exports.chat = async function (req, res) {
    let chatMessage = req.body.chatMessage;
    let img = req.session.UserInfo[0].imgURL;
    let user_id = req.session.UserInfo[0]._id;
    socket.emit('chat', { chat: chatMessage, img: img, user_id: user_id });
    res.send({ chatMessage: chatMessage });
}


module.exports.mypost = async function (req, res) {
    let user_temp = req.session.UserInfo[0]
    let id = user_temp._id
    let open_campaign = []
    var now = new Date();
    now = now.toISOString().slice(0, 10);
    now = new Date(now);


    await client.connect();
    const dbo = client.db('COMP1640');
    const User = await dbo.collection('user').findOne({ "_id": new ObjectId(id) });
   
    // get all idea of user
    let AllCampaign = await dbo.collection('campaign').find({}).toArray();
    // let all_idea = await dbo.collection('ideas').find({ user_id: id }).toArray();
    // find all idea of user
    let all_idea = await dbo.collection('ideas').find({ user_id: User._id }).toArray();
    for (let i = 0; i < all_idea.length; i++) {
        let idea = all_idea[i];
        let date = new Date(idea.date);
        date = date.toISOString().slice(0, 10);
        idea.date = date;
    }
    for (let i = 0; i < AllCampaign.length; i++) {
        let campaign = AllCampaign[i];
        let end = new Date(campaign.end_date);
        if (end > now) {
            open_campaign.push(campaign.title);
        }
    }
    res.render('staff/mypost', {
        user: User,
        all_idea: all_idea,
        open_campaign: open_campaign,
        layout: 'layouts/blog'
    });
}


