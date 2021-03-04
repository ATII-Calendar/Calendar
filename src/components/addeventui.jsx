import React from "react";

export class addeventui extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            name: 'Adding Events',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1a/Rye_Country_Day_School_logo.jpg',
            eventName: '',
            eventDate: '',
            startTime: '',
            endTime: ''
        }
        this.onChangeHandler1 = this.onChangeHandler1.bind(this);
        this.onChangeHandler2 = this.onChangeHandler2.bind(this);
        this.onChangeHandler3 = this.onChangeHandler3.bind(this);
        this.onChangeHandler4 = this.onChangeHandler4.bind(this);
    }

    componentDidMount () {
        if (!window.opener) {
            window.close();
        }
    }

    onChangeHandler1 (evt) {
        const {value} = evt.currentTarget;
        this.setState({eventName: value});
        window.opener.onSuccess(value)
    }

    onChangeHandler2 (evt) {
        const {value} = evt.currentTarget;
        this.setState({eventDate: value});
        window.opener.onSuccess(value)
    }

    onChangeHandler3 (evt) {
        const {value} = evt.currentTarget;
        this.setState({startTime: value});
        window.opener.onSuccess(value)
    }

    onChangeHandler4 (evt) {
        const {value} = evt.currentTarget;
        this.setState({endTime: value});
        window.opener.onSuccess(value)
    }

    render () {
        const {eventName, eventDate, startTime, endTime} = this.state;
           return (
    <div>
      <img src={this.state.imageUrl} alt =""/>
      <span> <h1> {this.state.name} </h1> </span>
      Enter Event Name: 
      <input
            type="text"
            value={eventName} 
            onChange={this.handleChange1}
         />
      <div>
        Enter Event Date: 
        <input
            type="text"
            value={eventDate}
            onChange={this.handleChange2}
         />
      </div>
      Enter Event Starting Time: 
      <input
            type="text"
            value={startTime}
            onChange={this.handleChange3}
         />
         <div>
      Enter Event Ending Time: 
      <input
            type="text"
            value={endTime}
            onChange={this.handleChange4}
         />
         </div>     
    </div>
    );
    }
}

export default addeventui;
