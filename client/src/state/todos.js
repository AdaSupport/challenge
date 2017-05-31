// import { State, ActionCreators, Effect, ActionCreators } from "jumpstate"
// import axios from 'axios';
//
//
// // const fetchTodos = Effect('myEffect', ()=> {
// //   let todosArray
// //   axios.get("http://localhost:4000/allTodos")
// //     .then(function(res, rej){
// //       todosArray = res.data
// //       console.log(res.data)
// //     })
// // })
//
// const Todos = State({
//   initial: {
//     todos: [],
//   },
//   // Actions
//   getTodos(state, payload){
//     return { todos: todosArray }
//   }
// })
//
// // ActionCreators.getTodos(payload)==={
// //   type: 'getTodos',
// //   payload: payload
// // }
//
// export function getTodosAsync() {
//   setTimeout(()=>{
//     fetchTodos()
//     Todos.getTodos()
//   }, 5000)
// }
//
// export default Todos
