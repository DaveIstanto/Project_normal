import React from 'react'
import '../Styles/Todolists.css'
import { Button, Card, Form } from 'react-bootstrap'


const hostAddress = "http://localhost:4000/"

//Child element
class TodolistCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newTDLrename: ""
        }
    }

    render() {
        var cardTitle = this.props.title
        //var cardID = this.props.cardID // Card ID is the same as Todolist ID
        return (
            <Card className="indCard">                   
                <div className="cardInfoContainer">
                    <div className="cardTitle">{cardTitle}</div>
                    <div className="buttonsContainer">
                        <Button variant="primary" onClick={(e) => this.checkContentClick(e)}>Check Contents!</Button>
                        <Button variant="primary" onClick={(e) => this.deleteCardClick(e)}>Delete Todolist</Button>
                    </div>
                    <div className="formContainer">
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Create new Todolist</Form.Label>
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
        //Route to Todo page, listing all todos for this todolist
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
            newTDLname: ""
            
        };
    };

    render() {        
        var username = this.props.location.state.username //This is the username passed from login page
        
        // Get list of todolists
        var todolistCards = []
        for (var i = 0; i < this.state.userTodolists.length; i++) {
            var todoListName = this.state.userTodolists[i].name
            var todoListId = this.state.userTodolists[i].todolist_id
            var newTodolistCard = (<TodolistCard key={todoListId} cardID={todoListId} title={todoListName} userID={username} action={this.fetchTodolists.bind(this) }/>)
            todolistCards.push(newTodolistCard)
        }

        return (
            <div className="todolistsMainContainer">
                <div className="todolistsTitleContainer">Todolists</div>
                <div className="createTDLContainer">
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Create new Todolist</Form.Label>
                            <Form.Control type="email" placeholder="Enter todolist title" value={this.state.value} onChange={this.fillNewTDLTitle.bind(this)}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={(e) => this.createTDL(e)}>
                            Create
                        </Button>
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


    fetchTodolists(){
        const getTodoListAddress = hostAddress + "db/user/" + this.props.location.state.username + "/Todolist"
        fetch(getTodoListAddress, {mode: 'cors'})
        .then(response => response.json())
        .then(data => this.setState({userTodolists: data.data}))
    }
}

export default Todolists