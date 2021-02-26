import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserValue } from '../contexts/userContext';
import { actionTypes } from '../reducer';
import { auth } from '../services/firebase/firebaseConfig';
import '../styles/Header.css';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';

export default function Header(): JSX.Element {

  let user: firebase.User | null = null;
  let userState = useUserValue().state;
  if (userState.user) {
    user = userState.user;
  }
  let [showMenu, setShowMenu] = useState(false);
  const dispatch = useUserValue().dispatch;
  const history = useHistory()

  function signOut() {
    auth.signOut().then(() => {
      dispatch({type: actionTypes.SET_USER, user: null})
      history.push("/signIn")
    })
  }

  /*
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">RCDS Calendar</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        { user &&
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <button className="btn btn-link" style={{color: 'white', textDecoration: 'none'}} onClick={() => setShowMenu(!showMenu)}>{user.displayName}</button>
            { showMenu && (
              <button className="btn btn-danger btn-small btn-rounded" onClick={signOut}>Sign Out</button>
            )}
          </div>
        }
      </div>
    </nav>
  )
   */

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
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
        </Nav>

        { user &&
          <Dropdown className="ml-auto">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {user.displayName}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <Link to="/settings" style={listLinkStyles}>Settings</Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={signOut} style={{color: 'red'}}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        }

      </Navbar.Collapse>
    </Navbar>
  )
}
