import React from 'react';
import {connect} from 'react-redux';
import TwitterLogin from 'react-twitter-auth';
import SweetAlert from "sweetalert2-react";
import {twitterRequestTokenUrl, twitterAccessTokenUrl} from "../../config/api";
import {startAddTwitterChannel, startSetChannels} from "../../actions/channels";
import channelSelector from "../../selectors/channels";
import {destroyChannel} from "../../requests/channels";
import {logout} from "../../actions/auth";
import Loader from "../../components/Loader";
import ChannelItems from "./ChannelItems";
import UpgradeAlert from "../UpgradeAlert";

class Twitter extends React.Component {
    constructor(props) {
        super(props);
    }

    defaultAction = {
        id: "",
        type: ""
    };

    state = {
        action: this.defaultAction,
        error: "",
        forbidden: false
    }

    setAction = (action = this.defaultAction) => {
        this.setState(() => ({
            action
        }));
    }

    onFailure = (response) => {
        console.log(response);
    };

    setError = (error) => {
        this.setState(() => ({
            error
        }));
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden
        }));
    };

    onSuccess = (response) => {
        response.json().then(body => {
            this.props.startAddTwitterChannel(body.oauth_token, body.oauth_token_secret)
            .catch(error => {
                if(error.response.status === 403){
                    this.setForbidden(true);
                    return;
                }

                if(error.response.status === 409){
                    this.setError("This twitter account is already registered from another uniclix account.");
                }
                else{
                    this.setError("Something went wrong!");
                }
            });
        });
    };

    remove = (id) => {
        return destroyChannel(id)
        .then((response) => {
            this.props.startSetChannels()
            .then((response) => {
                // if(response.length < 1){
                //     this.props.logout();
                // }
            });
        }).catch((e) => {
            if(typeof e.response !== "undefined" && typeof e.response.data.error !== "undefined"){
                this.setState(() => ({
                    error: e.response.data.error
                }));
                return;
            }
        });
    }

    render(){
        return (
            <div className="accounts-container">
            <UpgradeAlert isOpen={this.state.forbidden} text={"Your current plan does not support more accounts."} setForbidden={this.setForbidden}/>
                <SweetAlert
                    show={!!this.state.action.id}
                    title={`Do you wish to ${this.state.action.type} this item?`}
                    text="To confirm your decision, please click one of the buttons below."
                    showCancelButton
                    type="warning"
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                    onConfirm={() => {
                        if(this.state.action.type === 'delete'){
                            this.remove(this.state.action.id);
                        }else{
                            console.log('something went wrong');
                        }
                        //this.setAction();
                    }}
                />

                <SweetAlert
                    show={!!this.state.error}
                    title={`Error`}
                    text={this.state.error}
                    type="error"
                    confirmButtonText="Ok"
                    cancelButtonText="No"
                    onConfirm={() => {
                        this.setError("");
                    }}
                />

                <h2>HAVE TWITTER ACCOUNTS?</h2>
                <p>Connect them all, and we'll help you get the right audience.</p>
                
                <div className="flex_container-center">
                    <div className="accounts-container__logo col-md-1">
                        <div>
                            <i className="fa fa-twitter"></i>
                        </div>
                    </div>
                    <div className="accounts-container__content col-md-10">
                        <div className="accounts-container__content__wrapper">
                            <div className="accounts-container__content__wrapper__heading">
                                <h2>Let's grow your audience using Twitter!</h2>
                            </div> 
                            
                            <ChannelItems channels={this.props.channels} setAction={this.setAction} /> 
                            {!!this.props.loading && <Loader />}
                        </div> 
            
                        <div className="accounts-container__content__wrapper__footer">
                            <TwitterLogin loginUrl={twitterAccessTokenUrl}
                                        onFailure={this.onFailure} onSuccess={this.onSuccess}
                                        requestTokenUrl={twitterRequestTokenUrl}
                                        showIcon={true}
                                        forceLogin={true}
                                        className="add-channel-plus-btn">
                                        <i className="fa fa-plus"></i>
                            </TwitterLogin>
                            <span className="left-side-label">Have an account? Let's connect!</span>
                        </div> 
                    </div>
                </div>
              
            </div>
        );
    };
} 

const mapStateToProps = (state) => {

    const twitterChannelsFilter = {selected: undefined, provider: "twitter"};
    const channels = channelSelector(state.channels.list, twitterChannelsFilter);
    return {
        channels,
        loading: state.channels.loading
    };
};

const mapDispatchToProps = (dispatch) => ({
    startAddTwitterChannel: (accessToken, accessTokenSecret) => dispatch(startAddTwitterChannel(accessToken, accessTokenSecret)),
    startSetChannels: () => dispatch(startSetChannels()),
    logout: () => dispatch(logout())
});


export default connect(mapStateToProps, mapDispatchToProps)(Twitter);