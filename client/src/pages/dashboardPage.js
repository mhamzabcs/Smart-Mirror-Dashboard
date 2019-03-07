import React, { Component } from 'react';
import '../App.css';
import {Redirect, Link} from 'react-router-dom'
import cookie from 'react-cookies'

var user = cookie.load('user')

class Dashboard extends Component {
  

	render() {
		
		if (!user){
			console.log(user);
  			console.log('in if')
			return <Redirect to='/login'/>
		}
		else{
			console.log(user);
		}
		return (
				
			<div className="middleAll">

				<h2 className="theHeading">Welcome to the Smart Mirror Dashboard, </h2>
			
				<span>
					<Link to={{
		                pathname: '/widget',
		                state: { name: 'abc' }
		            }}>
						<button type="button" className="btn btn-success" >Widget Settings</button>
					</Link>
				</span>
    			
				<span>or</span>
				
				<span>
					<Link to={{
		                pathname: '/facial',
		                state: { name: 'abc'}
		            }}>
						<button type="button" className="btn btn-success">Facial Settings</button>
					</Link>
				</span>	  
	    	  

    	    </div>
						
		);
	}
}

export default Dashboard;