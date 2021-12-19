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

//Trigger for creating notification when someone likes a post
exports.createNotificationOnLike = functions
    .region('europe-west1')
    .firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db
        .doc(`/posts/${snapshot.data().postId}`)
        .get()
        .then((doc) => {
            //Don't notify when a user likes their own post
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

//Trigger for deleting notification when someone likes and then unlikes post
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

//Trigger for creating notification when someone comments on a post
exports.createNotificationOnComment = functions
    .region('europe-west1')
    .firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db
        .doc(`/posts/${snapshot.data().postId}`)
        .get()
        .then((doc) => {
            //Don't notify when a user comments on their own post
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

//This trigger updates the profile picture of user's comments when he changes his profile picture
exports.onUserImageChange = functions
    .region('europe-west1')
    .firestore.document('/users/{userId}')
    .onUpdate((change) => {
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            const batch = db.batch();
            return db
                .collection('posts')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const post = db.doc(`/posts/${doc.id}`);
                        batch.update(post, { userImage: change.after.data().imageUrl });
                    });
                    return batch.commit();
                });
        } else {
            return true;
        }
    });

//Trigger for deleting comment, likes and notifications when a post is deleted
exports.onPostDelete = functions
    .region('europe-west1')
    .firestore.document('/posts/{postId}')
    .onDelete((snapshot, context) => {
        const postId = context.params.postId;
        const batch = db.batch();
        return db
            .collection('comments')
            .where('postId', '==', postId)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                });
                return db
                .collection('likes')
                .where('postId', '==', postId)
                .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                });
                return db
                .collection('notifications')
                .where('postId', '==', postId)
                .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/notification/${doc.id}`));
                });
                return batch.commit();
            })
            .catch(err => {
                console.error(err);
            })
    })