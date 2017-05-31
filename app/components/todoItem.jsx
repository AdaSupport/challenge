import React from 'react';
import style from './style/listItem.css'


export default class TodoItem extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {setCheck, index, todo, remove, mobile} = this.props;
        const {title, checked} = todo;

        const {deleteIcon, mDeleteIcon, mTitle, mCheckbox} = style;

        return (
            <li>

                    <span onClick={remove} className={`${deleteIcon} ${mobile ? mDeleteIcon:""}`}>x</span>
                    <input
                        className={`${mobile ? mCheckbox:""}`}
                        type="checkbox"
                        checked={checked}
                        onChange={setCheck} />
                    <span className={`${mobile ? mTitle:""}`}>{title}</span>

            </li>
        )
    }
}