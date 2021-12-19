const { admin, db } = require('../util/admin');

const firebase = require('firebase/app')
const firebaseAuth = require('firebase/auth');
const firebaseConfig = require('../util/config');
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseAuth.initializeAuth(firebaseApp);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators')

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

const noImg = 'no-img.png';

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
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
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
            return res.status(400).json({email: 'Email is already in use!'});
        } else {
            return res.status(500).json({genereal: 'Something went wrong, please try again!'});
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
            return res.status(403).json({general: 'Wrong credentials, please try again!'})
        })
}

//Add user details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added successfully!'});
        })
        .catch(err => {
            console.error(err);
            return res.stats(500).json({ error: err.code});
        })
}

//Get any user's details(public)
exports.getUserDetails = (req, res) => {
    let userData = {};
    db
    .doc(`/users/${req.params.handle}`)
    .get()
    .then(doc => {
        if (doc.exists) {
            userData.user = doc.data();
            return db
            .collection('posts')
            .where('userHandle', '==', req.params.handle)
            .orderBy('createdAt', 'desc')
            .get();
        } else {
            return res.status(404).json({ error: 'User not found!'});
        }
    })
    .then(data => {
        userData.posts = [];
        data.forEach(doc => {
            userData.posts.push({
                body: doc.data().body,
                createdAt: doc.data().createdAt,
                userHandle: doc.data().userHandle,
                userImage: doc.data().userImage,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                postId: doc.id
            });
        });
        return res.json(userData);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    });
}

//Get own user details(only for the user)
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};

    db.doc(`/users/${req.user.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db
                    .collection('likes')
                    .where('userHandle', '==', req.user.handle)
                    .get();
            }
        })
        .then((data) => {
            userData.likes = [];
            data.forEach((doc) => {
                userData.likes.push(doc.data());
            });
            return db
                .collection('notifications')
                .where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc')
                .limit(10)
                .get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    createdAt: doc.data().createdAt,
                    sender: doc.data().sender,
                    postId: doc.data().postId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id
                });
            });
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

//Upload user profile picture
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({headers: req.headers});

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted!'});
        }
        const imageExtenstion = filename.split('.')[filename.split('.').length - 1];

        //Give random name to profile picture
        imageFileName = `${Math.round(Math.random() * 10000000000)}.${imageExtenstion}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype }
        file.pipe(fs.createWriteStream(filePath));
    });

    //Upload image to firebase storage
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            //firebase imageUrl
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;

            //update user document to have the image url
            return db.doc(`/users/${req.user.handle}`).update({imageUrl});
        })
        .then(() => {
            return res.json({message: 'Image uploaded successfully!'});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
    });

    busboy.end(req.rawBody);
}

//Mark notifications as read
exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });

    batch
        .commit()
        .then(() => {
            return res.json({ message: 'Notification marked as read!'});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code});
        });
}