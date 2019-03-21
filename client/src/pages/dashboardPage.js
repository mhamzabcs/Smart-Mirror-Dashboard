import React, { Component } from 'react';
import '../App.css';
import {Redirect, Link} from 'react-router-dom'

let localName = '';


class Dashboard extends Component {

	constructor(props) {
		super(props);
		localName = localStorage.getItem('userName')
	}
  

	render() {
		
		if (!localName){
  			console.log('in if')
			return <Redirect to='/login'/>
		}

		return (
				
			<div className="middleAll">	

				<div className='container-fluid'>	
					<div className='row'>

						<h2 className="col-8 offset-2" id="theHeading">Welcome to the Smart Mirror Dashboard, {localName}</h2>

						<div className="col-2">
							<Link  to={{
				            	pathname: '/logout'
			       	 		}}> 
				       	 		<button className='btn' style={{backgroundColor:'transparent'}}>
				       	 			<h4 className="portalHeading">
				       	 				Logout
				       	 				<span> <img width='15%' alt="img" src={require('../lgo.png')} /> </span>
				       	 			</h4>
				       	 		</button>	
							</Link>
						</div>

					</div> 
				</div>
			
				<span>
					<Link to={{
		                pathname: '/widget'
		            }}>
						<button type="button" className="btn btn-success" >Widget Settings</button>
					</Link>
				</span>
    			
				<span>or</span>
				
				<span>
					<Link to={{
		                pathname: '/facial'
		            }}>
						<button type="button" className="btn btn-success">Facial Settings</button>
					</Link>
				</span>	  
	    	  

    	    </div>
						
		);
	}
}

export default Dashboard;