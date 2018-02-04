import React from "react";
import InputForm from "./input-form";
import ListContainer from "./list-container";
import BulkActions from "./bulk-actions";

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
            todoQuery: "",
            completed: "false"
        }
        // binding methods begin here
        this.addItem = this.addItem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.updateCompletionStatus = this.updateCompletionStatus.bind(this)
        this.completeAllItems = this.completeAllItems.bind(this)
        this.setCompletionColours = this.setCompletionColours.bind(this)
        this.removeAllItems = this.removeAllItems.bind(this)
    }
    componentWillMount(){
        localStorage.getItem("to do items") && this.setState({
            todo: JSON.parse(localStorage.getItem("to do items"))
        });
    }
    componentDidMount() {
        // this is where caching should occur
            // if cached data does not exist, fetch data
            // else, do nothing
        !localStorage.getItem("to do items") ? this.fetchData() : null;


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
    componentWillUpdate(nextProps, nextState) {
        // update local storage when component rerenders
        localStorage.setItem("to do items", JSON.stringify(nextState.todo));
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

    // method to remove all list items
    removeAllItems(){
       if ( confirm("are you sure you want to delete all tasks?")) {
           const dbRef = firebase.database().ref();
           dbRef.remove();
           document.getElementById("delete-all-button")
               .addEventListener("click", () => alert("all items have been deleted"));
       }
    }
    // this method updates the list item to be complete or incomplete based on radio button selected
    updateCompletionStatus(item, completionStatus){
        const itemKey = item.key
        const dbRef = firebase.database().ref(itemKey)

        // change completed status to value of radio buttons 
        item.completed = completionStatus;
        dbRef.update(item)
    }
    // method to mark items as completed
    completeAllItems(e){
        e.preventDefault();
        const taskArray = this.state.todo;
        for (let tasks of taskArray) {
            this.updateCompletionStatus(tasks, "true");
        }

        const completedButtons = document.querySelectorAll(".complete-radio");
        completedButtons.checked = true;

        // alerts users with screen readers that list item has been added to list
        document.getElementById("complete-all-button")
            .addEventListener("click", () => alert("all items have been marked off as completed"));
    }

    // method to visually apply completion or incompletion of tasks
    setCompletionColours(todo) {
        switch (todo) {
            case "true":
                return "complete";
            case "false":
                return "incomplete";
        }
    }
    render(){
        return (
            <div>
                <a className="skip-link" href="#main-list">Skip to main list</a>
                <InputForm addItem={this.addItem} change={this.onChange} todo={this.state.todo}/>
                <ListContainer 
                    todo={this.state.todo} 
                    removeItem={this.removeItem} 
                    update={this.updateCompletionStatus} 
                    completeAll={this.completeAllItems} 
                    setColours={this.setCompletionColours}/>
                <BulkActions completeAll={this.completeAllItems} removeAll={this.removeAllItems}/>
            </div>
        )
    }
}