import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import AppIcon from '../images/favicon.png';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

//MUI stuff
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';

//Redux
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

const styles = (theme) => ({
    ...theme.commonStyles
});

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            errors: {}
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.UI.errors) {
            return ({ errors: nextProps.UI.errors });
        } else {
            return null;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        };
        this.props.signupUser(newUserData, this.props.navigate);
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm />
                <Grid item sm >
                    <img src={AppIcon} alt="pets" className={classes.image} />
                    <Typography variant="h3" className={classes.pageTitle}>
                        Signup
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            id="email" name="email" type="email" label="Email" fullWidth
                            helperText={errors.email} error={errors.email ? true : false}
                            className={classes.textField} value={this.state.email} onChange={this.handleChange}>
                        </TextField>
                        <TextField
                            id="password" name="password" type="password" label="Password" fullWidth
                            helperText={errors.password} error={errors.password ? true : false}
                            className={classes.textField} value={this.state.password} onChange={this.handleChange}>
                        </TextField>
                        <TextField
                            id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" fullWidth
                            helperText={errors.confirmPassword} error={errors.confirmPassword ? true : false}
                            className={classes.textField} value={this.state.confirmPassword} onChange={this.handleChange}>
                        </TextField>
                        <TextField
                            id="handle" name="handle" type="text" label="Handle" fullWidth
                            helperText={errors.handle} error={errors.handle ? true : false}
                            className={classes.textField} value={this.state.handle} onChange={this.handleChange}>
                        </TextField>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                            Signup
                            {loading && (
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>
                        <br />
                        <small>Already have an account? Log in <Link to="/login">here!</Link></small>
                    </form>
                </Grid>
                <Grid item sm />
            </Grid>
        )
    }
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
}

const mapStateToPros = (state) => ({
    user: state.user,
    UI: state.UI
});

function WithNavigate(props) {
    let navigate = useNavigate();
    return <Signup {...props} navigate={navigate} />
}

export default connect(mapStateToPros, { signupUser })(withStyles(styles)(WithNavigate));