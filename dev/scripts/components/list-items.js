import React from "react";

export default class ListItems extends React.Component {
    render(){
        return (
            <li id={this.props.todo.key}>
                {this.props.todo.item}
            </li>
        )
    }
}