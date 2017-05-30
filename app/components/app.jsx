import React from 'react';
import {List} from 'immutable'
import Todo from '../../todo'

import TodoItem from './todoItem.jsx'

import style from './style/todoApp.css'

const server = io('http://localhost:3003')


export default class App extends React.Component {
    constructor() {
        super();

        this.add=this.add.bind(this);
        this.remove=this.remove.bind(this);
        this.handleTodoInputChange = this.handleTodoInputChange.bind(this);
        this.setCheck = this.setCheck.bind(this)

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

        server.on('append', (todo) => {
            this.add(todo)
        });
    }

    handleTodoInputChange(e){
        this.setState({todoInput: e.target.value});
    }

    add(todo=null){
        const {todoInput, todos} = this.state;

        const todoToAppend = todo || (todoInput ? new Todo(todoInput): null);

        if(!todoToAppend){
            return;
        }

        const curTodos =  List(todos);
        const newTodos = curTodos.push(todoToAppend);

        this.setState({
            todos: newTodos.toArray()
        })

    }

    remove(index){
        const {todos} = this.state;

        const curTodos =  List(todos);
        const newTodos = curTodos.splice(index, 1);

        this.setState({
            todos: newTodos.toArray()
        })
    }


    setCheck(index){
        const {todos} = this.state;
        let item = todos[index];

        if(!todos[index]){
            return;
        }

        item.checked = !item.checked;
        //TODO: check if this is mutable

        const curTodos = List(todos);
        const newTodos = curTodos.set(index, item);

        this.setState({
            todos: newTodos.toArray()
        })

    }


    render() {
        const {todoInput, todos} = this.state;
        return (
            <div>
                <input id="todo-input" type="text" placeholder="Feed the cat" value={todoInput} onChange={this.handleTodoInputChange} autoFocus />
                <button type="button" onClick={()=>this.add()}>Make</button>
                <ul id="todo-list" className={style.todos}>
                    {todos.map((t, i)=>{
                        return (
                            <TodoItem key={i} todo={t} index={i} setCheck={this.setCheck} remove={this.remove} />
                        )
                    })}
                </ul>
            </div>
        )
    }
}