import React from 'react';
import '../styles/Header.css';

export default function Header({ user }: any) {
  return (
    <div className="header">
      <p className="fs-3">RCDS Calendar</p>
      { user && <button className="btn btn-danger">Sign Out</button>}
    </div>
  );
}
