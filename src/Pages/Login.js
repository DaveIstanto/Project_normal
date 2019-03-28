import React from 'react'
import { Form, Button } from 'react-bootstrap'
import '../Styles/Login.css'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    };

    render() {
        return (
            <div className="mainContainer">
                <div className="titleContainer">
                    Welcome to DO!
                </div>
                <div className="credContainer">
                    <Form className="formContainer">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" placeholder="Enter username" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <div className="buttonsContainer">
                            <Button className="submitButton" variant="primary" type="submit" onClick={(e) => loginClick(e)}>
                                Log in
                            </Button>
                            <Button className="submitButton" variant="primary" type="submit">
                                Create
                            </Button>
                        </div>

                    </Form>
                </div>
            </div>
        );
    
    }
    
}

function loginClick(e){
    e.preventDefault();
    console.log('hello')
}


export default Login