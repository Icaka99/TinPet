const {db} = require('../util/admin')

//Fetch all posts
exports.getAllPosts = (req, res) => {
    db
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let posts = [];
        data.forEach(doc => {
            posts.push({
                postId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                likeCount: doc.data().likeCount,
                userImage: doc.data().userImage
            });
        });
        return res.json(posts);
    })
    .catch(err => console.error(err));
};

//Post one post
exports.postOnePost = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
      }

    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db
        .collection('posts')
        .add(newPost)
        .then(doc => {
            const resPost = newPost;
            resPost.postId = doc.id;
            res.json(resPost);
        })
        .catch(err => {
            res.status(500).json({error: 'Something went wrong!'});
            console.error(err);
        });
};

//Fetch one post
exports.getPost = (req, res) => {
    let postData = {};

    db.doc(`/posts/${req.params.postId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found!'});
            }
            postData = doc.data();
            postData.postId = doc.id;
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('postId', '==', req.params.postId)
                .get();
        })
        .then((data) => {
            postData.comments = [];
            data.forEach((doc) => {
                postData.comments.push(doc.data());
            });
            return res.json(postData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

//Comment on one Post
exports.commentOnPost = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ comment: 'Must not be empty!'});
    }

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postId: req.params.postId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/posts/${req.params.postId}`)
        .get()
        .then(doc => {
            if (!doc.exists) {
                return res.stats(404).json({ error: 'Post not found!'});
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1});
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            return res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            //May not need return
            return res.status(500).json({ error: 'Something went wrong!' });
        })
}

//Like a post
exports.likePost = (req, res) => {
    //Get Like document
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('postId', '==', req.params.postId)
        .limit(1);
    
    //Get Post document
    const postDocument = db.doc(`/posts/${req.params.postId}`);

    let postData;

    postDocument.get()
        .then((doc) => {
            //Post exists
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get();
            } else {
                //Post DOESN'T exists
                return res.status(404).json({ error: 'Post not found!'});
            }
        })
        .then(data => {
            if (data.empty) {
                //Add new Like
                return db.collection('likes').add({
                    postId: req.params.postId,
                    userHandle: req.user.handle
                })
                .then(() => {
                    //Increment post likes
                    postData.likeCount++;
                    return postDocument.update({ likeCount: postData.likeCount });
                })
                .then(() => {
                    return res.json(postData);
                })
            } else {
                return res.status(400).json({ error: 'Post already liked!'});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

//Unlike a post
exports.unlikePost = (req, res) => {
    //Get the like
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('postId', '==', req.params.postId)
        .limit(1);
    
    //Get the post
    const postDocument = db.doc(`/posts/${req.params.postId}`);

    let postData;

    postDocument.get()
        .then((doc) => {
            //Post exists
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get();
            } else {
                //Post DOESN'T exists
                return res.status(404).json({ error: 'Post not found!'});
            }
        })
        .then(data => {
            if (data.empty) {
                //Post is not liked in first place
                return res.status(400).json({ error: 'Post not liked!'});
            } else {
                //Unlike post
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        postData.likeCount--;
                        return postDocument.update({ likeCount: postData.likeCount })
                    })
                    .then(() => {
                        res.json(postData)
                    })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}

//Delete post
exports.deletePost = (req, res) => {
    const document = db.doc(`/posts/${req.params.postId}`);
    document.get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found!'});
            }           
            if (doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({ error: 'Unauthorized'});
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Post deleted successfully!'});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}