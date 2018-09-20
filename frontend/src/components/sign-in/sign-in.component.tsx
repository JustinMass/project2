import * as React from 'react';
import { Link } from 'react-router-dom';


export class SignInComponent extends React.Component<any, any> {

    public submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch(`http://localhost:8080/users/login`, {
          body: JSON.stringify(e),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })
          .then(resp => {
            console.log(resp.status)
            if (resp.status === 401) {
              this.props.updateError('Invalid Credentials');
            } else if (resp.status === 200) {
              return resp.json();
            } else {
              this.props.updateError('Failed to Login at this time');
            }
            throw new Error('Failed to login');
          })
          .then(resp => {
            localStorage.setItem('user', JSON.stringify(resp));
            this.props.history.push('/home');
          })
          .catch(err => {
            console.log(err);
          });
      }

    public render() {
        
    
        return (
          <div className="text-center signin-container" id="signInContainer">
          <form className="form-signin" onSubmit={this.submit}>
            <h1 id="pleaseHelpPoor" className="h3 mb-3 font-weight-normal"></h1>
    
            
            <input
             
              
              type="text"
              id="inputUsername"
              className="form-control"
              placeholder="Username"
              required />
    
            
            <input
              
              
              type="password"
              id="inputPassword"
              className="form-control"
              placeholder="Password"
              required />
    
            <button id="signInButton" className="btn btn-lg btn-dark btn-block" type="submit">Sign in</button>
          </form>
          <Link id="registerLink" className="badge badge-light" to="/register">Register</Link>
           <p id="error-message">{}</p>
          </div>
        );
      }
    }

