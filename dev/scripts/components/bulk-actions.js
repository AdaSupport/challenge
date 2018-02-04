import React from "react";

export default class BulkActions extends React.Component {
    render(){
        return (
            <div className="bulk-action-container">
                <div>
                    <button id="complete-all-button" onClick={this.props.completeAll}>Completed All Tasks</button>
                </div>
                <div>
                    <button id="delete-all-button" onClick={this.props.removeAll}>Remove All Tasks</button>
                </div>
            </div>
        )
    }
}