import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/styles';

//Redux
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

//MUI stuff
import { Button, Grid, TextField } from '@material-ui/core';

const styles = theme => ({
    ...theme.commonStyles
})

class CommentForm extends Component {
    state = {
        body: '',
        errors: {}
    }

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

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.postId, { body: this.state.body });
    }

    render() {
        const { classes, authenticated } = this.props;
        const errors = this.state.errors;

        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{ textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField name="body" type="text" label="Comment on post" error={errors.comment ? true : false} fullWidth
                        helperText={errors.comment} value={this.state.body} onChange={this.handleChange} className={classes.textField}>
                    </TextField>
                    <Button type="submit" variant="contained" color="primary" className="classes.button">
                        Submit
                    </Button>
                </form>
                <hr className={classes.visibleSeperator} />
            </Grid>
        ) : null
        return commentFormMarkup;
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    UI: state.UI,
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));