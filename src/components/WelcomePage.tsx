// I used this website https://stackoverflow.com/questions/36683770/how-to-get-the-value-of-an-input-field-using-reactjs
// to figure out how to handle user inputer

import React, { useState } from 'react';
import { INITIAL_EVENTS, createEventId } from './event-utils'
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'

const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

export default class WelcomePage extends React.Component {
  state = {
    class: "",
    classList: [""],
  }

  buttonClick(){
    const cl = [this.state.classList];
    this.setState({
      classList: cl
    })
    console.log(cl);
  }

  classInputted(value: string){
    const cl = [...this.state.classList];
    cl.push(this.state.class);
    this.setState({
      class: value,
      classList: cl
    });
  }

  render() {
    return (
      <div>
        <h1>
          <h1 style = {{fontSize: 75, textAlign: 'center'}}>Welcome!</h1>
        </h1>
        <div>
          <h4>
            <h4 style = {{textAlign: 'center'}}>Enter the class you have during each block. If you have a free, please leave the space blank.</h4>
          </h4>
          <ul>
            {blocks.map((block)=>{
              return (
                <div style={{textAlign: 'center'}}>
                  <span style = {{fontSize: 25, alignSelf: 'center'}}>{block}<a style={{marginRight: '5.0rem'}}></a></span>{" "}
                  <input style={{fontSize: 25}} type="text" placeholder="class name" onChange={item => this.classInputted(item.target.value)}/>
                </div>
              )
            })}
          </ul>
          <button style={{marginLeft: '42%', height: 50, width: 250, textAlign:'center', fontSize: 20, float: 'initial'}} onClick={() => this.buttonClick()}>
              Continue
          </button>
        </div>
      </div>
    )
  }
}
