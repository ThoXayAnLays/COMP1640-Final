const async = require('hbs/lib/async')
const bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient
// var url = 'mongodb://127.0.0.1:27017'
var url = 'mongodb+srv://dangquanghuywork:az123321@dbcomp1640.j00tnue.mongodb.net/?retryWrites=true&w=majority'



module.exports.login = function(req, res) {
    res.render('auth/login',{layout: false});
} 

 


module.exports.postLogin = async function(req, res) {
    
    let errors = []
    let name = req.body.Username
    let pass = req.body.Password
  
    let server = await MongoClient.connect(url)
    
    let dbo = server.db("COMP1640")
    
    // const users = await dbo.collection('user').find({
    //     username: name,
    //     $where: function() {
    //        return bcrypt.compareSync(pass, this.password)
    //     }
    // }).toArray();

    const users = await dbo.collection('user').find({
        username: name
    }).toArray();
    
    if(users.length == 0) {
        errors.push("Username or Password is incorrect");
        res.render('auth/login', {
            errors: errors,
            reName: req.body.Username,
            rePass: req.body.Password,
            layout: false
        });
        return;
    }
    const checklogin = bcrypt.compareSync(pass, users[0].password)
     
    if (checklogin == true) {
        req.session.userName = name
        req.session.role = users[0].role
        req.session.UserInfo = users
        res.redirect('/')
        return
    } else {
        errors.push("Username or Password is incorrect");
        res.render('auth/login', {
            errors: errors,
            reName: req.body.Username,
            rePass: req.body.Password,
            layout: false
        });
        return;
    }
} 




module.exports.logout = function(req, res) {
    
    req.session.userName = null
    req.session.role = null
    req.session.save((err) => {
        req.session.regenerate((err2) => {
            res.redirect('/auth/login')
        })
    })
}
