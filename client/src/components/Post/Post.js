import React, { Component } from "react";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from "prop-types";
import MyButton from "../../utils/MyButton";
import DeletePost from "./DeletePost";
import PostDialog from './PostDialog';
import LikeButton from "./LikeButton";

//Redux
import { connect } from "react-redux";

//MUI stuff
import { Card, Typography, CardContent, CardMedia } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

//Icons
import ChatIcon from '@material-ui/icons/Chat';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}

class Post extends Component {
    render() {
        dayjs.extend(relativeTime);
        const {
            classes,
            post: { body, createdAt, userImage, userHandle, postId, likeCount, commentCount },
            user: { authenticated, credentials: { handle } } } = this.props;

        const deleteButton = authenticated && userHandle === handle ? (
            <DeletePost postId={postId} />
        ) : null

        return (
            <Card className={classes.card}>
                <CardMedia
                    image={userImage}
                    title="Profile image"
                    className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandle}`}>{userHandle}</Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton postId={postId} />
                    <span>{likeCount} likes</span>
                    <MyButton tip="Comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount} comments</span>
                    <PostDialog postId={postId} userHandle={userHandle} openDialog={this.props.openDialog} />
                </CardContent>
            </Card>
        )
    }
}

Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));