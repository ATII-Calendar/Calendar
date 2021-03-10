import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserValue } from '../contexts/userContext';
import { actionTypes } from '../reducer';
import { auth } from '../services/firebase/firebaseConfig';
import '../styles/Header.css';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';

export default function Header({ showSidebar, setShowSidebar }: any): JSX.Element {

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
    })
  }

  let brandStyles: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px'
  }

  let listLinkStyles: React.CSSProperties = {
    textDecoration: 'none'
  }

  return (
    <Navbar variant="dark" bg="dark" expand="lg" className="d-flex">
      <Navbar.Brand><Link to="/" style={brandStyles}>RCDS Calendar</Link></Navbar.Brand>
      { user &&
      <>
          <Nav className="mr-auto">
          </Nav>

            <Dropdown className="ml-auto">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {user.displayName}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/settings" style={listLinkStyles}>Settings</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/help" style={listLinkStyles}>Help</Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={signOut} style={{color: 'red'}}>Sign Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
        { /* </Navbar.Collapse> */ }
      </>
      }
    </Navbar>
  )
}
