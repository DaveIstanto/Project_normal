import React from 'react'
import '../Styles/Todos.css'
import { Button, Card, Form } from 'react-bootstrap'
import { isPropertyAccessOrQualifiedName } from 'typescript';
import { Redirect } from 'react-router-dom'
import $ from 'jquery';


const hostAddress = "http://localhost:4000/"

class TodoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      desc: props.desc,
      assignTo: props.assignTo,
      todoId: props.todoId,
      timeSensitive: props.timeSensitive,
      somewhatUrgent: props.somewhatUrgent
    };
  };

  

  render() {
    var todoClass = 'formContainer';
    if (this.state.timeSensitive == 1) {
      todoClass += ' isTimeSensitive';
    } else {
      if (this.state.somewhatUrgent == 1) {
        todoClass += ' someWhatUrgent'
      }
    }
    return (
      <div className={todoClass}>
          <Button className="doneButton" variant="outline-danger" type="submit" onClick={(e) => this.doneTodo(e)}></Button>
          <Form className="innerForm">
            <div>
              <Form.Control className="changeAble" type="email" value={this.state.desc} onChange={this.fillNewTodo.bind(this)}/>
              <div className="assignedTo">
                <p>Assigned to: </p>
                <Form.Control className="changeable" type="email" value={this.state.assignTo} onChange={this.fillNewAssign.bind(this)}/>
              </div>
            </div>
            <Button className="updateButton" variant="outline-primary" type="submit" onClick={(e) => this.updateTodo(e)}>Update</Button>
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
    alert("todo has been updated");
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
    .then(() => {
      setTimeout(() => this.props.action(), 500);
    })
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
            selectedOption: "1",
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
        var myTodoCards = []
        var othersTodoCards = []

        var importantAssignToMe = []
        var somewhatUrgentAssignToMe = []
        var notImportantAssignToMe = []

        var importantNotAssignToMe = []
        var somewhatUrgentNotAssignToMe = []
        var notImportantNotAssignToMe = []
        
        for (var i = 0; i < this.state.userTodos.length; i++) {
            var todoDescription = this.state.userTodos[i].description
            var assignTo = this.state.userTodos[i].user_id
            var todoId = this.state.userTodos[i].todo_id
            var timeSensitive = this.state.userTodos[i].time_sensitive
            var somewhatUrgent = this.state.userTodos[i].somewhat_urgent
            var newTodoCard = (<TodoCard key={todoId} todoId={todoId} desc={todoDescription} somewhatUrgent={somewhatUrgent} timeSensitive={timeSensitive} assignTo={assignTo} action={this.fetchTodo.bind(this) }/>)

            if (timeSensitive) {
              if(assignTo === this.state.userId){
                importantAssignToMe.push(newTodoCard)
              } else {
                importantNotAssignToMe.push(newTodoCard)
              }
            } else if (somewhatUrgent) {
              if(assignTo === this.state.userId){
                somewhatUrgentAssignToMe.push(newTodoCard)
              } else {
                somewhatUrgentNotAssignToMe.push(newTodoCard)
              }
            } else {
              if(assignTo === this.state.userId){
                notImportantAssignToMe.push(newTodoCard)
              } else {
                notImportantNotAssignToMe.push(newTodoCard)
              }
            }

        }
        myTodoCards = myTodoCards.concat(importantAssignToMe, somewhatUrgentAssignToMe, notImportantAssignToMe)
        othersTodoCards = othersTodoCards.concat(importantNotAssignToMe, somewhatUrgentNotAssignToMe, notImportantNotAssignToMe)

        return (
            
            <div className="todoMainContainer">
                {this.renderRedirect()}
                <Button variant="outline-danger" onClick={(e) => this.backClick(e)}>Go Back</Button>

                {/* <Button variant="outline-danger" onClick={(e) => this.testWordnet(e)}>Test wordnet</Button> */}
                <h3 className="todoTitle">Current todo list: {this.state.todoListName}</h3>
                <h6 className="currentUserInfo">Currently logged in as: {this.state.userId}</h6>

                <div className="content">
                  <div className="createTDContainer">
                      <Form className="createForm">
                          <Form.Group>
                              <Form.Label>Create new Todo</Form.Label>
                              <Form.Control type="email" placeholder="Enter todo" value={this.state.value} onChange={this.fillNewTodoDescription.bind(this)}/>
                              <Form.Control type="email" placeholder="Assign to" value={this.state.value} onChange={this.fillAssignTo.bind(this)}/>
                              <Form.Label className="timeSensitiveTitle">Time sensitive: </Form.Label>
                              <div>
                                <label className="radioItem">
                                  <input type="radio" value="1" checked={this.state.selectedOption === "1"} onChange={this.handleOptionChange.bind(this)} />
                                  No
                                </label>
                                <label className="radioItem">
                                  <input type="radio" value="2" checked={this.state.selectedOption === "2"} onChange={this.handleOptionChange.bind(this)} />
                                  Yes
                                </label>
                              </div>
                              
                          </Form.Group>
                          <Button variant="primary" type="submit" onClick={(e) => this.createTodo(e)}>
                              Create
                          </Button>
                      </Form>
                  </div>
                 
                  <div className="todoCards">
                    <p className="todo">Todos:</p>
                    <div className="myTodos">
                      {myTodoCards}
                    </div>
                    <div>
                      {othersTodoCards}
                    </div>
                  </div>
                </div>
            </div>
        )
    }

    // Testing wordnet
    testWordnet(e) {
      this.prakruthi("now")
    }


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

    handleOptionChange(changeEvent) {
      this.setState({
        selectedOption: changeEvent.target.value
      });
    }

    prakruthi(string) {
      var sensitive = $.ajax({            
        type: "POST",
        url: "http://127.0.0.1:5001/getTimeSensitivityServer",
        data: { taskName: string },
        success: this.getPythonResponse,
        async: false
      })
    
      var returnBoolean = -1

      if (sensitive.responseText === "1") {
        returnBoolean = true
      } else if (sensitive.responseTest === "0") {
        returnBoolean = false
      }
      return returnBoolean
    }

    getPythonResponse(response) {
      return response;
    }

    createTodo(e){
        e.preventDefault();
        var assignTo = ""
        if (this.state.assignTo == ""){
          assignTo = this.state.userId
        } else {
          assignTo = this.state.assignTo
        }

        var timeSensitive = "";
        var result = this.prakruthi(this.state.newTodoDescription);
        if (result == true){
          timeSensitive = "TRUE";
        } else {
          timeSensitive = "FALSE";
        }

        var somewhatUrgent = "";
        if (this.state.selectedOption === "1"){
          somewhatUrgent = "FALSE";
        } else if (this.state.selectedOption === "2"){
          somewhatUrgent = "TRUE";
        }

        const createTodoAddress = hostAddress + "db/user/" + assignTo + "/Todolist/" + this.state.todoListId + "/Todos";
        var postBody = JSON.stringify({
            desc: this.state.newTodoDescription,
            timeSensitive: timeSensitive,
            somewhatUrgent: somewhatUrgent
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