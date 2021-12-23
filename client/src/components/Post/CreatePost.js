import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/styles';
import MyButton from '../../utils/MyButton';

//Redux
import { connect } from 'react-redux';
import { createPost, clearErrors } from '../../redux/actions/dataActions';

//MUI stuff
import { Button, Dialog, DialogContent, DialogTitle, TextField, CircularProgress } from '@material-ui/core';

//Icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
    ...theme.commonStyles,
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%'
    }
})

class CreatePost extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    };

    //ComponentWillReceiveProps alternative
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.UI.errors) {
            return ({ errors: nextProps.UI.errors });
        } 
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            return ({ errors: {} });
        }
        return null;
    }

    handleOpen = () => {
        this.props.clearErrors();
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false, errors: {}, body: '' });
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.createPost({ body: this.state.body });
    }
    render() {
        const { errors } = this.state;
        const { classes, UI: { loading } } = this.props;

        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Create a post!">
                    <AddIcon />
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogTitle>
                        Create a new Post
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField name="body" type="text" label="Post" rows="3" helperText={errors.body}
                                placeholder="What's on your mind today?" error={errors.body ? true : false}
                                className={classes.textField} onChange={this.handleChange} fullWidth multiline />
                            <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading}>
                                Submit
                                {loading && (
                                    <CircularProgress size={30} className={classes.progressSpinner} />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

CreatePost.propTypes = {
    createPost: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI
})

export default connect(mapStateToProps, { createPost, clearErrors })(withStyles(styles)(CreatePost));