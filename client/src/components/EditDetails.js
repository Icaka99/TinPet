import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/styles';

//Redux
import { connect } from 'react-redux';
import { editUserDetails } from '../redux/actions/userActions';

//MUI stuff
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const styles = (theme) => ({
    ...theme.commonStyles,
    button: {
        float: 'right'
    }
});

class EditDetails extends Component {
    state = {
        bio: '',
        website: '',
        location: '',
        open: false
    }

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : '',
        });
    }

    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDetailsToState(this.props.credentials);
    }

    handleClose = () => {
        this.setState({ open: false});
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        }
        this.props.editUserDetails(userDetails);
        this.handleClose();
    }

    componentDidMount() {
        const { credentials } = this.props;
        this.mapUserDetailsToState(credentials);
    }

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <Tooltip title="Edit details" placement="top">
                    <IconButton onClick={this.handleOpen} className={classes.button}>
                        <EditIcon color="primary" />
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Edit your profile details
                    </DialogTitle>
                    <DialogContent>
                        <form >
                            <TextField name="bio" type="text" label="Bio" onChange={this.handleChange} multiline fullWidth 
                            placeholder="A short bio about yourself" rows="3" className={classes.textField} value={this.state.bio} />

                            <TextField name="website" type="text" label="Website" onChange={this.handleChange} fullWidth 
                            placeholder="A personal/professional website" className={classes.textField} value={this.state.website} />

                            <TextField name="location" type="text" label="Location" onChange={this.handleChange} fullWidth 
                            placeholder="Where you live" className={classes.textField} value={this.state.location} />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
});

export default connect(mapStateToProps, { editUserDetails })(withStyles(styles)(EditDetails));