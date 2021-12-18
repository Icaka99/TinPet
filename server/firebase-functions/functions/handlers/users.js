const { db } = require('../util/admin');

const firebase = require('firebase/app')
const firebaseAuth = require('firebase/auth');
const firebaseConfig = require('../util/config');
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseAuth.initializeAuth(firebaseApp);

const {validateSignupData, validateLoginData} = require('../util/validators')

//Sign users up
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const {valid, errors} = validateSignupData(newUser);

    if (!valid) {
        return res.status(400).json(errors);
    }

let token, userId;

db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if (doc.exists) {
            //user can NOT be created
            return res.status(400).json({handle: 'this handle is already taken'});
        } else {
            //user can be created
            return firebaseAuth
            .createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
        return res.status(201).json({token});
    })
    .catch(err => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            return res.status(400).json({email: 'Email is already in use'});
        } else {
            return res.status(500).json({error: err.code});
        }
    })
}

//Log user in
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {valid, errors} = validateLoginData(user);

    if (!valid) {
        return res.status(400).json(errors);
    }

    firebaseAuth.signInWithEmailAndPassword(auth, user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({token});
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/wrong-password') {
                return res.status(403).json({general: 'Wrong credentials, please try again!'})
            } else {
                return res.status(500).json({error: err.code});
            }
        })
}