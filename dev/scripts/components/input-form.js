import React from "react";

export default class InputForm extends React.Component {
    render() {
        return (
            <div className="input-form-container">
                <label htmlFor="todo-input">Add your to do items</label>
                <input type="text" name="todo" id="todo-input"/>
                <button>Add Todo</button>
            </div>
        )
    }
}