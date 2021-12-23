import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { PropTypes } from 'prop-types';

//Components
import Post from '../components/Post/Post';
import Profile from '../components/Profile/Profile';

//Redux
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';

class Home extends Component {
    componentDidMount() {
        this.props.getPosts();
    }
    render() {
        const { posts, loading } = this.props.data;
        let recentPostsMarkup = !loading ? (
            posts.map(post => <Post post={post} key={post.postId} />
            )
        ) : (<p>Loading...</p>);
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

Home.propTypes = {
    getPosts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(mapStateToProps, { getPosts })(Home);