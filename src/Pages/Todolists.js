import React from 'react'
import '../Styles/Todolists.css'
import { Button, Card, Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

const hostAddress = "http://localhost:4000/"

//Child element
class TodolistCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newTDLrename: "",
            gotoTodo: false,
            userId: props.userID,
            todoListId: props.cardID,
            todoListName: props.title,

        }
    }

    render() {
        var cardTitle = this.props.title
        //var cardID = this.props.cardID // Card ID is the same as Todolist ID
        return (
            <Card className="indCard">                   
                <div className="cardInfoContainer">
                    <div className="cardTitle">{cardTitle}: {this.props.cardID}</div>
                    <div className="buttonsContainer">
                        {this.renderRedirect()}
                        <Button variant="primary" onClick={(e) => this.checkContentClick(e)}>Check Contents!</Button>
                        <Button variant="primary" onClick={(e) => this.deleteCardClick(e)}>Delete Todolist</Button>
                        <Button variant="primary" onClick={(e) => this.leaveCardClick(e)}>Leave Todolist</Button>
                    </div>
                    <div className="formContainer">
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Update Todolist</Form.Label>
                                <Form.Control type="email" placeholder="Enter new title" value={this.state.value} onChange={this.fillNewTDLName.bind(this)}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={(e) => this.renameTDL(e)}>Rename</Button>
                        </Form>
                    </div>

                </div>
            </Card>
        )
    }

    // Button click functions
    checkContentClick(event) {
        event.preventDefault();
        console.log('click check')
        this.setState({gotoTodo: true})
    }

    renderRedirect = () => {
        if (this.state.gotoTodo) {
            return <Redirect to={{
                pathname: '/Todos',
                state: {
                    userId: this.state.userId, 
                    todoListId: this.state.todoListId,
                    todoListName: this.state.todoListName,
                }
            }} />
        }
    }

    deleteCardClick(event) {
        //Deletes card
        const deleteAddress = hostAddress + "db/user/" + this.props.userID + "/Todolist/delete"
        var postBody = JSON.stringify({
            toDoListId: this.props.cardID,
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

    leaveCardClick(event) {
        const leaveAddress = hostAddress + "db/user/" + this.props.userID + "/Todolist/leave"
        var postBody = JSON.stringify({
            toDoListId: this.props.cardID,
        })

        fetch(leaveAddress, {
            mode: 'cors',
            method: 'POST',
            body: postBody,
            headers: {"Content-Type": "application/json"},
        })
        .then(response => console.log(response)).catch(error => console.log(error))
        .then(setTimeout(() => this.props.action(), 500))
    }

    

    fillNewTDLName(event) {
        this.setState({
            newTDLrename: event.target.value
        })
    }

    renameTDL(e) {
        e.preventDefault();
        const updateTDLAddress = hostAddress + "db/user/" + this.props.userID + "/Todolist/update"
        var postBody = JSON.stringify({
            updatedName: this.state.newTDLrename,
            toDoListId: this.props.cardID,

        })

        fetch(updateTDLAddress, {
            mode: 'cors',
            method: 'POST',
            body: postBody,
            headers: {"Content-Type": "application/json"},
        })
        .then(response => console.log(response))
        .catch(error => console.log(error))
        .then(setTimeout(() => this.props.action(), 500))
    }
}

//Parent element
class Todolists extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userTodolists: [],
            cardsChanged: false,
            goback: false,
            newTDLname: "",
            joinCode: "",
            
        };
    };

    renderRedirect = () => {
        if (this.state.goback) {
            return <Redirect to={{
                pathname: '/'
            }} />
        }
    }

    logoutClick(event) {
        event.preventDefault();
        this.setState({goback: true})
    }

    render() {        
        var username = this.props.location.state.username //This is the username passed from login page

        // Get list of todolists
        var todolistCards = []
        for (var i = 0; i < this.state.userTodolists.length; i++) {
            var todoListName = this.state.userTodolists[i].name
            var todoListId = this.state.userTodolists[i].todolist_id
            var newTodolistCard = (<TodolistCard key={todoListId} cardID={todoListId} title={todoListName} userID={username} action={this.fetchTodolists.bind(this)}/>)
            todolistCards.push(newTodolistCard)
        }

        return (
            <div className="todolistsMainContainer">
                {this.renderRedirect()}
                <Button variant="outline-danger" onClick={(e) => this.logoutClick(e)}>Logout</Button>
                <div className="todolistsTitleContainer">Todolists</div>
                <div className="searchButtonContainer">
                    {this.goToTodolistSearch()}
                    <Button variant="primary" type="submit" onClick={(e, user) => this.searchButtonClickHandler(e, username)}>
                        Search todolists!
                    </Button>
                </div>
                <div className="createTDLContainer">
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Create new Todolist</Form.Label>
                            <Form.Control type="email" placeholder="Enter todolist title" value={this.state.value} onChange={this.fillNewTDLTitle.bind(this)}/>
                            <Button variant="primary" type="submit" onClick={(e) => this.createTDL(e)}>
                            Create
                            </Button>
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Join a Todolist</Form.Label>
                            <Form.Control type="email" placeholder="Enter todolist id" value={this.state.value} onChange={this.fillJoinTDL.bind(this)}/>
                            <Button variant="primary" type="submit" onClick={(e) => this.joinTDL(e)}>
                            Join
                            </Button>
                        </Form.Group>
                        
                    </Form>
                </div>
                <div className="todolistsCardsContainer">
                    {todolistCards}
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.fetchTodolists()
    }

    //Functions
    fillNewTDLTitle(event) {
        this.setState({
            newTDLname: event.target.value
        })
    }

    fillJoinTDL(event) {
        this.setState({
            joinCode: event.target.value
        })
    }

    createTDL(e){
        e.preventDefault();
        const createTDLAddress = hostAddress + "db/user/" + this.props.location.state.username + "/Todolist/create"
        var postBody = JSON.stringify({
            name: this.state.newTDLname
        })
        fetch(createTDLAddress, {
            mode: 'cors',
            method: 'POST',
            body: postBody,
            headers: {"Content-Type": "application/json"},
        })
        .then(response => console.log(response))
        .catch(error => console.log(error))
        .then(setTimeout(() => this.fetchTodolists(), 500))
    }

    joinTDL(e){
        e.preventDefault();
        const joinTDLaddress = hostAddress + "db/user/" + this.props.location.state.username + "/Todolist/join";
        var postBody = JSON.stringify({
            joinCode: this.state.joinCode
        })
        fetch(joinTDLaddress, {
            mode: 'cors',
            method: 'POST',
            body: postBody,
            headers: {"Content-Type": "application/json"},
        })
        .then(response => console.log(response))
        .catch(error => console.log(error))
        .then(setTimeout(() => this.fetchTodolists(), 500))
    }


    fetchTodolists(){
        const getTodoListAddress = hostAddress + "db/user/" + this.props.location.state.username + "/Todolist"
        fetch(getTodoListAddress, {mode: 'cors'})
        .then(response => response.json())
        .then(data => this.setState({userTodolists: data.data}))
    }

    searchButtonClickHandler(e, user) {
        this.setState({
            gotoClicked: true,
            currentUser: user
        }, () => console.log(this.state.currentUser))
    }

    goToTodolistSearch() {
        if (this.state.gotoClicked === true) {
            return <Redirect to={{
            pathname: '/TodolistSearch',
            state: {username: this.state.currentUser}
            }} />
        }
    }
}

export default Todolists
export { TodolistCard }