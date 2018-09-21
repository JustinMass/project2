import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ISignInState, IState } from '../../reducers';
import * as signInActions from '../../actions/sign-in/sign-in.actions';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

interface IProps extends RouteComponentProps<{}>, ISignInState {
    updateError: (message: string) => any
    updatePassword: (password: string) => any,
    updateRegistration: (message: string) => any,
    updateUsername: (username: string) => any  
}
export let DBuser = {
    id: 0,
    password: '',
    points: 0,
    upgrades: [{
        upgrade: '',
        userId: 0,
        userUpgradeId: 0,
    }],
    username: ''
}



export class SignInComponent extends React.Component<IProps, {}> {

    public registerError = false;

    constructor(props: any) {
        super(props);

    }

    public submitRegistration = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        DBuser.points = 0;
        if (DBuser.username === '' || DBuser.password === '') {
            this.registerError = true;
            return;
        }

        fetch(`http://ec2-54-89-137-191.compute-1.amazonaws.com:9001/users`, {
            body: JSON.stringify(DBuser),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
        })
            .then(resp => {
                // console.log(resp.status)
                if (resp.status === 401) {
                    console.log('got 401')
                } else if (resp.status === 201) {
                    return resp.json();
                }
                // throw new Error('Failed to login');
                return null;
            })
            .then(resp => {
                console.log(`Created User with id:${resp}`);
                this.props.updateRegistration('Successfully Registered');
                setTimeout(() => {
                    this.props.updateRegistration('');
                }, 1500);
            })
            .catch(err => {
                console.log(err);
            });
    }


    public submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch(`http://ec2-54-89-137-191.compute-1.amazonaws.com:9001/users/login`, {
            body: JSON.stringify(this.props.credentials),
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
                DBuser = resp;
                this.props.history.push('/game');
            })
            .catch(err => {
                console.log(err);
            });
    }
    public passwordChange = (e: any) => {
        this.props.updatePassword(e.target.value);
    }

    public usernameChange = (e: any) => {
        this.props.updateUsername(e.target.value);
    }


    public render() {
        const { errorMessage, credentials, registrationMessage } = this.props;

        return (
            <div className="text-center signin-container">
                <h1 className="text-white text-center font-weight-bold signInTitle">Drawctopus</h1>
                <form className="form-signin" onSubmit={this.submit}>
                    <h1 id="pleaseHelpPoor" className="h3 mb-3 font-weight-normal"></h1>

                    <label htmlFor="inputUsername" className="sr-only">Username</label>
                    <input
                        onChange={this.usernameChange}
                        value={credentials.username}
                        type="text"
                        id="inputUsername"
                        className="form-control"
                        placeholder="Username"
                        required />

                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input
                        onChange={this.passwordChange}
                        value={credentials.password}
                        type="password"
                        id="inputPassword"
                        className="form-control"
                        placeholder="Password"
                        required />

                    <button id="signInButton" className="btn btn-lg btn-dark btn-block" type="submit">Sign in</button>
                    {/* <!-- Button trigger modal --> */}
                    <button type="button" className="btn btn-light btn-lg btn-block" id="registerModelButton" data-toggle="modal" data-target="#exampleModal">
                        Register
                    </button>
                </form>
                




                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Drawctopus Registration</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="registerForm" onSubmit={this.submitRegistration}>

                                    <label>Username</label>
                                    <input type="text" className="form-control newReimbForm" placeholder="Username" required onChange={(e: any) => {
                                        DBuser.username = e.target.value;
                                    }}></input>
                                    <label>Password</label>
                                    <input type="password" className="form-control newReimbForm" placeholder="Password" required onChange={(e: any) => {
                                        DBuser.password = e.target.value;
                                    }}></input>
                                    <button className="btn btn-dark btn-block registerFormButton" type="submit">Register</button>
                                    <button type="button" className="btn btn-secondary btn-block registerFormButton" data-dismiss="modal">Close</button>
                                    {registrationMessage && <h6 id="registerMessage">{registrationMessage}</h6>}
                                </form>

                            </div>
                            <div className="modal-footer">
                            </div>
                        </div>
                    </div>
                </div>

                {errorMessage && <p id="error-message">{errorMessage}</p>}

            </div>


        );
    }
}

const mapStateToProps = (state: IState) => (state.signIn);
const mapDispatchToProps = {
    updateError: signInActions.updateError,
    updatePassword: signInActions.updatePassword,
    updateRegistration: signInActions.updateRegistration,
    updateUsername: signInActions.updateUsername,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInComponent);

