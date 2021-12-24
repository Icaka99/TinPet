import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/styles';
import MyButton from '../../utils/MyButton';
import dayjs from 'dayjs';
import LikeButton from './LikeButton';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import CommentForm from './CommentForm';

//Redux
import { connect } from 'react-redux';
import { getPost, clearErrors } from '../../redux/actions/dataActions';

//MUI stuff
import { Dialog, DialogContent, CircularProgress, Grid, Typography } from '@material-ui/core';

//Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat'

const styles = (theme) => ({
    ...theme.commonStyles,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
})

class PostDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    };

    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname;

        const { userHandle, postId } = this.props;
        const newPath = `/users/${userHandle}/post/${postId}`;

        if (oldPath === newPath) {
            oldPath = `/users/${userHandle}`;
        }

        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath  });
        this.props.getPost(this.props.postId);
    };

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({ open: false });
        this.props.clearErrors();
    };

    render() {
        const {
            classes,
            post: {
                postId,
                body,
                createdAt,
                likeCount,
                commentCount,
                userImage,
                userHandle,
                comments
            },
            UI: { loading }
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2} />
            </div>
        ) : (
            <Grid container spacing={4}>
                <Grid item sm={5}>
                    <img src={userImage} alt="Profile" className={classes.profileImage} />
                </Grid>
                <Grid item sm={7}>
                    <Typography component={Link} color="primary" variant="h5" to={`/users/${userHandle}`}>
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeperator} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeperator} />
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    <LikeButton postId={postId} />
                    <span>{likeCount} likes</span>
                    <MyButton tip="Comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount} comments</span>
                </Grid>
                <hr className={classes.visibleSeperator} />
                <CommentForm postId={postId} />
                <Comments comments={comments} />
            </Grid>
        );

        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip={"Expand post"} tipClassName={classes.expandButton}>
                    <UnfoldMoreIcon color="primary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

PostDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getPost: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    post: state.data.post,
    UI: state.UI
});

const mapActionsToProps = {
    getPost,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostDialog));