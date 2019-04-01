import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import history from '../history';
import Loader from '../components/Loader';

let localStatus = '';


export default class Register extends Component {

  constructor(props) {
		super(props);
		this.state = {
          name: '',
          username: '',
          password: '',
          password2: '',
          email: '',
          errorList: [],
          isloading:false
        }
        localStatus = localStorage.getItem('userStatus');
	}

	componentDidMount(){
		if(localStatus === 'success'){
			this.generateSuccessTemp();
		}
	}

	onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit = (e) => {
		this.setState({ errorList: [] });
		e.preventDefault();
		this.setState({isloading : true});
        const { name, username, password, password2, email } = this.state;
        axios.post('http://apes427.herokuapp.com/users/register', { name, username, password, password2, email })
          .then((result) => {
          	this.setState({isloading : false});
          	localStorage.setItem('userStatus', result.data);
          	
          	if(result.data === 'success'){
          		localStorage.setItem('userName', username);
          		this.generateSuccessTemp();
          	}

          	else{
          		console.log('errors');
          		this.setState({ errorList: result.data });
          	} 

         });
	}

	generateSuccessTemp(){
		console.log('temp success');
		history.push('/dashboard');
    }

	generateErrorList(){
		if(this.state.errorList[0]){
			console.log('in generateErrorList')
			return this.state.errorList.map(function(object, i){
            	return <span obj={object} key={i}> {object.msg} </span>;
        	});
		}
    }

	render() {
		return (

		<div className='container'>
			
			<Link to={{
		                pathname: '/'
            }}>
				<button className='btn' style={{backgroundColor:'transparent'}}><h2 className="portalHeading">Smart Mirror Portal</h2></button>
			</Link>
			<h2 className="headingAccount">Create Your Account</h2>
			
			<form onSubmit={this.onSubmit} >
				<div className="form-group">
					<label>Name</label>
					<input type="text"  className="form-control" name="name" onChange={this.onChange}/>
				</div>
				<div className="form-group">
					<label>Username</label>
					<input type="text"  className="form-control" name="username" onChange={this.onChange}/>
				</div>
				<div className="form-group">
					<label>Email</label>
					<input type="email"  className="form-control" name="email" onChange={this.onChange}/>
				</div>
				<div className="form-group">
					<label>Password</label>
					<input type="password"  className="form-control" name="password" onChange={this.onChange}/>
				</div>
				<div className="form-group">
					<label>Confirm Password</label>
					<input type="password"  className="form-control" name="password2" onChange={this.onChange}/>
				</div>
				<button type="submit" className="btn btn-success">SUBMIT</button>
			</form>

			<div className='errors'> {this.generateErrorList()} </div>

			<Loader isloading={this.state.isloading}/>
			
		</div>

			)
		}
	}