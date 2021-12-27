import { withStyles } from '@material-ui/styles';
import React, { Fragment } from 'react';

import styles from '../utils/NotFound.css';

const NotFound = () => (
    <Fragment>
        <div className="number">404</div>
        <div className="text"><span>Ooops...</span><br />page not found</div>
    </Fragment>
);

export default withStyles(styles)(NotFound);