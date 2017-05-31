import React from 'react';
import {List, Map} from 'immutable'
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
        this.completeAll = this.completeAll.bind(this)
        this.removeAll = this.removeAll.bind(this);
        this.undoRemove = this.undoRemove.bind(this);

        this.state={
            todoInput:"",
            mobile: screen.width < 600,
            todos:[],
            removedItems:[],
            cacheMode:false
        }
    }

    componentDidMount(){

        window.addEventListener("resize",()=>{
            this.setState({
                mobile: screen.width <600
            })
        } );

        server.on('load', (todos) => {
            this.setState({
                todos:todos
            })
        });

        server.on('append', (todo) => {
            this.add(todo)
        });

        server.on('remove', (index) => {
            this.remove(index)
        });

        server.on('removeAll', () => {
            this.removeAll()
        });

        server.on('undoRemove', () => {
            this.undoRemove()
        });

        server.on('setCheck', (index) => {
            this.setCheck(index)
        });

        server.on('disconnect', ()=>{
            this.setState({
                cacheMode:true
            })
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
        const newTodosArr = newTodos.toArray()

        this.setState({
            todos: newTodosArr
        }, ()=>{server.emit('setDB', newTodosArr)})

    }


    completeAll(){
        const {todos} = this.state;
        const newTodos = todos.map((t)=>{
            return Map(t).set("checked", true).toJS();
        })

        this.setState({
            todos:newTodos
        }, ()=>{server.emit('setDB', newTodos)})
    }

    remove(index){
        const {todos} = this.state;
        let removedItems = [];
        removedItems.push(todos[index])

        const curTodos =  List(todos);
        const newTodos = curTodos.splice(index, 1);
        const newTodosArr = newTodos.toArray()

        this.setState({
            todos: newTodosArr,
            removedItems:removedItems
        }, ()=>{server.emit('setDB', newTodosArr)})
    }

    undoRemove(){
        const {todos, removedItems} = this.state;

        const curTodos =List(todos);
        const todosToAdd = List(removedItems);

        const newTodos = curTodos.concat(todosToAdd);
        const newTodosArr = newTodos.toArray()


        this.setState({
            todos: newTodosArr,
            removedItems:[]
        }, ()=>{server.emit('setDB', newTodosArr)})
    }

    removeAll(){
        const {todos} = this.state;
        this.setState({
            todos: [],
            removedItems:todos
        }, ()=>{server.emit('setDB', [])})
    }


    setCheck(index){
        const {todos} = this.state;
        let item = todos[index];

        if(!todos[index]){
            return;
        }

        item.checked = !item.checked;

        const curTodos = List(todos);
        const newTodos = curTodos.set(index, item);
        const newTodosArr = newTodos.toArray()

        this.setState({
            todos: newTodosArr
        }, ()=>{server.emit('setDB', newTodosArr)})

    }

    render() {
        const {todoInput, todos, mobile, cacheMode} = this.state;
        const {mInputBox,mBtn} = style;
        const btnClass = `${mobile? mBtn:""}`

        return (
            <div>
                <input id="todo-input" type="text" placeholder="Feed the cat" value={todoInput}
                       className={`${mobile?mInputBox:""}`}
                       onChange={this.handleTodoInputChange} autoFocus />
                <button type="button"
                        className={btnClass}
                        onClick={()=>{
                            cacheMode ? this.add() : server.emit('make', {title : todoInput})}}>
                    Add
                </button>
                <div>
                    <button type="button" className={btnClass} onClick={()=>{
                        cacheMode ? this.removeAll() : server.emit('removeAll')
                    }}>
                        Remove All
                    </button>
                    <button type="button" className={btnClass} onClick={()=>{
                        cacheMode ? this.undoRemove() : server.emit('undoRemove')
                    }} >
                        Undo Remove
                    </button>

                </div>

                <ul id="todo-list" className={style.todos}>
                    {todos.map((t, i)=>{
                        return (
                            <TodoItem key={i} todo={t} index={i}
                                      setCheck={()=>{
                                          cacheMode ? this.setCheck(i) : server.emit('setCheck', i)
                                      }}
                                      remove={()=>{
                                          cacheMode ? this.remove(i) : server.emit('remove', i)
                                      }}
                                      mobile={mobile}
                            />
                        )
                    })}
                </ul>
            </div>
        )
    }
}