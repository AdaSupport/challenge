import React from 'react';
import {List} from 'immutable'
import Todo from '../../todo'

const server = io('http://localhost:3003')


export default class App extends React.Component {
    constructor() {
        super();

        this.add=this.add.bind(this);
        this.handleTodoInputChange = this.handleTodoInputChange.bind(this)

        this.state={
            todoInput:"",
            todos:[]
        }
    }

    componentDidMount(){
        server.on('load', (todos) => {
            this.setState({
                todos:todos
            })
        });
    }

    handleTodoInputChange(e){
        this.setState({todoInput: e.target.value});
    }

    add(){
        const {todoInput, todos} = this.state;

        if(!todoInput){
            return;
        }

        const curTodos =  List(todos);
        const newTodos = curTodos.push(new Todo(todoInput));

        this.setState({
            todos: newTodos.toArray()
        })

    }


    render() {
        const {todoInput, todos} = this.state;
        return (
            <div>
                <input id="todo-input" type="text" placeholder="Feed the cat" value={todoInput} onChange={this.handleTodoInputChange} autoFocus />
                <button type="button" onClick={this.add}>Make</button>
                <ul id="todo-list">
                    {todos.map((t, i)=>{
                        return (<li  ref={`${i}`} >
                                {t.title}
                        </li>)
                    })}
                </ul>
            </div>
        )
    }
}