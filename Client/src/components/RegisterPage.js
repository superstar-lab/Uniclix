import React from 'react';
import moment from 'moment';
import { connect } from "react-redux";
import { startLogin, initLogin } from "../actions/auth";
import { startSetChannels } from "../actions/channels";
import { startSetProfile } from "../actions/profile";
import { backendUrl } from "../config/api";
import { registerUser } from '../requests/auth';
import { getCookie } from '../utils/helpers';
import zxcvbn from 'zxcvbn';

export class RegisterPage extends React.Component {
    state = {
        loading: false,
        name: "",
        email: "",
        password: "",
        error: "",
        checkboxVal: false,
    }

    performLogin = (token) => {
        return this.props.initLogin(token).then(() => {
            this.props.startSetProfile().then(() => {
                this.props.goToOnboarding();
            });
            this.props.startSetChannels();
        }).catch(e => {
            this.setState(() => ({ loading: false }));
            console.log(e);
        });
    };

    onRegisterSubmit = () => {
        this.setState(() => ({ loading: true }));
        const invitedCookie = getCookie('_fprom_code');
        const data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            timezone: moment.tz.guess(),
            isInvited: !!invitedCookie ? 1 : 0
        };

        registerUser(data).then(response => {
            if (typeof response.accessToken !== "undefined") {
                this.performLogin(response.accessToken);
                // Gooogle analytics tracking
                if (gtag) {
                    gtag(
                        'event',
                        'click',
                        {
                            'event_category' : 'account',
                            'event_label' : 'Sign Up',
                            'value': 1
                        }
                    );
                }
                // First Promoter call
                if ($FPROM && !!invitedCookie) {
                    $FPROM.trackSignup(
                        {
                            uid: response.token.user_id
                        },
                        function(){console.log('Callback received!')}
                    );
                }
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

    onCheckboxChange = (e) => {
        let checkboxVal = this.state.checkboxVal;
        this.setState({
            checkboxVal: !checkboxVal,
        });
    }

    render() {
        const { password, email, name, checkboxVal, error} = this.state;
        const passwordLevel = zxcvbn(password).score;

        return (
            <div className="login-form">
                {
                    !!error.length && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )
                }
                <h3>Create your Uniclix account</h3>
                <div className="form-group">
                    <label htmlFor="inputName1">Full Name</label>
                    <input
                        type="text"
                        onChange={this.onInputChange}
                        name='name'
                        minLength="6"
                        className="form-control"
                        placeholder="John Doe"
                        value={name}
                        id="inputName1"
                        aria-describedby="emailHelp"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="inputEmail1">Email address</label>
                    <input
                        type="email"
                        name="email"
                        onChange={this.onInputChange}
                        minLength="8"
                        placeholder="example@domain.com"
                        className="form-control"
                        value={email}
                        id="inputEmail1"
                        aria-describedby="emailHelp"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="inputPassword1">Password</label>
                    <input
                        type="password"
                        onChange={this.onInputChange}
                        minLength="8"
                        placeholder="Use at least 8 characters"
                        className={`form-control ${password !== "" && password.length < 8 ? 'red-border' : ''}`}
                        value={password}
                        id="inputPassword1"
                        required
                        name="password"
                    />
                    {
                        password !== "" && password.length < 8 ?
                            <span className="error">Password must have at least 8 characters</span>
                            :
                            ''
                    }
                </div>
                {
                    !!password && (
                        <div className={`password-strength level-${passwordLevel}`}>
                            <div className="bar-level lvl01"></div>
                            <div className="bar-level lvl2"></div>
                            <div className="bar-level lvl3"></div>
                            <div className="bar-level lvl4"></div>
                        </div>
                    )
                }
                <p className="inline-txt">
                    <input
                        type="checkbox"
                        value="true"
                        onChange={this.onCheckboxChange}
                        className="checkbox"
                    />
                    I agree with Uniclix
                    <a
                        href={`${backendUrl}/privacy-policy`}
                        target="_blank"
                        className="btn btn-link"> Terms of Services
                    </a>
                </p>
                {
                    email && password.length >= 8 && name && checkboxVal ?
                        <button
                            type="submit"
                            onClick={this.onRegisterSubmit}
                            className="btn magento-btn full-width"
                        >
                            Sign up
                        </button> :
                        <button
                            type="submit"
                            className="btn magento-btn full-width disabled-btn"
                            disabled
                        >
                            Sign up
                        </button>
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