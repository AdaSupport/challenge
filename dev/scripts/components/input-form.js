import React from "react";

// Initialize Firebase


export default class InputForm extends React.Component {
    render() {
        return (
            <div className="input-form-container">
                <form action="" onSubmit={this.props.addItem}>
                    <label htmlFor="todo-input">Add your to do items</label>
                    <input 
                    type="text" 
                    name="todoQuery" 
                    id="todo-input"
                    onChange={this.props.onChange}/>
                    <button>Add Todo</button>
                </form>
            </div>
        )
    }
}