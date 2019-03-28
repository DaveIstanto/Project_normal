import React from 'react'
import '../Styles/Todolists.css'
import { Button, Card } from 'react-bootstrap'


const hostAddress = "http://localhost:4000/"
class TodoCard extends React.Component {
    render() {
        return (
            <Card className="indCard">                   
                <div className="cardInfoContainer">
                    <div className="cardTitle">{this.props.title}</div>
                    <div className="buttonsContainer">
                        <Button variant="primary">Check Contents!</Button>
                    </div>

                </div>
            </Card>
        )
    }
}

class Todolists extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userTodolists: []
        };
    };

    render() {
        console.log(this.props.location.state.username) //This is the username passed from login page
        console.log(this.state.userTodolists)
        var todoCards = []
        for (var i = 0; i < this.state.userTodolists.length; i++) {
            var todoListName = this.state.userTodolists[i].name
            var todoListId = this.state.userTodolists[i].todolist_id
            var newTodoCard = (<TodoCard key={todoListId} title={todoListName}/>)
            todoCards.push(newTodoCard)
        }

        return (
            <div className="mainContainer">
                <div className="titleContainer">Todolists</div>
                <div className="cardsContainer">
                    {todoCards}
                </div>
            </div>
        )
    }

    componentDidMount() {
        const getTodoListAddress = hostAddress + "db/user/" + this.props.location.state.username + "/Todolist"
        console.log(getTodoListAddress)
        fetch(getTodoListAddress, {mode: 'cors'})
        .then(response => response.json())
        .then(data => this.setState({userTodolists: data.data}))
    }

}

export default Todolists