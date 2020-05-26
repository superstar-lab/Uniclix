import React from 'react';
import {connect} from "react-redux";
import {startLogin, initLogin} from "../actions/auth";
import { setAccessLevel } from '../actions/profile';
import {startSetChannels} from "../actions/channels";
import {startSetProfile} from "../actions/profile";
import {autologinUser} from '../requests/auth';

export class AutoLogin extends React.Component{
    
    constructor(props) {
        super(props);
        const data = {
            email: this.props.match.params.email,
            password: atob(this.props.match.params.password)
        };
        this.autoLoginSubmit(data);
    }
    state = {
        email: "",
        password: "",
    }    
    
    performLogin = (token) => {
        return this.props.initLogin(token).then(() => {
            this.props.startSetProfile();
            this.props.startSetChannels();
        }).catch(e => {
            this.setState(() => ({loading: false}));
        });
    };

    autoLoginSubmit = (data) => {
        this.setState(() => ({loading: true}));

        autologinUser(data).then(response => {
            if(typeof response.accessToken !== "undefined") {
                this.props.setAccessLevel(response.token.accessLevel);
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
             <div></div>
        );
    }
};

const mapDispatchToProps = (dispatch) => ({
    initLogin: (token) => dispatch(initLogin(token)),
    startLogin: (body, network) => dispatch(startLogin(body, network)),
    startSetProfile: () => dispatch(startSetProfile()),
    startSetChannels: () => dispatch(startSetChannels()),
    setAccessLevel: (accessLevel) => dispatch(setAccessLevel(accessLevel))
});

export default connect(undefined, mapDispatchToProps)(AutoLogin);