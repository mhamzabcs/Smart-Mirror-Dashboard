import React, { Component } from 'react';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';


export default class Login extends Component {

  	constructor(props) {
		super(props);
		this.state = {
          username: '',
          password: '',
          localStatus: '',
        }
	}

	componentDidMount(){
		console.log('yo')
		this.sessionSet();
	}
	onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
	onSubmit = (e) => {
		e.preventDefault();
        const { username, password } = this.state;
        axios.post('http://apes427.herokuapp.com/users/login', { username, password })
          .then((result) => {
          	console.log(result.data);
          	let user = result.data;

          	localStorage.setItem('userStatus', user.status);
          	if(user.status === 'success'){
          		localStorage.setItem('userName', user.username);
          	}

          	this.sessionSet();  	

         });
	}

	sessionSet(){
		this.setState(
      	{
      		localStatus : localStorage.getItem('userStatus')
      	}) 
	}

	generateSuccessTemp(){
		if(this.state.localStatus === 'success'){
			console.log('logged in')
			return (<Redirect to={{
                pathname: '/dashboard'
            }} />)
		}
		else if(this.state.localStatus === 'fail'){
			return <div> <br/><p>Invalid username or password</p> </div>;	
		}
    }

	render() {
		return (
			<div className="container">
					
					<Link to={{
		                pathname: '/'
		            }}>
						<button className='btn' style={{backgroundColor:'transparent'}}><h2 className="portalHeading">Smart Mirror Portal</h2></button>
					</Link>
					<h2 className="headingAccount">Login to Your Account</h2>
					
					<form onSubmit={this.onSubmit} >
						<div className="form-group">
							<label>Username</label>
							<input type="text"  className="form-control" name="username" onChange={this.onChange}/>
						</div>
						<div className="form-group">
							<label>Password</label>
							<input type="password"  className="form-control" name="password" onChange={this.onChange}/>
						</div>
						<button type="submit" className="btn btn-success">Login</button>
					</form>

					<div className='errors'> {this.generateSuccessTemp()} </div>
					
			</div>

			)
		}
	}