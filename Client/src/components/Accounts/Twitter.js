import React from 'react';
import { connect } from 'react-redux';
import TwitterLogin from 'react-twitter-auth';
import SweetAlert from "sweetalert2-react";
import { twitterRequestTokenUrl, twitterAccessTokenUrl } from "../../config/api";
import { startAddTwitterChannel, startSetChannels } from "../../actions/channels";
import channelSelector from "../../selectors/channels";
import { destroyChannel } from "../../requests/channels";
import { logout } from "../../actions/auth";
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
                    if (error.response.status === 403) {
                        this.setForbidden(true);
                        return;
                    }

                    if (error.response.status === 409) {
                        this.setError("This twitter account is already registered from another uniclix account.");
                    }
                    else {
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
                if (typeof e.response !== "undefined" && typeof e.response.data.error !== "undefined") {
                    this.setState(() => ({
                        error: e.response.data.error
                    }));
                    return;
                }
            });
    }

    render() {
        return (
            <div className="">
                <UpgradeAlert isOpen={this.state.forbidden} text={"Your current plan does not support more accounts."} setForbidden={this.setForbidden} />
                <SweetAlert
                    show={!!this.state.action.id}
                    title={`Do you wish to ${this.state.action.type} this item?`}
                    text="To confirm your decision, please click one of the buttons below."
                    showCancelButton
                    type="warning"
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                    onConfirm={() => {
                        if (this.state.action.type === 'delete') {
                            this.remove(this.state.action.id);
                        } else {
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

                <div className="login-container">
                    <div className="col-md-7 col-xs-12 text-center">
                        <div className="col-xs-12 text-center">
                            <div className="box channels-box">
                                <h2>Connect your Twitter account</h2>
                                <h5>Cats woo destroy the blinds. Eat an easter feather as if it were a bird then burp victoriously</h5>


                                <div className="channel-buttons">
                                    <ChannelItems channels={this.props.channels} setAction={this.setAction} />
                                    {!!this.props.loading && <Loader />}
                                    <TwitterLogin loginUrl={twitterAccessTokenUrl}
                                        onFailure={this.onFailure} onSuccess={this.onSuccess}
                                        requestTokenUrl={twitterRequestTokenUrl}
                                        showIcon={true}
                                        forceLogin={true}
                                        className="magento-btn w100 mt-2">
                                        <span className="left-side-label">Continue to Uniclix</span>
                                    </TwitterLogin>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="col-md-5 middleware-side"></div>
                </div>

            </div>
        );
    };
}

const mapStateToProps = (state) => {

    const twitterChannelsFilter = { selected: undefined, provider: "twitter" };
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