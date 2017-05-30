import React from 'react';
import style from './style/listItem.css'


export default class TodoItem extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {setCheck, index, todo, remove} = this.props;
        const {title, checked} = todo;

        return (
            <li>

                    <span onClick={remove} className={style.deleteIcon}>x</span>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={()=>setCheck(index)} />
                    <span>{title}</span>

            </li>
        )
    }
}