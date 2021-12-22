import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import MyButton from "../utils/MyButton";

//MUI stuff
import { Button, Dialog, DialogTitle, DialogActions } from "@material-ui/core";
import DeleteOutline from '@material-ui/icons/DeleteOutline';

//Redux
import { connect } from "react-redux";
import { deletePost } from '../redux/actions/dataActions';

const styles = {
    deleteButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
}

class DeletePost extends Component {
    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    deletePost = () => {
        this.props.deletePost(this.props.postId);
        this.setState({ open: false });
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Delete Post" onClick={this.handleOpen} btnClassName={classes.deletePost}>
                    <DeleteOutline color="secondary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Are you sure you want to delete this post?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deletePost} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeletePost.propTypes = {
    deletePost: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
}

export default connect(null, { deletePost })(withStyles(styles)(DeletePost));