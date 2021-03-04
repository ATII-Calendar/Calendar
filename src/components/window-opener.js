// taken from Ernesto Jara Olveda, original code by him. 
// reference: https://enetoolveda.medium.com/open-a-popup-window-react-db81c8c180e5

import PropTypes from "prop-types";
import React from "react";
// Main Window.
let browser = null;
// child window.
let popup = null;
// interval
let timer = null;

// This function is what the name says.
// it checks whether the popup still open or not
function watcher () {
    // if popup is null then let's clean the intervals.
    if (popup === null) {
        clearInterval(timer);
        timer = null;
    // if popup is not null and it is not closed, then let's set the focus on it... maybe...
    } else if (popup !== null && !popup.closed) {
        popup.focus();
    // if popup is closed, then let's clean errthing.
    } else if (popup !== null && popup.closed) {
        clearInterval(timer);
        browser.focus();
        // the onCloseEventHandler it notifies that the child has been closed.
        browser.onClose("child was closed");
        timer = null;
        popup = null;
    }
}

export class WindowOpener extends React.Component {
    // The properties of the component are the following
    // `url`: URI in which the new window will open in.
    // `name`: name of the popup.
    // `bridge`: this will be the function that we will use to communicate parent and son
    // `opts`: options that the window has. if you want to know all the options goto
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
    constructor (props) {
        super(props);
        // binding
        this.onClickHandler = this.onClickHandler.bind(this);
        // browser is set to current window
        browser = window.self;


        // each time we send a message will use the `onSuccess`
        
        // bridge code for transferring data, need to work on this still


        // browser.onSuccess = (res) => {
        //     props.bridge(null, res);
        // }

        // each time we failed we will use the `onError`
        // browser.onError = (error) => {
        //     props.bridge(error);
        // }

        // Tells when a child window is open
        // browser.onOpen = (message) => {
        //     props.bridge(null, message);
        // }
        // Tells when a child window is close
        // browser.onClose = (message) => {
        //     props.bridge(null, message);
        // }
    }
    // opens a child
    onClickHandler (evt) {
        console.log("onClickHandler", this.props)

        const { url, name, opts } = this.props;
        // if there is  already a child open, let's set focus on it
        if (popup && !popup.closed) {
            popup.focus();

            return ;
        }
        // we open a new window.
        popup = browser.open(url, name, opts);

        if (timer === null) {
            // each two seconds we check if the popup still open or not
            timer = setInterval(watcher, 2000);
        }

        return;

    }

    render () {
        const { children } = this.props;
        return (
            <button type="button" onClick={this.onClickHandler}>
                {children}
            </button>
        );
    }
}

WindowOpener.propTypes = {
    url: PropTypes.string.isRequired,
    bridge: PropTypes.func.isRequired,
    name: PropTypes.string,
    opts: PropTypes.string
}
WindowOpener.defaultProps = {
    name: "Cool popup",
    opts: `dependent=${1}, alwaysOnTop=${1}, alwaysRaised=${1}, alwaysRaised=${1}, width=${300}, height=${300}`
}