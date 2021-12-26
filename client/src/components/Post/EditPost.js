import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import { PropTypes } from "prop-types";
import MyButton from "../../utils/MyButton";

//MUI stuff
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField, CircularProgress } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';

//Redux
import { connect } from "react-redux";
import { editPost, clearErrors } from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.commonStyles,
    editButton: {
        position: 'absolute',
        left: '82%',
        top: '9%'
    }
})

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            body: '',
            open: false,
            errors: {}
        }
    }

    handleOpen = () => {
        this.setState({
            open: true,
            body: this.props.post.body ? this.props.post.body : '',
        });
    }

    handleClose = () => {
        this.setState({ open: false });
        this.props.clearErrors();
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const postDetails = this.props.post
        postDetails.body = this.state.body;
        this.props.editPost(postDetails);
        this.handleClose();
    }

    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Fragment>
                <MyButton tip="Edit Post" onClick={this.handleOpen} btnClassName={classes.editButton}>
                    <EditIcon color="primary" />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Edit your post details
                    </DialogTitle>
                    <DialogContent>
                        <form >
                            <TextField id="body" name="body" type="text" label="Body" onChange={this.handleChange} multiline fullWidth
                                placeholder="Edited body" rows="3" className={classes.textField} value={this.state.body}
                                error={errors.body ? true : false} helperText={errors.body} />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary" disabled={loading}>
                            Save
                            {loading && (
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditPost.propTypes = {
    editPost: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToPros = (state) => ({
    UI: state.UI
});

const mapActionsToProps = {
    editPost,
    clearErrors
};

export default connect(mapStateToPros, mapActionsToProps)(withStyles(styles)(EditPost));