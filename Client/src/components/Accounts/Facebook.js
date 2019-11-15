import React from 'react';
import {connect} from 'react-redux';
import SweetAlert from "sweetalert2-react";
import FacebookButton from '../FacebookButton';
import SelectAccountsModal from './SelectAccountsModal';
import {facebookAppId} from "../../config/api";
import {startAddFacebookChannel, startSetChannels} from "../../actions/channels";
import channelSelector from "../../selectors/channels";
import {destroyChannel} from "../../requests/channels";
import {getAccounts, saveAccounts} from "../../requests/facebook/channels";
import {logout} from "../../actions/auth";
import Loader from "../../components/Loader";
import ChannelItems from "./ChannelItems";
import UpgradeAlert from "../UpgradeAlert";

class Facebook extends React.Component {
    constructor(props) {
        super(props);
    }

    defaultAction = {
        id: "",
        type: ""
    };

    state = {
        action: this.defaultAction,
        accountsModal: false,
        accounts: [],
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
        if(response){
            this.props.startAddFacebookChannel(response.accessToken)
            .then(() => {
                getAccounts().then((response) => {

                    if(response.length){
                        this.setState(() => ({
                            accounts: response,
                            accountsModal: true
                        }));
                    }
                });
            }).catch(error => {
                if(error.response.status === 403){
                    this.setForbidden(true);
                    return;
                }               
                
                if(error.response.status === 409){
                    this.setError("This facebook account is already registered from another uniclix account.");
                }
                else{
                    this.setError("Something went wrong!");
                }
            });
        }
    };

    onSave = (accounts) => {
        this.setState(() => ({
            error: ""
        }));
        saveAccounts(accounts)
        .then(() => {
            this.props.startSetChannels();
            this.toggleAccountsModal();
        }).catch( error => {
            if(error.response.status === 403){
                this.setForbidden(true);
            }else{
                this.setError("Something went wrong!");
            }
        });
    };

    toggleAccountsModal = () => {
        this.setState(() => ({
            accountsModal: !this.state.accountsModal
        }));
    }

    remove = (id) => {
        destroyChannel(id)
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

                <div className="">
                    <div className="col-xs-7 text-center">
                    <div class="col-xs-12 text-center">
                            <div className="">
                                <div className="">
                                    <h2>Connect your Facebook account</h2>
                                    <p>Cats woo destroy the blinds. Eat an easter feather as if it were a bird then burp victoriously</p>
                                </div>

                                <ChannelItems channels={this.props.channels} setAction={this.setAction} />
                                {!!this.props.loading && <Loader />}
                            </div>

                            <div className="">
                            <FacebookButton
                                appId={facebookAppId}
                                onSuccess={this.onSuccess}
                                icon={<i className="fa fa-plus"></i>}
                                cssClass="add-channel-plus-btn"
                                textButton="" />
                            <span className="left-side-label">Have an account? Let's connect!</span>
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

    const facebookChannelsFilter = {selected: undefined, provider: "facebook"};
    const channels = channelSelector(state.channels.list, facebookChannelsFilter);
    return {
        channels,
        loading: state.channels.loading
    };
};

const mapDispatchToProps = (dispatch) => ({
    startAddFacebookChannel: (accessToken) => dispatch(startAddFacebookChannel(accessToken)),
    startSetChannels: () => dispatch(startSetChannels()),
    logout: () => dispatch(logout())
});


export default connect(mapStateToProps, mapDispatchToProps)(Facebook);