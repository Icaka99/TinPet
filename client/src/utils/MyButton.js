import React from 'react';

import { IconButton, Tooltip } from '@material-ui/core';

const myButton = ({ children, onClick, tip, btnClassName, tipClassName }) => {
    return (
        <Tooltip title={tip} className={tipClassName}>
            <IconButton onClick={onClick} className={btnClassName}>
                {children}
            </IconButton>
        </Tooltip>
    )

}

export default myButton;