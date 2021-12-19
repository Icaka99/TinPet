const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin');

const { 
    getAllPosts, 
    postOnePost, 
    getPost, 
    commentOnPost, 
    likePost, 
    unlikePost, 
    deletePost 
} = require('./handlers/posts');

const { signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser, 
    getUserDetails, 
    markNotificationsRead 
} = require('./handlers/users');

//Posts routes
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, postOnePost);
app.get('/post/:postId', getPost);
app.post('/post/:postId/comment', FBAuth, commentOnPost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);
app.delete('/post/:postId', FBAuth, deletePost);

//Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions
    .region('europe-west1')
    .firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db
        .doc(`/posts/${snapshot.data().postId}`)
        .get()
        .then((doc) => {
            if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'like',
                    read: false,
                    postId: doc.id
                });
            }
        })
        .catch((err) => {
            console.error(err);
        });
    });

exports.deleteNotificationOnUnlike = functions
    .region('europe-west1')
    .firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db
        .doc(`/notifications/${snapshot.id}`)
        .delete()
        .catch(err => {
            console.error(err);
            //May not need return
            return;
        })
    })

exports.createNotificationOnComment = functions
    .region('europe-west1')
    .firestore
    .document('comments/{id}')
    .onCreate((snapshot) => {
        return db
        .doc(`/posts/${snapshot.data().postId}`)
        .get()
        .then((doc) => {
            if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'comment',
                    read: false,
                    postId: doc.id
                });
            }
        })
        .catch(err => {
            console.error(err);
            //May not need reurn
            return;
        });
    })