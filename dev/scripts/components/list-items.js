import React from "react";

export default class ListItems extends React.Component {
    render(){
        const key = this.props.todo.key;
        const item = this.props.todo.item;
        const incomplete = "false";
        const complete = "true";
        return (
            <li className={this.props.setColours(this.props.todo.completed)} tabIndex="0">
                <p>{item}</p>
                <div className="icon-container">
                {/* click to complete */}
                    <label htmlFor={`${key}: complete`} tabIndex="0"><i className="fas fa-check"><span className="sr-only">completed</span></i></label>
                    <input 
                        type="radio" 
                        id={`${key}: complete`}
                        value="true" 
                        className="radio" 
                        name={key} 
                        aria-label="select for complete"
                        onClick={() => this.props.update(this.props.todo, complete)}/>
               
                {/* click to mark incomplete */}
                    <label htmlFor={`${key}: incomplete`} tabIndex="0"><i className="fas fa-hourglass-start" ><span className="sr-only">incomplete</span></i></label>
                    <input 
                        type="radio" 
                        id={`${key}: incomplete`}
                        value="false" 
                        className="radio" 
                        name={key} 
                        aria-label="select for incomplete"
                        onClick={() => this.props.update(this.props.todo, incomplete)}/>
                
                {/* click to delete */}
                    <label htmlFor={`${key}: delete`} tabIndex="0"><i className="far fa-trash-alt"><span className="sr-only">delete</span></i></label>
                    <input
                        type="radio"
                        id={`${key}: delete`}
                        value="delete"
                        className="radio"
                        name={key}
                        aria-label="select to delete"
                        onClick={() => this.props.removeItem(key)} />
                </div>
            </li>
        )
    }
}