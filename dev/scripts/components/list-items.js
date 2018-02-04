import React from "react";

export default class ListItems extends React.Component {
    render(){
        return (
            <li id={this.props.todo.key}>
                {this.props.todo.item}
                <p onClick={()=> this.props.removeItem(this.props.todo.key)}>Click me to remove</p>
            </li>
        )
    }
}