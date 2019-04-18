import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from './Pages/Login'
import Todolists from './Pages/Todolists'
import Todos from './Pages/Todos'
import TodolistSearch from './Pages/TodolistSearch'

class Router extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: ""
        };
    };

    updateData(data) {
        this.setState({ data });
    }
  
    render() {
        return(
            <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/TodolistSearch' component={TodolistSearch}/>
                <Route path='/Todolists' component={Todolists}/>
                <Route path='/Todos' component={Todos}/>
            </Switch>
        )
    }

} 


export default Router