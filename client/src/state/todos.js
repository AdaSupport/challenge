import { State, ActionCreators } from "jumpstate"
import axios from 'axios';

export default State({
  initial: {
    todos: [],
  },
  // Actions
  getTodos(state){
    axios.get("http://localhost:4000/allTodos")
      .then(function(res, rej){
        console.log(res)
      })
      return state
    // return
  }
})
