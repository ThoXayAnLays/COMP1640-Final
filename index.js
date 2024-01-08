const express = require('express');

const firebase = require('firebase/app');
const {getStorage} = require('firebase/storage');

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





const app = express();
const hbs = require("hbs");

var session = require('express-session')
var cookieParser = require('cookie-parser')

app.set('view engine', 'hbs');
// default layout
app.set('view options', { layout: 'layouts/manage' });
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(cookieParser())

app.use(session({
    secret: 'mySecret !@#%#$%$#%^&$%^@#$',
    resave: false,
    saveUninitialized: true,
}))

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('ternary', function (a, b, c) {
    return a ? b : c;
});
hbs.registerHelper('eq', function (a, b) {
    return a === b;
});

const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyparser.urlencoded({ extended: true }))


var staffRoute = require('./routes/staff.route')
var authRoute = require('./routes/auth.route')
var authMiddleware = require('./middlewares/auth.middleware')
var userRote = require('./routes/user.route')
var adminRoute = require('./routes/admin.route')
var managerRoute = require('./routes/manager.route')

app.use('/staff', authMiddleware.isAuthenticated, staffRoute)
app.use('/user', authMiddleware.isAuthenticated, userRote)
app.use('/admin', authMiddleware.isAuthenticated, adminRoute)
app.use('/manager', authMiddleware.isAuthenticated, managerRoute)

app.use('/auth', authRoute)

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.set('io', io);

const socket = require('./socket/socket_io')






app.get('/', authMiddleware.isAuthenticated, function (req, res) {

    if (req.session.role == "admin") {
        res.redirect('admin');
    } else if (req.session.role == "staff") {
        res.redirect('staff');
    } else if (req.session.role == "qa manager") {
        res.redirect('manager');
    }
})
socket.initialize(server);
// io.on('connection', (socket) => {
// });




const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
