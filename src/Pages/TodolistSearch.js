import React from 'react'
import '../Styles/TodolistSearch.css'
import { TodolistCard } from './Todolists'
import { Form, Button } from 'react-bootstrap'
import { strict } from 'assert';
import $ from 'jquery';


const hostAddress = "http://localhost:4000/"
// Parent element
class TodolistSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBarContent: "",
            currentUser: "",
            fetchedCards: [],
        }
    }

    componentWillMount() {
        this.setCurrentUser(this.props.location.state.username)
    }

    render() {
        // Get searched todolists

        var todolistCards = []
        for (var i = 0; i < this.state.fetchedCards.length; i++) {
            var todoListName = this.state.fetchedCards[i].name
            var todoListId = this.state.fetchedCards[i].todolist_id
            var newTodolistCard = (<TodolistCard key={todoListId} cardID={todoListId} title={todoListName} userID={this.state.currentUser} action={this.fetchTodolists.bind(this) }/>)
            todolistCards.push(newTodolistCard)
        }

        return (
            <div className="todolistSearchMainContainer">
                <div className="searchBarContainer">
                    <Form>
                        <Form.Group controlId="formSearchTodolist">
                            <Form.Label>Search Todolist</Form.Label>
                            <Form.Control type="text" placeholder="Name of todolist..." value={this.state.value} onChange={this.fillSearchBarState.bind(this)}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={(e) => this.searchButtonHandler(e)}>Search!</Button>
                    </Form>
                </div>
                <div className="cardContainer">
                    {todolistCards}
                </div>
            </div>
        )
    }

    // Functions
    setCurrentUser(user) {
        this.setState({
            currentUser: user,
        }, () => console.log(this.state.currentUser))
    }
    fillSearchBarState(event) {
        this.setState({
            searchBarContent: event.target.value
        })// ,() => console.log(this.state.searchBarContent))
        
    }

    searchButtonHandler(event) {
        event.preventDefault();
        
        var keywordArr = this.state.searchBarContent.split(" ")
        var potentialWordsArr = []

        for (var i = 0; i < keywordArr.length; i++) {
            var similarWordsArr = this.getSimilarWords(keywordArr[i]).split(',')
            potentialWordsArr.push(similarWordsArr)
        } 

        potentialWordsArr = potentialWordsArr.flat()
        this.fetchSearchCards(potentialWordsArr)
    }

    fetchSearchCards(wordArr) {
        var fetchSearchCard = hostAddress + "db/user/TodolistSearch"
        var postBody = JSON.stringify({
            inputArr: wordArr,
            userId: this.state.currentUser,
        })

        // Function to search cards 
        fetch (fetchSearchCard, {
            mode: 'cors', 
            method: 'POST',
            body: postBody,
            headers: {"Content-Type": "application/json"},
        })
        .then(response => response.json())
        .then(data => this.setState({fetchedCards: data.data}))
    }

    getSimilarWords(inputString) {
        var similarWords = $.ajax({
            type: "POST",
            url: "http://127.0.0.1:5000/getSimilarWordServer",
            data: { searchString: inputString },
            success: this.getPythonResponse,
            async: false
        });
        return similarWords.responseText
    }


    getPythonResponse(response) {
        return response
    }

    fetchTodolists(){
        const getTodoListAddress = hostAddress + "db/user/" + this.state.currentUser + "/Todolist"
        fetch(getTodoListAddress, {mode: 'cors'})
        .then(response => response.json())
        .then(data => this.setState({fetchedCards: data.data}))
    }



}

export default TodolistSearch