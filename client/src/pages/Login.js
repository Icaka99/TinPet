import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import AppIcon from '../images/favicon.png';
import axios from 'axios';
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

//MUI stuff
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';

const styles = (theme) => ({
    ...theme.commonStyles
});

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
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
        
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData, this.props.history);
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
                        Login
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
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={loading}>
                            Login
                            {loading && (   
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>
                        <br/>
                        <small>Dont't have an account? Sign up <Link to="/signup">here!</Link></small>
                    </form>
                </Grid>
                <Grid item sm />
            </Grid>
        )
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));