import React from "react";

export default class ListItems extends React.Component {
    render(){
        const key = this.props.todo.key;
        const item = this.props.todo.item;
        const incomplete = "false";
        const complete = "true";
        return (
            <li className={this.props.setColours(this.props.todo.completed)}>
                <p onClick={()=> this.props.removeItem(key)}>Click me to remove</p>
                <label htmlFor={key}>{item}</label>
                <input type="radio" id={key} value="true" className="completed-radio" name={key} onClick={() => this.props.update(this.props.todo, complete)}/>
                <input type="radio" id={key} value="false" className="incompleted-radio" name={key} onClick={() => this.props.update(this.props.todo, incomplete)}/>
            </li>
        )
    }
}