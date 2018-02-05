import React from "react";
import InputForm from "./input-form";
import ListContainer from "./list-container";
import BulkActions from "./bulk-actions";
import Header from "./header";
import Lengend from "./legend";
import firebase from "./firebase";

// Global variable to reference firebase database
const dbRef = firebase.database().ref();

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
        this.updateCompletionStatus = this.updateCompletionStatus.bind(this);
        this.completeAllItems = this.completeAllItems.bind(this);
        this.setCompletionColours = this.setCompletionColours.bind(this);
        this.removeAllItems = this.removeAllItems.bind(this);
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

    // set information to localStorage for caching
    componentWillUpdate(nextProps, nextState) {
        // update local storage when component rerenders
        localStorage.setItem("to do items", JSON.stringify(nextState.todo));
    }

    // method to keep track of state change on input
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // method to add to do items to list container
    addItem(e) {
        e.preventDefault();
        const item = document.getElementById("todo-input").value;
        const completed = this.state.completed;
        const todoListing = {
            item,
            completed
        }
        
        // push items to firebase db
        dbRef.push(todoListing);
        this.setState({
            todoQuery: ""
        })
    }

    // method to remove item from db
    removeItem(itemToRemove) {
        const dbRefRemove = firebase.database().ref(`${itemToRemove}`);
        dbRefRemove.remove();
    }

    // method to remove all list items
    removeAllItems(){
       if (confirm("are you sure you want to delete all tasks?")) {
           dbRef.remove();
           alert("all items have been deleted");
       }
    }

    // this method updates the list item to be complete or incomplete based on radio button selected
    updateCompletionStatus(item, completionStatus){
        const itemKey = item.key
        const dbRefUpdate = firebase.database().ref(itemKey)

        // change completed status to value of radio buttons 
        item.completed = completionStatus;
        dbRefUpdate.update(item)
    }

    // method to mark items as completed
    completeAllItems(e){
        e.preventDefault();
        const taskArray = this.state.todo;
        for (let tasks of taskArray) {
            this.updateCompletionStatus(tasks, "true");
        }

        // alerts users with screen readers that list item has been added to list
        alert("all items have been marked off as completed");
    }

    // method to visually apply completion or incompletion of tasks
        // based on completion status
    setCompletionColours(completionStatus) {
        switch (completionStatus) {
            case "true":
                return "complete";
            case "false":
                return "incomplete";
        }
    }

    render(){
        return (
            <div className="landing">
                <a className="skip-link" href="#main-list">Skip to main list</a>

                <Header />
                <InputForm 
                    addItem={this.addItem} 
                    onChange={this.onChange} 
                    todo={this.state.todo} 
                    query={this.state.todoQuery}/>
                <Lengend />
                
                <ListContainer 
                    todo={this.state.todo} 
                    removeItem={this.removeItem} 
                    update={this.updateCompletionStatus} 
                    completeAll={this.completeAllItems} 
                    setColours={this.setCompletionColours}/>

                <BulkActions 
                    completeAll={this.completeAllItems} 
                    removeAll={this.removeAllItems}/>
            </div>
        )
    }
}
