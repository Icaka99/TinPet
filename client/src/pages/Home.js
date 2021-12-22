import React, { Component } from 'react';
import axios from 'axios';
import { Grid } from '@material-ui/core';

//Components
import Post from '../components/Post';
import Profile from '../components/Profile';

class Home extends Component {
    state = {
        posts: null
    }
    componentDidMount() {
        axios.get('/posts')
            .then(res => {
                this.setState({
                    posts: res.data
                });
            })
            .catch(err => {
                console.log(err);
            })
    }
    render(){
        let recentPostsMarkup = this.state.posts ? (
            this.state.posts.map(post => <Post post={post} key={post.postId} />)
        ) : <p>Loading...</p>
        return (
            <Grid container spacing={6}>
                <Grid item sm={8} cs={12}>
                    {recentPostsMarkup}
                </Grid>
                <Grid item sm={4} cs={12}>
                    <Profile></Profile>
                </Grid>
            </Grid>
        )
    }
}

export default Home;