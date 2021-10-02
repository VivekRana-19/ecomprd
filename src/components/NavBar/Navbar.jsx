import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link,useLocation } from 'react-router-dom';

import logo from '../../assets/logo.png'
import useStyles from './styles';

const Navbar = ({ totalItems }) => {
    const classes = useStyles();
    const location = useLocation();

    
    return (
        <AppBar position="fixed" className={classes.appBar} color="inherit">
            <Toolbar>
                <Typography component={Link} to="/" varriant="h5" className={classes.title} color="inherit">
                    <img src={logo} alt="Seezan Retailer" height="25px" className={classes.Name} />
                    Seezan Retailer
                </Typography>
                <div className={classes.grow}/>
                {location.pathname === '/' && (
                <div className={classes.button}>
                    <IconButton component={Link} to="/cart" aria-label="Show cart item" color="inherit">
                        <Badge color="secondary" badgeContent={totalItems}>
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                </div>)}
            </Toolbar>
        </AppBar>  
    )
}

export default Navbar
