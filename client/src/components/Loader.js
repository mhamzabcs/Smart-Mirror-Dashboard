import React, { Component } from 'react';
import './loader.css';


export default class Loader extends Component {

	loading(){
	    if(this.props.isloading){
	      return  <div class="loading">
	                <div class="loader"></div>
	              </div>
	    }
	}

    render() {
	    return (
	      <div> {this.loading()} </div>
	    );
    }

}