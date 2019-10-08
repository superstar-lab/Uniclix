import React from 'react';
import {connect} from 'react-redux';
import TwitterLogin from 'react-twitter-auth';
import Modal from 'react-modal';
import {startSetChannels, startAddFacebookChannel, startAddLinkedinChannel, startAddPinterestChannel, startAddTwitterChannel} from "../actions/channels";
import {getAccounts, saveAccounts} from "../requests/facebook/channels";
import FacebookLogin from 'react-facebook-login';
import {twitterRequestTokenUrl, twitterAccessTokenUrl, backendUrl, facebookAppId, linkedinAppId, pinterestAppId} from "../config/api";
import LinkedInButton from "./LinkedInButton";
import PinterestButton from "./PinterestButton";
import channelSelector, {findAccounts} from "../selectors/channels";
import {fbFields, fbScope} from "./FacebookButton";
import Loader from "./Loader";


class ActiveChecker extends React.Component{

    state = {
        active: true,
        error: false,
        loading: true
    }

    componentDidMount() {
        this.setState(() => ({
            active: this.props.selectedChannel ? this.props.selectedChannel.active : false,
            loading: false
        }));
    }

    componentDidUpdate(prevProps) {
        if(prevProps.selectedChannel !== this.props.selectedChannel){
            this.setState(() => ({
                active: this.props.selectedChannel ? this.props.selectedChannel.active : false
            }));
        }
    }

    onFailure = (response) => {
        this.setState(() => ({loading: false}));
    };

    onTwitterSuccess = (response) => {
        this.setState(() => ({loading: true}));

        try{
            response.json().then(body => {
                this.props.startAddTwitterChannel(body.oauth_token, body.oauth_token_secret)
                .then(response => {
                    this.setState(() => ({loading: false}));
                }).catch(error => {
                    this.setState(() => ({loading: false}));
                });
            });
        }catch(e){}
    };

    onFacebookSuccess = (response) => {
        try{
            this.setState(() => ({loading: true}));
            const accountId = this.props.selectedChannel.details.original_id;
            this.props.startAddFacebookChannel(response.accessToken).then(() => {

                if(this.props.selectedChannel.account_type == "profile"){
                    this.setState(() => ({loading: false}));
                    return;
                }else{
                    getAccounts().then((response) => {
                        const accounts = findAccounts(response, {prop: accountId});
            
                        if(accounts.length){
                            saveAccounts(accounts)
                            .then(() => {
                                this.props.startSetChannels();
                                this.setState(() => ({loading: false}));
                            }).catch( error => {
                                this.setState(() => ({
                                    error: "Something went wrong!",
                                    loading: false
                                }));
                            });
                        }
                    });
                }


            }).catch(error => {
                this.setState(() => ({loading: false}));
            });
        }catch(e){
            this.setState(() => ({loading: false}));
        }

    };

    onLinkedInSuccess = (response) => {
        try{
            this.setState(() => ({loading: true}));
            this.props.startAddLinkedinChannel(response.accessToken).then(() => {
                this.setState(() => ({loading: false}));
            }).catch(error => {
                this.setState(() => ({loading: false}));
            });
        }catch(e){
            this.setState(() => ({loading: false}));
        }
    };

    onPinterestSuccess = (response) => {
        try{
            this.setState(() => ({loading: true}));
            this.props.startAddPinterestChannel(response.accessToken).then(() => {
                this.setState(() => ({loading: false}));
            }).catch(error => {
                this.setState(() => ({loading: false}));
            });
        }catch(e){
            this.setState(() => ({loading: false}));
        }
    };

    render(){

        const {selectedChannel} = this.props; 

        const LoginButton = () => {
            if(selectedChannel.type == "twitter"){
                return (
                        <TwitterLogin loginUrl={twitterAccessTokenUrl}
                                    onFailure={this.onFailure} onSuccess={this.onTwitterSuccess}
                                    requestTokenUrl={twitterRequestTokenUrl}
                                    showIcon={false}
                                    forceLogin={true}
                                    >
                        </TwitterLogin>
                        );
            }else if(selectedChannel.type == "facebook"){
               return (
                    <FacebookLogin
                    appId={facebookAppId}
                    autoLoad={false}
                    fields={fbFields}
                    scope={fbScope}
                    callback={this.onFacebookSuccess} 
                    disableMobileRedirect={true}
                    />
               );
            }else if(selectedChannel.type == "linkedin"){
                return (
                    <LinkedInButton 
                        clientId={linkedinAppId}
                        redirectUri={`${backendUrl}/api/linkedin/callback`}
                        onSuccess={this.onLinkedInSuccess}
                        onError={this.onFailure}
                    />
                );
             }else if(selectedChannel.type == "pinterest"){
                return (
                    <PinterestButton 
                    clientId={pinterestAppId}
                    redirectUri={`${backendUrl}/api/pinterest/callback`}
                    onSuccess={this.onPinterestSuccess}
                    onError={this.onFailure}
                    />
                );
             }else{
                 return (
                     <div className="social-login">
                        <TwitterLogin loginUrl={twitterAccessTokenUrl}
                            onFailure={this.onFailure} onSuccess={this.onTwitterSuccess}
                            requestTokenUrl={twitterRequestTokenUrl}
                            showIcon={false}
                            forceLogin={true}
                            >
                        </TwitterLogin>
                        <FacebookLogin
                            appId={facebookAppId}
                            autoLoad={false}
                            fields={fbFields}
                            scope={fbScope}
                            callback={this.onFacebookSuccess} 
                            disableMobileRedirect={true}
                        />
                        <LinkedInButton 
                            clientId={linkedinAppId}
                            redirectUri={`${backendUrl}/api/linkedin/callback`}
                            onSuccess={this.onLinkedInSuccess}
                            onError={this.onFailure}
                        />
                        <PinterestButton 
                            clientId={pinterestAppId}
                            redirectUri={`${backendUrl}/api/pinterest/callback`}
                            onSuccess={this.onPinterestSuccess}
                            onError={this.onFailure}
                        />
                    </div>);
             }
        };

        return (
            <div className="active-checker">
                {this.props.channels.length > 0 && 
                <Modal
                isOpen={!!this.state.active == false && !this.state.loading && !this.state.channelsLoading}
                ariaHideApp={false}
                >       

                    <div className="form-group flex_container-center center-inline">
                        {this.state.loading && <Loader />}
                        {this.props.channels.length ?
                            <div>
                                <h3>Reconnect Social Networks</h3>
                                <p> Social networks need to be reconnected in UniClix for a variety of reasons, such as software updates or password changes. Reconnect your {selectedChannel.type} Account
                                </p>
                            </div>
                            :
                            <div>
                            <h3>Let's connect!</h3>
                                <p> In order to use Uniclix features, you need to connect at least one social account.
                                </p>
                            </div>
                        }
                        

                    </div>
                    <div className="center-inline top-border p10 m10-top social-login">
                        <LoginButton />
                        {!!this.props.loading && <Loader />}
                    </div>

                </Modal>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const filter = {selected: 1, provider: undefined};
    const selectedChannel = channelSelector(state.channels.list, filter);

    return {
        channels: state.channels.list,
        channelsLoading: state.channels.loading,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels()),
    startAddFacebookChannel: (token) => dispatch(startAddFacebookChannel(token)),
    startAddTwitterChannel: (token, secret) => dispatch(startAddTwitterChannel(token, secret)),
    startAddLinkedinChannel: (token) => dispatch(startAddLinkedinChannel(token)),
    startAddPinterestChannel: (token) => dispatch(startAddPinterestChannel(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChecker);