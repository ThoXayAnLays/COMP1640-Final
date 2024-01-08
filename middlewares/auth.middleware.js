




module.exports.isAuthenticated = function(req, res, next) {
    let notLogin = !req.session.userName
    if (notLogin) {
        res.redirect('/auth/login')
        return
    } else {
        next()
    }
}

