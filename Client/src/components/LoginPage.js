import React from 'react';
import {connect} from "react-redux";
import TwitterLogin  from "react-twitter-auth";
import FacebookButton from './FacebookButton';
import {startLogin, initLogin} from "../actions/auth";
import {startSetChannels} from "../actions/channels";
import {startSetProfile} from "../actions/profile";
import {twitterRequestTokenUrl, twitterAccessTokenUrl, backendUrl, facebookAppId, linkedinAppId, pinterestAppId} from "../config/api";
import {registerUser, loginUser} from '../requests/auth';
import {LoaderWithOverlay} from "./Loader";
import LinkedInButton from "./LinkedInButton";
import PinterestButton from "./PinterestButton";

export class LoginPage extends React.Component{

    state = {
        loading: false,
        register: this.props.location.search.indexOf("register") != -1 ? true : false,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: ""
    }

    constructor(props) {
        super(props);
    }

    onFailure = (response) => {
        console.log(response);
    };

    onTwitterSuccess = (response) => {
        this.setState(() => ({loading: true}));
        response.json().then(body => {
            this.props.startLogin(body, "twitter").then(() => {
                this.props.startSetProfile();
                this.props.startSetChannels();
            }).catch(error => {
                this.setState(() => ({loading: false}));
            });
        });
    };

    onFacebookSuccess = (response) => {
        this.setState(() => ({loading: true}));
        this.props.startLogin(response, "facebook").then(() => {
            this.props.startSetProfile();
            this.props.startSetChannels();
        }).catch(error => {
            this.setState(() => ({loading: false}));
        });
    };

    onLinkedInSuccess = (response) => {
        this.setState(() => ({loading: true}));
        this.props.startLogin(response, "linkedin").then(() => {
            this.props.startSetProfile();
            this.props.startSetChannels();
        }).catch(error => {
            this.setState(() => ({loading: false}));
        });
    };

    onPinterestSuccess = (response) => {
        this.setState(() => ({loading: true}));
        this.props.startLogin(response, "pinterest").then(() => {
            this.props.startSetProfile();
            this.props.startSetChannels();
        }).catch(error => {
            this.setState(() => ({loading: false}));
        });
    };

    toggleRegister = () => {
        this.setState(() => ({
            register: !this.state.register
        }));
    };

    onEmailChange = (e) => {
        const email = e.target.value;

        this.setState(() => ({
            email
        }));
    };

    onNameChange = (e) => {
        const name = e.target.value;

        this.setState(() => ({
            name
        }));
    };

    onPasswordChange = (e) => {
        const password = e.target.value;

        this.setState(() => ({
            password
        }));
    };

    onConfirmPasswordChange = (e) => {
        const confirmPassword = e.target.value;

        this.setState(() => ({
            confirmPassword
        }));
    };

    performLogin = (token) => {
        return this.props.initLogin(token).then(() => {
            this.props.startSetProfile();
            this.props.startSetChannels();
        }).catch(e => {
            this.setState(() => ({loading: false}));
            console.log(e);
        });
    };

    onRegisterSubmit = () => {

        this.setState(() => ({loading: true}));
        const data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.confirmPassword
        };
        
