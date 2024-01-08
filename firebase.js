const admin = require('firebase-admin');

const firebaseConfig = {
    apiKey: "AIzaSyCt2puKjz5SaVit51drY7QAzvvbOZdWxUM",
    authDomain: "comp1640-e4877.firebaseapp.com",
    projectId: "comp1640-e4877",
    storageBucket: "comp1640-e4877.appspot.com",
    messagingSenderId: "850610504942",
    appId: "1:850610504942:web:894e2a6f70a60ec03bdfff",
    measurementId: "G-RG206H64C0"
};
// Initialize Firebase
admin.initializeApp(firebaseConfig);
const bucket = admin.storage().bucket();

const upload = multer({
    storage: multer.memoryStorage()
})


module.exports = {
    bucket
}