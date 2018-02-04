import React from "react";

export default class BulkActions extends React.Component {
    render(){
        return (
            <div className="builk-action-container">
                <div className="complete all-button">
                    <button onClick={this.props.completeAll}>Completed All Tasks</button>
                </div>
                <div className="delete all-button">
                    <button onClick={this.props.removeAll}>Remove All Tasks</button>
                </div>
            </div>
        )
    }
}