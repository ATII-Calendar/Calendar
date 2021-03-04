import React, { Component } from 'react';

class Counter extends Component { 
  state = {
    name: 'Admin',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1a/Rye_Country_Day_School_logo.jpg'
  };

  render()
  {
    return (
    <div>
      <img src={this.state.imageUrl} alt =""/>
      <span> <h1> Hello {this.state.name}! </h1> </span>
      <button> Change schedule </button>
      // need some reference to a event //

      <div>
        <button> Email faculty </button>
      </div>
      <button> Email student body </button>
    </div>
    );
  }


}

export default adminui;
