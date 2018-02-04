import React from 'react';
import ReactDOM from 'react-dom';
import Landing from "./components/landing";

class App extends React.Component {
    render() {
        return (
            <div>
                <Landing />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));