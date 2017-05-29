import React from 'react';


export default class TodoItem extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {setCheck, index, todo} = this.props;
        const {title, checked} = todo;

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