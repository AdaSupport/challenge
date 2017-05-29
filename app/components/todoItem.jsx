import React from 'react';


export default class TodoItem extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {title, checked, setCheck, index} = this.props.todo;

        return (
            <li>
                <label>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={()=>setCheck(index)} />
                    {title}
                </label>
            </li>
        )
    }
}