import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Post from '../components/Post/Post'
import StaticProfile from '../components/Profile/StaticProfile';
import withParams from '../Hocs/hocs';

//Redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

//MUI stuff
import { Grid } from '@material-ui/core';

class User extends Component {
    state = {
        profile: null
    }

    componentDidMount() {
        //This comes from HOC(withParams)
        const handle = this.props.params.handle;
        
        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then((res) => {
                this.setState({
                    profile: res.data.user
                });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        const { posts, loading } = this.props.data;

        const postsMarkup = loading ? (
            <p>Loading data...</p>
        ) : posts === null ? (
            <p>No posts from this user</p>
        ) : (
            posts.map(post => <Post key={post.postId} post={post} />)
        )

        return (
            <Grid container spacing={6}>
                <Grid item sm={8} xs={12}>
                    {postsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ? (
                        <p>Loading profile...</p>
                    ) : (
                        <StaticProfile profile={this.state.profile} />
                    )}
                </Grid>
            </Grid>
        )
    }
}

User.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getUserData })(withParams(User));