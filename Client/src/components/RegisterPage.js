import React from 'react';
import { connect } from "react-redux";
import { startLogin, initLogin } from "../actions/auth";
import { startSetChannels } from "../actions/channels";
import { startSetProfile } from "../actions/profile";
import { backendUrl } from "../config/api";
import {registerUser} from '../requests/auth';

export class RegisterPage extends React.Component {

    state = {
        loading: false,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: ""
    }


    performLogin = (token) => {
        return this.props.initLogin(token).then(() => {
            this.props.startSetProfile();
            this.props.startSetChannels();
        }).catch(e => {
            this.setState(() => ({ loading: false }));
            console.log(e);
        });
    };

    onRegisterSubmit = () => {

        this.setState(() => ({ loading: true }));
        const data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.confirmPassword
        };

        registerUser(data).then(response => {
            if (typeof response.accessToken !== "undefined") {
                this.performLogin(response.accessToken);
            }
        }).catch(e => {
            this.setState({ loading: false });
            if (typeof e.response !== "undefined" && typeof e.response.data.errors !== "undefined") {
                this.setState(() => ({
                    error: Object.values(e.response.data.errors)[0][0]
                }));
                return;
            }

            console.log(e);
        });
    };
    onInputChange = (e) => {
        let inputName = e.target.name;
        let input = [];
        input[inputName] = e.target.value;
        this.setState({
            ...input
        });
    };
    render() {

        return (
            <div className="login-form">
                {!!this.state.error.length &&
                    <div className="alert alert-danger">
                        {this.state.error}
                    </div>}

                <h3>Create your Uniclix account</h3>
                <div className="form-group">
                    <label htmlFor="inputName1">Full Name</label>
                    <input type="text" onChange={this.onInputChange} name='name' minLength="6" className="form-control" placeholder="John Doe" value={this.state.name} id="inputName1" aria-describedby="emailHelp" required />
                </div>
                <div className="form-group">
                    <label htmlFor="inputEmail1">Email address</label>
                    <input type="email" name="email" onChange={this.onInputChange} minLength="8" placeholder="example@domain.com" className="form-control" value={this.state.email} id="inputEmail1" aria-describedby="emailHelp" required />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword1">Password</label>
                    <input type="password" onChange={this.onInputChange} minLength="8" placeholder="Use at least 8 characters"
                        className={`form-control ${this.state.password !== "" && this.state.password.length < 8 ? 'red-border' : ''}`}
                        value={this.state.password} id="inputPassword1" required name="password" />
                    {this.state.password !== "" && this.state.password.length < 8 ?
                        <span className="error">Password must be 8 + characters, include 1 uppercase letter and 1 number</span>
                        :
                        ''
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="inputConfirmPassword1">Confirm Password</label>
                    <input type="password"
                        placeholder="Repeat the password above"
                        name="confirmPassword"
                        onChange={this.onInputChange}
                        className={`form-control 
                                    ${this.state.confirmPassword !== "" && this.state.confirmPassword !== this.state.password ? 'red-border' : ''}`}
                        value={this.state.confirmPassword} id="inputConfirmPassword1"
                    />
                </div>

                <p className="inline-txt">I agree with Uniclix <a href={`${backendUrl}/privacy-policy`} target="_blank" className="btn btn-link"> Terms of Services</a></p>
                {this.state.email && this.state.password && this.state.name && this.state.confirmPassword ?
                    <button type="submit" onClick={this.onRegisterSubmit} className="btn magento-btn full-width">Sign up</button> :
                    <button type="submit" className="btn magento-btn full-width disabled-btn" disabled>Sign up</button>
                }
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

export default connect(undefined, mapDispatchToProps)(RegisterPage);