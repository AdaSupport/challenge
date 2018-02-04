import React from "react";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA1ggCs58AvlUPRXh21K8fnOX0Yl8-CElU",
    authDomain: "experiment-1dc52.firebaseapp.com",
    databaseURL: "https://experiment-1dc52.firebaseio.com",
    projectId: "experiment-1dc52",
    storageBucket: "experiment-1dc52.appspot.com",
    messagingSenderId: "1078206351112"
};
firebase.initializeApp(config);

export default class InputForm extends React.Component {
    constructor(){
        super();
        this.state={
            todo: [{}],
            todoQuery: ""
        }
        // binding methods begin here
        this.addItem = this.addItem.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    // on submit of input form, add to do items to list container
    addItem(e){
        e.preventDefault();
        const item = document.getElementById("todo-input").value;
        const todoListing = {
            item,
            completed: "false"
        }
        
        // push items to firebase db
        const dbRef = firebase.database().ref();
        dbRef.push(todoListing);
        
        this.setState({
            todoQuery: ""
        })
    }
    render() {
        return (
            <div className="input-form-container">
                <form action="" onSubmit={this.addItem}>
                    <label htmlFor="todo-input">Add your to do items</label>
                    <input 
                    type="text" 
                    name="todoQuery" 
                    id="todo-input"
                    onChange={this.onChange}/>
                    <button>Add Todo</button>
                </form>
            </div>
        )
    }
}