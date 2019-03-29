import React from 'react'
import { Form, Button} from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import '../Styles/Login.css'

const hostAddress = "http://localhost:4000/"
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            successfulLogin: false,
        };
    };

    render() {
        return (
            <div className="loginMainContainer">
                <div className="loginTitleContainer">
                    Welcome to DO!
                </div>
                <div className="loginCredContainer">
                    <Form className="loginFormContainer">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" placeholder="Enter username" value={this.state.value} onChange={this.fillUsername.bind(this)}/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={this.state.value} onChange={this.fillPassword.bind(this)}/>
                        </Form.Group>
                        <div className="loginButtonsContainer">
                            {this.renderRedirect()}
                            <Button className="loginSubmitButton" variant="primary" type="submit" onClick={(e) => this.loginClick(e)}>
                                Log in
                            </Button>
                            <Button className="loginSubmitButton" variant="primary" type="submit" onClick={(e) => this.createClick(e)}>
                                Create
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }

    // Functions
    fillUsername(event) {
        this.setState({username: event.target.value});
        // set router's props data.username
    }

    fillPassword(event) {
        this.setState({password: event.target.value})
    }


    loginClick(e) {
        e.preventDefault();
        var checkUserAddress = hostAddress + "db/user?username=" + this.state.username + "&password=" + this.state.password
        //Function, get json
        // if not null, redirect; if null stay, put out alert
        fetch(checkUserAddress, {mode: 'cors'}).then(response => response.json())
        .then(data => this.loginDecider(data.data.length))

    }

    loginDecider(arrayLen) {
        if (arrayLen !== 1) {
            console.log("stay in this page!")
            
        } else {
            console.log("move to next page!")
            this.setState({successfulLogin: true})
        }
    }

    renderRedirect = () => {
        if (this.state.successfulLogin) {
            return <Redirect to={{
                pathname: '/Todolists',
                state: {username: this.state.username}
                }} />
        }
    }

    createClick(e){
        e.preventDefault();
        var addUserAddress = hostAddress + "db/user/create"
        var postBody = JSON.stringify({
            username: this.state.username,
            password: this.state.password,
        })
        //Function here, make request to create ID
        fetch (addUserAddress, {
            mode: 'cors', 
            method: 'POST',
            body: postBody,
            headers: {"Content-Type": "application/json"},
        }).then(response => console.log(response)).catch(error => console.log(error))
    }
    
}


export default Login