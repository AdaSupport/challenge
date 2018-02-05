import React from "react";

const BulkActions =(props)=> {
        return (
            <div className="bulk-action-container">
                <div>
                    <button id="complete-all-button" onClick={props.completeAll}>Completed All Tasks</button>
                </div>
                <div>
                    <button id="delete-all-button" onClick={props.removeAll}>Remove All Tasks</button>
                </div>
            </div>
        )
}

export default BulkActions;