        registerUser(data).then(response => {
            if(typeof response.accessToken !== "undefined") {
                this.performLogin(response.accessToken);
            }
        }).catch(e => {
            this.setState(() => ({loading: false}));
            if(typeof e.response !== "undefined" && typeof e.response.data.errors !== "undefined"){
                this.setState(() => ({
                    error: Object.values(e.response.data.errors)[0][0]
                }));
                return;
            }

            console.log(e);
        });
    };

    onLoginSubmit = () => {
        this.setState(() => ({loading: true}));
        const data = {
            email: this.state.email,
            password: this.state.password
        };
        
        loginUser(data).then(response => {
            if(typeof response.accessToken !== "undefined") {
                this.performLogin(response.accessToken);
            }
        }).catch(e => {
            this.setState(() => ({loading: false}));
            if(typeof e.response !== "undefined" && typeof e.response.data.error !== "undefined"){
                this.setState(() => ({
                    error: e.response.data.error
                }));

                return;
            }  
            
            console.log(e);
        });
    };

    render(){
        
        return (
            <div className="login-container">
                {this.state.loading && <LoaderWithOverlay />}
                <div className="box-container">

                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12 text-center">
                            <div className="col-xs-12 text-center">
                                <img className="img-responsive" src="/images/login_image.png" />
                            </div>
                            
                        </div>

                        <div className="col-md-6 col-sm-6 col-xs-12 text-center">
                            <div className="col-xs-12 text-center">
                               <div className="form-container">

                                    {!this.state.register ?
                                        <div className="login-form">
                                            {!!this.state.error.length && 
                                            <div className="alert alert-danger">
                                                {this.state.error}
                                            </div>}

                                            <h4>Sign in with your account</h4>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Email address:</label>
                                                <input type="email" onChange={this.onEmailChange} value={this.state.email} className="form-control" id="inputEmail1" aria-describedby="emailHelp" required/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputPassword1">Password:</label>
                                                <input type="password" onChange={this.onPasswordChange} value={this.state.password} className="form-control" id="inputPassword1" required/>
                                            </div>                                    
                                            
                                            <button type="submit" onClick={this.onLoginSubmit} className="btn magento-btn full-width">Sign in</button>
                                            <button type="submit" onClick={this.toggleRegister} className="btn btn-link">Create a new account</button>
                                            <a href={`${backendUrl}/password/reset`} className="btn btn-link">Forgot password?</a>
                                        </div>
                                    :
                                    <div className="login-form">
                                        {!!this.state.error.length && 
                                        <div className="alert alert-danger">
                                            {this.state.error}
                                        </div>}

                                        <h4>Let's get your account setup</h4>
                                        <div className="form-group">
                                            <label htmlFor="inputName1">Full Name:</label>
                                            <input type="text" onChange={this.onNameChange} minLength="6" className="form-control" value={this.state.name} id="inputName1" aria-describedby="emailHelp" required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputEmail1">Email address:</label>
                                            <input type="email" onChange={this.onEmailChange} minLength="8" className="form-control" value={this.state.email} id="inputEmail1" aria-describedby="emailHelp" required/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputPassword1">Password:</label>
                                            <input type="password" onChange={this.onPasswordChange} minLength="8" 
                                            className={`form-control ${this.state.password !== "" && this.state.password.length < 8 ? 'red-border' : ''}`}
                                            value={this.state.password} id="inputPassword1" required/>
                                        </div>
                                        <div className="form-group">
                                        <label htmlFor="inputConfirmPassword1">Confirm Password:</label>
                                            <input type="password" 
                                            onChange={this.onConfirmPasswordChange}
                                            className={`form-control 
                                            ${this.state.confirmPassword !== "" && this.state.confirmPassword !== this.state.password ? 'red-border' : ''}`} 
                                            value={this.state.confirmPassword} id="inputConfirmPassword1"
                                            />
                                        </div>

                                        
                                        <button type="submit" onClick={this.onRegisterSubmit} className="btn magento-btn full-width">Sign up</button>
                                        <button type="submit" onClick={this.toggleRegister} className="btn btn-link">Already have an account</button>
                                        <p className="inline-txt">I agree with Uniclix <a href={`${backendUrl}/privacy-policy`} target="_blank" className="btn btn-link"> Terms of Services</a></p>
                                    </div>
                                    }

            
                                </div>
                            </div>
 
                        </div>
                    </div>
                </div>
            </div>  
        );
    }
};

const mapDispatchToProps = (dispatch) => ({
    initLogin: (token) => dispatch(initLogin(token)),
    startLogin: (body, network) => dispatch(startLogin(body, network)),
    startSetProfile: () => dispatch(startSetProfile()),
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(undefined, mapDispatchToProps)(LoginPage);