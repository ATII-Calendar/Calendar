import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserValue } from '../contexts/userContext';
import { actionTypes } from '../reducer';
import { auth } from '../services/firebase/firebaseConfig';
import '../styles/Header.css';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Menu, MenuItem } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header({ showSidebar, setShowSidebar }: any): JSX.Element {

  const classes = useStyles();

  let user: firebase.User | null = null;
  let userState = useUserValue().state;
  if (userState.user) {
    user = userState.user;
  }
  let [showMenu, setShowMenu] = useState(false);
  const dispatch = useUserValue().dispatch;
  const history = useHistory()

  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  function signOut() {
    auth.signOut().then(() => {
      dispatch({type: actionTypes.SET_USER, user: null})
      history.push("/signIn")
    }) }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<>
    <AppBar position="static" style={{backgroundColor: '#222e51'}}>
      <Toolbar>
        {(setShowSidebar) &&
        <IconButton onClick={toggleSidebar} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>}
        <Typography variant="h6" className={classes.title}>
          RCDS Calendar
        </Typography>

        { user && <>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{color: "white"}}>
          {user.displayName}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => {
            history.push("/settings");
            handleClose();
          }}>Settings</MenuItem>
          <MenuItem onClick={handleClose}>Help</MenuItem>
          <MenuItem onClick={() => {
            signOut();
            handleClose();
          }} style={{color: 'red'}}>Sign Out</MenuItem>
        </Menu> </> }

      </Toolbar>
    </AppBar>
  </>)
}
