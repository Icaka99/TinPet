const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllPosts, postOnePost, getPost, commentOnPost, likePost, unlikePost, deletePost } = require('./handlers/posts');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');

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
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.region('europe-west1').https.onRequest(app);