import {
    SET_POSTS, LOADING_DATA, LIKE_POST, UNLIKE_POST, DELETE_POST, LOADING_UI,
    CREATE_POST, CLEAR_ERRORS, SET_ERRORS, SET_POST, STOP_LOADING_UI, SUBMIT_COMMENT, EDIT_POST
} from '../types';
import axios from 'axios';

//Get all posts
export const getPosts = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get('/posts')
        .then((res) => {
            dispatch({
                type: SET_POSTS,
                payload: res.data
            })
        })
        .catch((err) => {
            dispatch({
                type: SET_POSTS,
                payload: []
            })
        })
};

//Get Post
export const getPost = (postId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.get(`/post/${postId}`)
        .then((res) => {
            dispatch({
                type: SET_POST,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI });
        })
        .catch((err) => {
            console.log(err);
        })
};

//Create a post
export const createPost = (newPost) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/post', newPost)
        .then((res) => {
            dispatch({
                type: CREATE_POST,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        });
};

//Like a post
export const likePost = (postId) => (dispatch) => {
    axios.get(`/post/${postId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_POST,
                payload: res.data
            })
        })
        .catch((err) => {
            console.log(err);
        })
};

//Unlike post
export const unlikePost = (postId) => (dispatch) => {
    axios.get(`/post/${postId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_POST,
                payload: res.data
            })
        })
        .catch((err) => {
            console.log(err);
        })
};

//Submit a comment
export const submitComment = (postId, commentData) => (dispatch) => {
    axios.post(`/post/${postId}/comment`, commentData)
        .then((res) => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};

//Edit post
export const editPost = (postDetails) => (dispatch) => {
    axios.post(`/post/${postDetails.postId}`, postDetails)
        .then((res) => {
            dispatch({
                type: EDIT_POST,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        });
};

//Delete post
export const deletePost = (postId) => (dispatch) => {
    axios.delete(`/post/${postId}`)
        .then(() => {
            dispatch({
                type: DELETE_POST,
                payload: postId
            })
        })
        .catch((err) => {
            console.log(err);
        })
};

//Get user data
export const getUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userHandle}`)
        .then((res) => {
            dispatch({
                type: SET_POSTS,
                payload: res.data.posts
            });
        })
        .catch(() => {
            dispatch({
                type: SET_POSTS,
                payload: null
            });
        });
};

//Clear Errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};