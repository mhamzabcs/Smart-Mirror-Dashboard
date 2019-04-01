import React, { Component } from 'react';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';
import Loader from '../components/Loader';
import SweetAlert from 'react-bootstrap-sweetalert';

let localName = '';

export default class Facial extends Component {

	constructor(props) {
		super(props);
		this.state = { 
			selectedFile: null, 
			name:'Select a Picture',
			status:'',
			isloading:false,
			alert1:false,
			alert2:false,
		}
		localName = localStorage.getItem('userName')
	}

	fileChangedHandler = event => {
	  this.setState({ selectedFile: event.target.files[0], name: event.target.files[0].name })
	}

	uploadHandler = () => {
	  this.setState({isloading:true});
	  const formData = new FormData()
	  formData.append(
	    'file',
	    this.state.selectedFile,
	    this.state.selectedFile.name
	  )
	  formData.append('username', localName);
	  console.log(formData);
	  axios.post('http://apes427.herokuapp.com/users/upload', formData)
	  	.then((result) => {
	  		console.log(result.data);
	  		if(result.data === 'Image Successfully Uploaded'){
	  			this.setState({alert1: true});	
	  		}
	  		else{
	  			this.setState({alert2: true});
	  		}
	  		this.setState({status:result.data, isloading:false});
	  	})
	}

	render() {

		if (!localName){
  			console.log('in if')
			return <Redirect to='/login'/>
		}

		return (
			
			<div className='middleAll'>
			 	
			 	<div className='container-fluid'>	
					<div className='row'>

						<h2 className="col-8 offset-2" id="theHeading">Facial Settings</h2>

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

			 	<div className='form'>
				  <div className="custom-file">
				    <input type="file" className="custom-file-input" id="customFile" onChange={this.fileChangedHandler}/>
				    <label className="custom-file-label" htmlFor="customFile">{this.state.name}</label>
				  </div>
				</div>

				<br/><br/>

				<span>
					<button onClick={this.uploadHandler}  className='btn btn-primary'>Upload!</button>
				</span>

				<span> or </span>
							
				<span>
					<Link to={{
		                pathname: '/dashboard'
		        	}}> 
		        		<button className="btn btn-danger">Go back to the dashboard</button>
		        	</Link>
		        </span>

		        <SweetAlert success title={this.state.status} show={this.state.alert1} onConfirm={()=>this.setState({alert1:false})}/>

		        <SweetAlert danger title={this.state.status} show={this.state.alert2} onConfirm={()=>this.setState({alert2:false})}/>

		        <Loader isloading={this.state.isloading}/>				
				
            </div>

           
		)
	}
}