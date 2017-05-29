import React from 'react';


export default class TodoItem extends React.Component {
    constructor() {
        super();
    }


    render() {
        const {title} = this.props.todo;

        return (
            <li>
                <span>{title}</span>
            </li>
        )
    }
}