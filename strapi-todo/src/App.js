import * as api from './api'
import { useEffect, useState, useRef } from 'react'
import './App.css'

function App() {
  const [todo, setTodo] = useState({});
  const [todos, setTodos] = useState([]);
  const inputAreaRef = useRef();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.readTodos()
      console.log(result.data.data)
      setTodos(result.data.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const checkIfClickedOutside = e =>{
      if(!inputAreaRef.current.contains(e.target)) {
        console.log('outside the input area')
        setEdit(false)
        setTodo({
          title: '',
          detail: '',
          date: ''
        })
      }else {
        console.log('inside the input area')
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
  
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [])
  

  const createTodo = async () => {
    // e.preventDefault();
    try {
      const { data } = await api.createTodo({data:todo});
      // console.log('try')
      // return
      setTodos([...todos, data])
    } catch (error) {
      console.log(error)

    }
  }

  const deleteTodo = async (id) => {
    await api.deleteTodo(id);
    const result = await api.readTodos();
    setTodos(result.data)
  }

  const editTodo = (id, title, detail, date) => {
    console.log({id, title, detail, date})
    setTodo({id, title, detail, date})
    setEdit(true)
  }

  const updateTodo = async()=>{
    let id = todo.id
    delete todo.id
    await api.updateTodo(id, todo)
    const result = await api.readTodos()
    console.log(result)
    setTodos(result.data.data)
  }


  return (
    <div className="container todobox"  >
      <form ref={inputAreaRef} >
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control"
            value={todo.title}
            onChange={e => setTodo({ ...todo, title: e.target.value })}
          />

        </div>
        <div className="mb-3">
          <label className="form-label">Detail</label>
          <input type="text" className="form-control"
            value={todo.detail}
            onChange={e => setTodo({ ...todo, detail: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input type="date" className="form-control"
            value={todo.date}
            onChange={e => setTodo({ ...todo, date: e.target.value })}
          />
        </div>

        { edit? <button className="btn btn-primary" onClick={updateTodo}>Update</button>:
        <button type="submit" className="btn btn-primary" onClick={createTodo}>Submit</button>}
      </form>

      <div className="list-group mt-4">
        {/* <pre>{JSON.stringify(todo, null, "\t")}</pre> */}
        {todos.map(todo => (
          <a key={todo.id} href="#"
           onClick={() =>editTodo(todo.id, todo.attributes.title, todo.attributes.detail, todo.attributes.date)}
           className="list-group-item list-group-item-action flex-column align-items-start" >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{todo.attributes.title}</h5>
              <small>{todo.attributes.date}</small>
            </div>
            <p className="mb-1">{todo.attributes.detail}</p>
            <small onClick={() => deleteTodo (todo.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
            </svg></small>
          </a>
        ))}


      </div>
    </div>
  );
}

export default App;
