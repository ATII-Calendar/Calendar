import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserValue } from '../contexts/userContext';
import { actionTypes } from '../reducer';
import { auth } from '../services/firebase/firebaseConfig';
import '../styles/Header.css';
import firebase from 'firebase';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Menu, MenuItem } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import ViewMenu from './ViewMenu';

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

export default function Header({ showSidebar, setShowSidebar, calRef }: any): JSX.Element {

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const styles = useStyles();

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
        <IconButton onClick={toggleSidebar} edge="start" className={styles.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>}
        <Typography variant="h6" style={{marginRight: "2rem"}}>
          RCDS Calendar
        </Typography>
        { user && calRef && calRef.current &&
        <>
          <Button
            onClick={() => {
              calRef.current.getApi().today();
            }}
            style={{ marginLeft: 0, marginRight: '10px' }}
            variant="outlined"
            color="secondary"
          >Today</Button>
          <Typography variant="h6" className={styles.title}>
            <IconButton onClick={() => calRef.current.getApi().prevYear()} edge="start"  color="inherit" aria-label="menu">
              <NavigateBeforeIcon />
            </IconButton>
            {months[calRef.current.getApi().getDate().getMonth()] + ", " + (1900 + calRef.current.getApi().getDate().getYear())}
            <IconButton onClick={() => calRef.current.getApi().nextYear()} edge="start"  color="inherit" aria-label="menu">
              <NavigateNextIcon />
            </IconButton>
          </Typography>
          <ViewMenu calRef={calRef}/>
        </>
        }

        { user && <>

          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{marginRight: 0, marginLeft: "auto", color: "white"}}>
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
