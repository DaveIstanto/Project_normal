import React from 'react'

class Todolists extends React.Component {

    
    render() {
        console.log(this.props.location.state.username) //This is the username passed from login page
        return(
            <h1>
                This is the todolists page.
            </h1>
        )
    }

            

}

export default Todolists