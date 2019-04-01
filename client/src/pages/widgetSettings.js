import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';
import Loader from '../components/Loader';
import SweetAlert from 'react-bootstrap-sweetalert';

let localName = '';

class WidgetSettings extends Component {
  
  constructor(props) {
  		super(props);
  		this.state = {
  			w1:'Weather',
  			w2:'Date And Time',
  			w3:'Reminders',
  			w4:'Youtube Player',
  			status:'',
  			isloading:false,
  			alert:false,
  		}
  		localName = localStorage.getItem('userName')
	}

	onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit = (e) => {
		e.preventDefault();
		this.setState({isloading:true});
        const { w1,w2,w3,w4 } = this.state;
        axios.post('http://apes427.herokuapp.com/users/setting', { w1,w2,w3,w4,username:localName })
          .then((result) => {
          	console.log(result.data);
          	this.setState({status:result.data, isloading:false, alert:true})
         });
    }

	render() {

		if (!localName){
  			console.log('in if')
			return <Redirect to='/login'/>
		}
		
		return (
				
				<div className='container-fluid'>

						
					<div className='row'>

						<h2 className="col-8 offset-2" id="settingHeading">Smart Mirror Settings</h2>

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
					

					<form onSubmit={this.onSubmit} >

						<div className="absoluteMiddle">
							
							<br/>
							
							<span>
								<button type="submit" className="btn btn-success">Apply Changes!</button>
							</span>

							<span> or </span>
							
							<span>
								<Link to={{
					                pathname: '/dashboard'
					        	}}> 
					        		<button className="btn btn-info">Go back to the dashboard</button>
					        	</Link>
					        </span>

					        <SweetAlert success title={this.state.status} show={this.state.alert} onConfirm={()=>this.setState({alert:false})}/>

						</div>


						<div className="row">
							<div className="col-4">
								<h2> Widget 1 </h2>
								<div className="form-group">
								  <label htmlFor="w1">Select type:</label>
								  <select className="form-control" onChange={this.onChange} id="w1">
								    <option>Weather</option>
								    <option>Date And Time</option>
								    <option>News</option>
								    <option>Reminders</option>
								    <option>Youtube Player</option>
								  </select>
								</div>
							</div>

							<div className="col-4 offset-4">
								<h2>Widget 2 </h2>
								<div className="form-group">
								  <label htmlFor="w2">Select type:</label>
								  <select className="form-control" value={this.state.w2} onChange={this.onChange} id="w2">
								  	<option>Date And Time</option>
								  	<option>News</option>
								  	<option>Youtube Player</option>
								    <option>Weather</option>
								    <option>Reminders</option>
								  </select>
								</div>
							</div>
						</div>

						<div className="row" id='bottom-widgets'>
							<div className="col-4">
								<h2>Widget 3</h2>
								<div className="form-group">
								  <label htmlFor="w3">Select type:</label>
								  <select className="form-control" value={this.state.w3} onChange={this.onChange} id="w3">
								  	<option>Reminders</option>
								  	<option>Youtube Player</option>
								  	<option>Date And Time</option>
								  	<option>News</option>
								    <option>Weather</option>
								  </select>
								</div>
							</div>

							<div className="col-4 offset-4">
								<h2>Widget 4</h2>
								<div className="form-group">
								  <label htmlFor="w4">Select type:</label>
								  <select className="form-control" value={this.state.w4} onChange={this.onChange} id="w4">
								  	<option>Youtube Player</option>
								  	<option>Reminders</option>
								    <option>Weather</option>
								    <option>News</option>
								    <option>Date And Time</option>
								  </select>
								</div>
							</div>
						</div>

					</form>

					<Loader isloading={this.state.isloading}/>

				</div>
					

				
						
		);
	}
}

export default WidgetSettings;