import { SET_POSTS, LIKE_POST, UNLIKE_POST, LOADING_DATA, DELETE_POST } from '../types';

const initialState = {
    posts: [],
    post: {},
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            };
        case LIKE_POST:
        case UNLIKE_POST:
            let index = state.posts.findIndex((post) => post.postId === action.payload.postId);
            state.posts[index] = action.payload;
            return {
                ...state
            };
        case DELETE_POST:
            index = state.posts.findIndex((post) => post.postId === action.payload);
            state.posts.splice(index, 1);
            return {
                ...state
            }
        default:
            return state;
    }
}