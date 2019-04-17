import React from 'react'
import '../Styles/Todos.css'
import { Button, Card, Form } from 'react-bootstrap'
import { isPropertyAccessOrQualifiedName } from 'typescript';
import { Redirect } from 'react-router-dom'

const hostAddress = "http://localhost:4000/"

class TodoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      desc: props.desc,
      assignTo: props.assignTo,
      todoId: props.todoId,
    };
  };

  render() {
    return (
      <div className="formContainer">
          <Form>
              <Form.Group controlId="formBasicEmail">
                  <Form.Control type="email" value={this.state.desc} onChange={this.fillNewTodo.bind(this)}/>
                  <Form.Control type="email" value={this.state.assignTo} onChange={this.fillNewAssign.bind(this)}/>
                  <Button variant="primary" type="submit" onClick={(e) => this.updateTodo(e)}>Update</Button>
                  <Button variant="primary" type="submit" onClick={(e) => this.doneTodo(e)}>Done</Button>
              </Form.Group>
          </Form>
      </div>
    )
  }

  fillNewTodo(event) {
    this.setState({
        desc: event.target.value
    })
  }

  fillNewAssign(event) {
    this.setState({
      assignTo: event.target.value
    })
  }

  updateTodo(e){
    e.preventDefault();
    const renameTodoAddress = hostAddress + "db/user/userId/Todolist/TodolistId/Todos/update"
    var postBody = JSON.stringify({
        updatedDesc: this.state.desc,
        updatedAssignment: this.state.assignTo,
        todoId: this.state.todoId,
    })

    fetch(renameTodoAddress, {
        mode: 'cors',
        method: 'POST',
        body: postBody,
        headers: {"Content-Type": "application/json"},
    })
    .then(response => console.log(response))
    .catch(error => console.log(error))
    .then(setTimeout(() => this.props.action(), 500))
  }

  doneTodo(e) {
    e.preventDefault();
    const deleteAddress = hostAddress + "db/user/userId/Todolist/TodolistId/Todos/delete/";
    var postBody = JSON.stringify({
        todoId: this.state.todoId,
    })

    fetch(deleteAddress, {
        mode: 'cors',
        method: 'POST',
        body: postBody,
        headers: {"Content-Type": "application/json"},
    })
    .then(response => console.log(response)).catch(error => console.log(error))
    .then(setTimeout(() => this.props.action(), 500))
  }
}

//Parent element
class Todos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userTodos: [],
            newTodoDescription: "",
            assignTo: "",
            userId: props.location.state.userId,
            todoListId: props.location.state.todoListId,
            todoListName: props.location.state.todoListName,
            goback:false
        };
    };

    renderRedirect = () => {
      if (this.state.goback) {
          return <Redirect to={{
            pathname: '/Todolists',
            state: {username: this.state.userId}
          }} />
      }
    }

    backClick(event) {
      event.preventDefault();
      this.setState({goback: true})
    }

    render() {        
        // Get list of todolists
        var todoCards = []
        for (var i = 0; i < this.state.userTodos.length; i++) {
            var todoDescription = this.state.userTodos[i].description
            var assignTo = this.state.userTodos[i].user_id
            var todoId = this.state.userTodos[i].todo_id
            var newTodoCard = (<TodoCard key={todoId} todoId={todoId} desc={todoDescription} assignTo={assignTo} action={this.fetchTodo.bind(this) }/>)
            todoCards.push(newTodoCard)
        }

        return (
            
            <div className="todoMainContainer">
                {this.renderRedirect()}
                <Button variant="outline-danger" onClick={(e) => this.backClick(e)}>Back</Button>
                <div className="todoTitleContainer">Current TodoList: {this.state.todoListName}</div>
                <div className="createTDContainer">
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Create new Todo</Form.Label>
                            <Form.Control type="email" placeholder="Enter todo" value={this.state.value} onChange={this.fillNewTodoDescription.bind(this)}/>
                            <Form.Control type="email" placeholder="Assign to" value={this.state.value} onChange={this.fillAssignTo.bind(this)}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={(e) => this.createTodo(e)}>
                            Create
                        </Button>
                    </Form>
                </div>
                <div className="todoCardsContainer">
                    {todoCards}
                </div>
            </div>
        )
    }

    // componentDidMount() {
    //     this.fetchTodo()
    // }

    //Functions
    fillNewTodoDescription(event) {
        this.setState({
            newTodoDescription: event.target.value
        })
    }

    fillAssignTo(event) {
        this.setState({
            assignTo: event.target.value
        })
    }

    createTodo(e){
        e.preventDefault();
        var assignTo = ""
        if (this.state.assignTo == ""){
          assignTo = this.state.userId
        } else {
          assignTo = this.state.assignTo
        }
        const createTodoAddress = hostAddress + "db/user/" + assignTo + "/Todolist/" + this.state.todoListId + "/Todos";
        var postBody = JSON.stringify({
            desc: this.state.newTodoDescription
        })
        fetch(createTodoAddress, {
            mode: 'cors',
            method: 'POST',
            body: postBody,
            headers: {"Content-Type": "application/json"},
        })
        .then(response => console.log(response))
        .catch(error => console.log(error))
        .then(setTimeout(() => this.fetchTodo(), 500))
    }


    componentDidMount() {
      this.fetchTodo()
    }

    fetchTodo(){
        const getTodoAddress = hostAddress + "db/user/" + this.state.userId + "/Todolist/" + this.state.todoListId + "/Todos" 
        fetch(getTodoAddress, {mode: 'cors'})
        .then(response => response.json())
        .then(data => this.setState({userTodos: data.data}))
    }
}
export default Todos