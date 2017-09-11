import React, { Component } from 'react';
import bear from './bear.svg';
import './App.css';
import firebase,{provider, auth} from './firebase.js';

class App extends Component {
  
  constructor(props) {
  	super(props);
  	this.state = {
  		currentNote : '',
  		user: null,
  		notes: [],
  		title: '',
  		body: ''
  	}

  	this.handleChange = this.handleChange.bind(this);
  	this.handleSubmit = this.handleSubmit.bind(this);
  	this.login = this.login.bind(this);
  	this.logout = this.logout.bind(this);
  }

  componentDidMount() {
  	auth.onAuthStateChanged( (user) => {
  		if(user) {
  			this.setState({ user : user });
  		}
  	});

  	// fetch notes
  	const notesRef = firebase.database().ref('notes');
  	notesRef.on('value', (snapshot) => {
  		let notes = snapshot.val();
  		let newState = [];
  		for(let note in notes)
  		{
  			newState.push({
  				id: note,
  				title: notes[note].title,
  				body: notes[note].body
  			});
  		}

  		this.setState({ notes : newState });
  	})
  }

  handleChange(e) {
  	this.setState({
  		[e.target.name] : e.target.value
  	});
  }

  handleSubmit(e) {
  	e.preventDefault();

  	const notesRef = firebase.database().ref('notes');

  	const note = {
  		title : this.state.title,
  		body: this.state.body,
  		created_by : this.state.user.displayName || this.state.user.email
  	}

  	notesRef.push(note);

  	this.setState({
  		title: '',
  		body: ''
  	});
  }

  login() {
  	auth.signInWithPopup(provider)
  		.then( (result) => {
  			const user = result.user;
  			this.setState({
  				user : user
  			});
  		})
  }

  logout() {
  	auth.signOut()
  		.then( () => {
  			this.setState({
  				user: null
  			});
  		});
  }


  render() {
  	
  	const containerStyle = {
  		marginTop: '1.52em'
  	}

    return (
      <div className="App">
      	<div className="row no-gutters">
			<div className="col-md-1 col-lg-1">
      			<div className="primary-sidebar">
      				<div className="logo-wrapper text-center">
			       		<img src={bear} alt="Bear Writer" width="64" />		
      				</div>
      				<ul className="primary-sidebar-nav">
						<li>
							<a href="#">
								<i className="fa fa-plus"></i>
							</a>
						</li>
      				</ul>
      			</div>
			</div>
			<div className="col">
		        <header className="App-header">
			          {this.state.user ? 
			          <h2>Welcome to Bear Writer, {this.state.user.displayName || this.state.user.email}</h2>
					  :
					  <h2>Welcome to Bear Writer</h2>
			          }
			          {this.state.user ? 
						<a onClick={this.logout} className="btn btn-warning">Logout</a>
			          : 
						<a onClick={this.login} className="btn btn-warning">Login</a>
			      	  }
		        </header>
		        <section>
        	        <div className="container-fluid" style={containerStyle}>
        	        	<h4 className="text-center">Cloud-based Notes Taker</h4>
        	        	<hr/>
        	        	
        	        	{this.state.user ? (
        				
        				// All User Auth Required Activities Goes here
        				<div>
        					<div className='user-profile'>
        					  <img src={this.state.user.photoURL} draggable="false" />
        					</div>
        					<div className='row'>
        						<div className="col-md-8">
        							<form onSubmit={this.handleSubmit}>
        								<div className="form-group">
        									<label htmlFor="title">Note Title: </label>
        									<input type="text" name="title" value={this.state.title} onChange={this.handleChange} placeholder="Every Story Needs a Title ..."  className="form-control"/>
        								</div>
        								<div className="form-group">
        									<label htmlFor="body">Note Body: </label>
        									<textarea name="body" onChange={this.handleChange} value={this.state.body} placeholder="Composer an Epic ..." className="form-control"></textarea>
        								</div>
        								<button type="submit" className="btn btn-primary">Create Note</button>
        							</form>
        						</div>
        						<div className="col">
        							2
        						</div>
        					</div>
        				</div>
        				
        				)
        	 			// Show anything for not-logged-in Users
        	 			: 
        				(
        					<div className="alert alert-info">
        						You must be logged-in to continue. Thank you.
        					</div>
        				)
        	 			}

        	        </div>
		        </section>
			</div>
      	</div>
      </div>
    );
  }
}

export default App;
