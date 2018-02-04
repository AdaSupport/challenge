import React from "react";
import InputForm from "./input-form";
import ListContainer from "./list-container";

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

export default class Landing extends React.Component {
    constructor() {
        super();
        this.state = {
            todo: [{}],
            todoQuery: ""
        }
        // binding methods begin here
        this.addItem = this.addItem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.updateCompletionStatus = this.updateCompletionStatus.bind(this)
    }
    componentDidMount() {
        const dbRef = firebase.database().ref();
        dbRef.on("value", (firebaseData) => {
            const todo = [];
            const itemsData = firebaseData.val();
            for (let itemKey in itemsData) {
                itemsData[itemKey].key = itemKey;
                todo.push(itemsData[itemKey])
            }

            this.setState({
                todo
            })
        });
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    // on submit of input form, add to do items to list container
    addItem(e) {
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
    // method to remove item from db
    removeItem(itemToRemove) {
        const dbRef = firebase.database().ref(`${itemToRemove}`);
        dbRef.remove();
    }
    
    // this method updates the list item to be complete or incomplete based on radio button selected
    updateCompletionStatus(item, completionStatus){
        const itemKey = item.key
        const dbRef = firebase.database().ref(itemKey)

        // change completed status to value of radio buttons 
        item.completed = completionStatus;
        dbRef.update(item)
    }
 
    render(){
        return (
            <div>
                <InputForm addItem={this.addItem} change={this.onChange} todo={this.state.todo}/>
                <ListContainer todo={this.state.todo} removeItem={this.removeItem} update={this.updateCompletionStatus}/>
            </div>
        )
    }
}