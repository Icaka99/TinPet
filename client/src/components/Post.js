import React, { Component } from "react";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from "prop-types";
import MyButton from "../utils/MyButton";

//Redux
import { connect } from "react-redux";
import { likePost, unlikePost } from "../redux/actions/dataActions";

//MUI stuff
import { Card, Typography, CardContent, CardMedia } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

//Icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


const styles = {
    card: {
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
    likedPost = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.postId === this.props.post.postId)) {
            return true;
        } else {
            return false;
        }
    }

    likePost = () => {
        this.props.likePost(this.props.post.postId);
    }

    unlikePost = () => {
        this.props.unlikePost(this.props.post.postId);
    }

    render() {
        dayjs.extend(relativeTime);
        const {
            classes,
            post: { body, createdAt, userImage, userHandle, postId, likeCount, commentCount },
            user: { authenticated } } = this.props;
        const likeButton = !authenticated ? (
            <MyButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="primary" />
                </Link>
            </MyButton>
        ) : (
            this.likedPost() ? (
                <MyButton tip="Undo like" onClick={this.unlikePost}>
                    <FavoriteIcon color="primary" />
                </MyButton>
            ) : (
                <MyButton tip="Like" onClick={this.likePost}>
                    <FavoriteBorder color="primary" />
                </MyButton>
            )
        )
        return (
            <Card className={classes.card}>
                <CardMedia
                    image={userImage}
                    title="Profile image"
                    className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandle}`}>{userHandle}</Typography>
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    {likeButton}
                    <span>{likeCount} likes</span>
                    <MyButton tip="Comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount} comments</span>
                </CardContent>
            </Card>
        )
    }
}

Post.propTypes = {
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
});

const mapActionsToProps = {
    likePost,
    unlikePost
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Post));