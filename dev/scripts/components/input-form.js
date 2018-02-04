import React from "react";
import firebase from "./firebase";

export default class InputForm extends React.Component {
    constructor(){
        super();
        this.state={
            todo: {
                item: "",
                completed: "false"
            }
        }
        // binding methods begin here
        this.addItem = this.addItem.bind(this)
    }
    // on submit of input form, add to do items to list container
    addItem(e){
        e.preventDefault();
        const item = document.getElementById("todo-input").value;
        console.log(item)

        this.setState({
            item
        })
    }
    render() {
        return (
            <div className="input-form-container">
                <form action="" onSubmit={this.addItem}>
                    <label htmlFor="todo-input">Add your to do items</label>
                    <input type="text" name="todo" id="todo-input"/>
                    <button>Add Todo</button>
                </form>
            </div>
        )
    }
}