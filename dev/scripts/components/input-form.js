import React from "react";

export default class InputForm extends React.Component {
    render(){
        return (
            <div className="input-form-container">
                <form action="" onSubmit={this.props.addItem}>
                    <label htmlFor="todo-input" className="visuallyhidden">Add your to do items</label>
                    <input 
                    type="text" 
                    name="todoQuery" 
                    id="todo-input"
                    placeholder="add your items"
                    aria-label="Add your items"
                    tabIndex="0"
                    onChange={this.props.onChange}
                    value={this.props.query}
                    />
                    <button>Add Todo</button>
                </form>
            </div>
        )
    }
}
