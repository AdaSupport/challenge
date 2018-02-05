import React from "react";

const InputForm =(props)=> {
    return (
        <div className="input-form-container">
            <form action="" onSubmit={props.addItem}>
                <label htmlFor="todo-input" className="visuallyhidden">Add your to do items</label>
                <input 
                type="text" 
                name="todoQuery" 
                id="todo-input"
                placeholder="add your to do items here"
                aria-label="Add your to do items here"
                tabIndex="0"
                onChange={props.onChange}
                value={props.query}
                />
                <button>Add Todo</button>
            </form>
        </div>
    )
}

export default InputForm;