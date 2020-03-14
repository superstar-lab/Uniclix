import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setMiddleware } from '../actions/middleware';
import TwitterLogin from 'react-twitter-auth';
import Modal from './Modal';
import SelectAccountsModal from './Accounts/SelectAccountsModal';
import { startSetChannels, startAddFacebookChannel, startAddLinkedinChannel, startAddPinterestChannel, startAddTwitterChannel } from "../actions/channels";
import { startSetProfile } from "../actions/profile";
import { getAccounts, saveAccounts } from "../requests/facebook/channels";
import FacebookLogin from 'react-facebook-login';
import { twitterRequestTokenUrl, twitterAccessTokenUrl, backendUrl, facebookAppId, linkedinAppId, pinterestAppId } from "../config/api";
import LinkedInButton from "./LinkedInButton";
import { changePlan, activateAddon, cancelAddon, getPlanData } from '../requests/billing';
// import PinterestButton from "./PinterestButton";
import channelSelector, { findAccounts } from "../selectors/channels";
import { fbFields, fbScope } from "./FacebookButton";
import { destroyChannel } from "../requests/channels";
import Loader, { LoaderWithOverlay } from './Loader';
import { getParameterByName } from "../utils/helpers";
import Checkout from "./Settings/Sections/Checkout";
import ChannelItems from "./Accounts/ChannelItems";
import {getPages, savePages} from "../requests/linkedin/channels";

class Middleware extends React.Component {
    state = {
        bussinesModal: false,
        bussinesPages: [],
        twitterBooster: this.props.location.search.indexOf('twitter-booster') != -1,
        billingPeriod: getParameterByName("period", this.props.location.search) || "annually",
        plan: getParameterByName("plan", this.props.location.search),
        addon: getParameterByName("addon", this.props.location.search),
        addonTrial: getParameterByName("addontrial", this.props.location.search),
        allPlans: [],
        loading: false,
        forbidden: false,
        addAccounts: ""
    }

    twitterRef = React.createRef();
    facebookRef = React.createRef();
    linkedinRef = React.createRef();

    componentDidMount() {
        const { profile } = this.props;

        if ((this.state.plan || this.state.addon) && !!profile && !profile.subscription.activeSubscription && !profile.addon.activeAddon) {
            this.props.setMiddleware("billing");
            getPlanData().then(response => {
                this.setState({
                    allPlans: response.allPlans
                });
            });
            return;
        }

        const middleware = this.props.channels.length < 1;

        if (!middleware) {
            this.props.setMiddleware(false);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.profile.subscription !== this.props.profile.subscription || prevProps.profile.addon !== this.props.profile.addon) {
            if ((this.state.plan || this.state.addon) && !this.props.profile.subscription.activeSubscription && !this.props.profile.addon.activeAddon && !this.state.addonTrial) {
                this.props.setMiddleware("billing");
                return;
            } else {
                if (this.props.channels.length < 1) {
                    this.props.setMiddleware("channels");
                    return;
                }

                this.props.setMiddleware(false);
            }
        }
    }

    defaultAction = {
        id: "",
        type: ""
    };


    onFailure = (response) => {
        this.setState(() => ({ loading: false }));
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden
        }));
    };

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    };

    setRole = () => {
        let plan = getParameterByName("plan", this.props.location.search);
        let addon = getParameterByName("addon", this.props.location.search);
        this.setState(() => ({ loading: true }));

        if (plan) {
            changePlan(plan).then(response => {
                this.props.startSetProfile().then(() => {
                    this.setState(() => ({ loading: false }));
                    this.props.setMiddleware(false);
                });
            }).then()
                .catch(error => {
                    if (error.response.status === 403) {
                        this.setState(() => ({
                            forbidden: true,
                            error: error.response.data.error,
                            redirect: error.response.data.redirect
                        }))
                    } else {
                        this.setError("Something went wrong!");
                    }
                });

            return;
        }

        if (addon) {
            activateAddon(addon).then(response => {
                this.props.startSetProfile();
            });

            return;
        }

        this.props.startSetProfile().then(() => {
            this.setState(() => ({ loading: false }));
            this.props.setMiddleware(false);
        });
    };

    onTwitterSuccess = (response) => {
        this.setState(() => ({ loading: true }));

        try {
            response.json().then(body => {
                this.props.startAddTwitterChannel(body.oauth_token, body.oauth_token_secret)
                    .then(response => {
                        this.setState(() => ({ loading: false, addAccounts: "twitter" }));
                    }).catch(error => {
                        this.setState(() => ({ loading: false }));
                        if (error.response.status === 409) {
                            Modal({
                                type: 'error',
                                title: 'Error',
                                content: 'This account is currently being used by other Uniclix users, please contact our helpdesk support for additional details'
                            });
                        } else {
                            Modal({
                                type: 'error',
                                title: 'Error',
                                content: 'Something went wrong!'
                            });
                        }
                    });
            });
        } catch (e) {
        }
    };

    onFacebookSuccess = (response) => {
        try {
            this.setState(() => ({ loading: true }));
            if (response) {
                this.props.startAddFacebookChannel(response.accessToken)
                    .then(() => {
                        this.setState(() => ({ loading: true }));
                        getAccounts().then((response) => {

                            if (response.length) {
                                this.setState(() => ({
                                    bussinesPages: response,
                                    bussinesModal: true,
                                    loading: false,
                                    addAccounts: 'facebook'
                                }));
                            }
                        });
                    }).catch(error => {
                        this.setState(() => ({ loading: false }));
                        if (error.response.status === 403) {
                            this.setForbidden(true);
                            return;
                        }

                        if (error.response.status === 409) {
                            Modal({
                                type: 'error',
                                title: 'Error',
                                content: 'This account is currently being used by other Uniclix users, please contact our helpdesk support for additional details'
                            });
                        } else {
                            Modal({
                                type: 'error',
                                title: 'Error',
                                content: 'Something went wrong!'
                            });
                        }
                    });
            }
        } catch (e) {
            this.setState(() => ({ loading: false }));
        }

    };

    onBussinesPagesSave = (accounts) => {
        this.setState(() => ({
            error: "",
            loading: true
        }));
        
        if(this.state.addAccounts == 'linkedin'){
            savePages(accounts).then(() => {
                this.setState(() => ({ loading: false}));
                this.props.startSetChannels();
                this.togglebussinesModal();
            }).catch(error => {
                this.setState(() => ({ loading: false }));
                if (error.response.status === 403) {
                    this.setForbidden(true);
                } else {
                    this.setError("Something went wrong!");
                }
            });
        }else{
        saveAccounts(accounts).then(() => {
            this.setState(() => ({ loading: false}));
            this.props.startSetChannels();
            this.togglebussinesModal();
        }).catch(error => {
            this.setState(() => ({ loading: false }));
            if (error.response.status === 403) {
                this.setForbidden(true);
            } else {
                this.setError("Something went wrong!");
            }
        });
    }
            
    };

    setAction = (action = this.defaultAction) => {
        this.setState(() => ({
            action
        }));
    }

    togglebussinesModal = () => {
        this.setState(() => ({
            bussinesModal: !this.state.bussinesModal
        }));
    }

    onLinkedInSuccess = (response) => {
        try {
            this.setState(() => ({ loading: true }));
            this.props.startAddLinkedinChannel(response.accessToken).then(() => {
                this.setState(() => ({ addAccounts: "linkedin" }));
                getPages().then((response) =>{
                    if(response.length){
                        this.setState(() => ({
                            bussinesPages: response,
                            bussinesModal: true,
                            addAccounts: "linkedin",
                            loading: false
                        }));
                    }
                });
            }).catch(error => {
                this.setState(() => ({ loading: false }));
                if (error.response.status === 409) {
                    Modal({
                        type: 'error',
                        title: 'Error',
                        content: 'This account is currently being used by other Uniclix users, please contact our helpdesk support for additional details'
                    });
                } else {
                    Modal({
                        type: 'error',
                        title: 'Error',
                        content: 'Something went wrong!'
                    });
                }
            });
        } catch (e) {
            this.setState(() => ({ loading: false }));
        }
    };

    onPinterestSuccess = (response) => {
        try {
            this.setState(() => ({ loading: true }));
            this.props.startAddPinterestChannel(response.accessToken).then(() => {
                this.setState(() => ({ loading: false, addAccounts: "pinterest"}));
            }).catch(error => {
                this.setState(() => ({ loading: false }));
                if (error.response.status === 403) {
                    this.setForbidden(true);
                } else {
                    this.setError("Something went wrong!");
                }
            });
        } catch (e) {
            this.setState(() => ({ loading: false }));
        }
    };

    setBillingPeriod = () => {
        this.setState(() => ({ billingPeriod: this.state.billingPeriod === "annually" ? "monthly" : "annually" }));
    };

    remove = (id) => {
        this.setState(() => ({ loading: true }));
        return destroyChannel(id)
            .then((response) => {
                this.setState(() => ({ loading: false }));
                this.props.startSetChannels()
                    .then((response) => {
                        // if(response.length < 1){
                        //     this.props.logout();
                        // }
                    });
            }).catch((e) => {
                this.setState(() => ({ loading: false }));
                if (typeof e.response !== "undefined" && typeof e.response.data.error !== "undefined") {
                    this.setState(() => ({
                        error: e.response.data.error
                    }));
                    return;
                }
            });
    }

    renderTypeaccounts(param) {
        return (
            <div className="channel-buttons">
                <ChannelItems channels={[param]} setAction={()=>this.remove(param.id)} />
                {!!this.props.loading && <Loader />}
            </div>
        )
      }

    renderTypeLoginAccounts(param) {
        switch(param) {
          case 'twitter':
            return (
                <div className="channel-buttons">
                   <TwitterLogin 
                        loginUrl={twitterAccessTokenUrl}
                        onFailure={this.onFailure} 
                        onSuccess={this.onTwitterSuccess}
                        requestTokenUrl={twitterRequestTokenUrl}
                        showIcon={false}
                        forceLogin={true}
                        className="hide"
                        ref={this.twitterRef}
                        >
                    </TwitterLogin>  
                    <button 
                        className="col-md-12 twitter-middleware-btn" 
                        onClick={(e) => this.twitterRef.current.onButtonClick(e)}> 
                        <i className="fab fa-twitter"></i> Add Another Account</button>
                </div>
            );
        case 'facebook':
            return(
            <FacebookLogin
                appId={facebookAppId}
                autoLoad={false}
                fields={fbFields}
                scope={fbScope}
                callback={this.onFacebookSuccess} 
                cssClass="col-md-12 twitter-middleware-btn"
                icon={<i className="fab fa-facebook"></i>}
                textButton="Connect my Facebook Account"
                ref={this.facebookRef}
                disableMobileRedirect={true}
            />);
        case 'linkedin':
            return(
            <LinkedInButton 
                clientId={linkedinAppId}
                redirectUri={`${backendUrl}/api/linkedin/callback`}
                onSuccess={this.onLinkedInSuccess}
                onError={this.onFailure}
                cssClass="col-md-12 twitter-middleware-btn"
                icon={<i className="fab fa-linkedin"></i>}
                countLinkedLinkedinAcc
                textButton={"Connect my Linkedin Account"}
                ref={this.linkedinRef}
            />
            )
        default:
            return 'foo';
        }
    }

    showAllChannels = ()=>{
        this.setState({addAccounts: ""})
    }

    render() {
        const { middleware, channels } = this.props;
        const { loading, allPlans, addon, addonTrial, addAccounts, bussinesModal, bussinesPages } = this.state;
        let planParam = getParameterByName("plan", this.props.location.search);
        let planData = allPlans.filter(plan => plan["Name"].toLowerCase() === planParam);
        planData = planData.length > 0 ? planData[0] : false;
        let planName = "";
        if (planData) {
            planName = this.state.billingPeriod === "annually" ? planData["Name"].toLowerCase() + "_annual" : planData["Name"].toLowerCase();
        }

        let countLinkedFacebookAcc = channels.length > 0 ? channels.filter(item => item.type == 'facebook').length : 0
        let countLinkedTwitterAcc = channels.length  > 0 ? channels.filter(item => item.type == 'twitter').length : 0
        let countLinkedLinkedinAcc = channels.length  > 0 ? channels.filter(item => item.type == 'linkedin').length : 0
        return (
            <div className="login-container">
                <div className="logo">
                    <img src="/images/uniclix.png" />
                </div>
                
                {this.state.loading && <LoaderWithOverlay />}
                <div className="col-md-7 col-xs-12 text-center">
                    <div className="col-xs-12 text-center">
                        <SelectAccountsModal 
                            isOpen={bussinesModal} 
                            accounts={bussinesPages}
                            onSave={this.onBussinesPagesSave}
                            error={this.state.error}
                            closeModal={this.togglebussinesModal}
                        />
                        {middleware !== "channels" && middleware !== "billing" && <Loader />}
                        {loading && <LoaderWithOverlay />}
                        
                        {middleware == "channels" &&
                            <div className="box channels-box">
                                {channels.length > 0 && addAccounts.length > 0 
                                ? 
                                <div className="">  
                                    <div className="channel-profiles">
                                        <h2>Connected your <span className="capitalized-text">{addAccounts}</span> account</h2>
                                        <h5>Cats who destroy birds. Eat an easter feather as if it were a bird then burp victoriously</h5>
                                            
                                        {channels.map(channel => {
                                            if(addAccounts == channel.type ){
                                            return(
                                            <div key={channel.id} className="channel-profile-box col-xs-12">
                                                {this.renderTypeaccounts(channel)}                                        
                                            </div> 
                                             )}
                                            })}
                                        {this.renderTypeLoginAccounts(addAccounts)}
                                        <button className="magento-btn mt50" onClick={()=>this.showAllChannels()}>Continue</button>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div className="header-title">
                                        {middleware !== "loading" && <h2>Connect your accounts</h2>}
                                        <h5>Click one of the buttons below to get started:</h5>
                                    </div>
                                    <div className="channel-buttons">
                                        <FacebookLogin
                                            appId={facebookAppId}
                                            autoLoad={false}
                                            fields={fbFields}
                                            scope={fbScope}
                                            callback={this.onFacebookSuccess} 
                                            cssClass="col-md-12 twitter-middleware-btn"
                                            icon={<i className="fab fa-facebook"></i>}
                                            textButton={countLinkedFacebookAcc ? countLinkedFacebookAcc + " Connected Facebook Accounts. Add more" : "Connect my Facebook Account"}
                                            ref={this.facebookRef}
                                            disableMobileRedirect={true}
                                        />

                                        <button 
                                        className="col-md-12 twitter-middleware-btn" 
                                        onClick={(e) => this.twitterRef.current.onButtonClick(e)}> 
                                        <i className="fab fa-twitter"></i>
                                        {countLinkedTwitterAcc ? countLinkedTwitterAcc + " connected Twitter Accounts. Add more" : "Connect my Twitter Account"}
                                        </button>

                                        <LinkedInButton 
                                            clientId={linkedinAppId}
                                            redirectUri={`${backendUrl}/api/linkedin/callback`}
                                            onSuccess={this.onLinkedInSuccess}
                                            onError={this.onFailure}
                                            cssClass="col-md-12 twitter-middleware-btn"
                                            icon={<i className="fab fa-linkedin"></i>}
                                            countLinkedLinkedinAcc
                                            textButton={countLinkedLinkedinAcc ? countLinkedLinkedinAcc + " Connected Linkedin Accounts. Add more" : "Connect my Linkedin Account"}
                                            ref={this.linkedinRef}
                                        />

                                        <TwitterLogin loginUrl={twitterAccessTokenUrl}
                                            onFailure={this.onFailure} onSuccess={this.onTwitterSuccess}
                                            requestTokenUrl={twitterRequestTokenUrl}
                                            showIcon={false}
                                            forceLogin={true}
                                            className="hide"
                                            ref={this.twitterRef}
                                        ></TwitterLogin>
                                        { channels.length > 0  ?
                                            <button className="magento-btn mt50" onClick={this.setRole}>Connect and continue</button>
                                            :
                                            <button className="magento-btn mt50 disabled-btn">Connect and continue</button> }
                                    </div>
                                </div>
                            }
                        <div>
                    </div>
                </div>
            }
        </div>
        {middleware == "billing" && !!planData ?
            <div className="box billing channels-box">
                    <div className="col-md-12">
                        <h5>Select Your Billing Cycle</h5>
                    </div>
                    
                    <div className="plan-box col-md-6 col-xs-12">
                        <div className={`billingPeriodSelection col-md-12 ${this.state.billingPeriod === 'annually' && 'selected'}`}>

                            <label className="custom-radio-container">Annually
                                
                                <input type="radio" name="billingPeriod" checked={this.state.billingPeriod === "annually" ? "checked" : false} onChange={() => this.setBillingPeriod("annually")}/>
                            
                                <span className="checkmark"></span>
                            </label>

                            <p>${parseFloat(planData["Annual Billing"] / 12).toFixed(1)} / month</p>
                            <p>Billing annually for ${parseFloat(planData["Annual Billing"]).toFixed(1)}</p>
                        </div>
                    </div>
                    <div className="plan-box col-md-6 col-xs-12">
                        <div className={`billingPeriodSelection col-md-12 ${this.state.billingPeriod === 'monthly' && 'selected'}`}>

                            <label className="custom-radio-container">Monthly
                                
                                <input type="radio" name="billingPeriod" checked={this.state.billingPeriod === "monthly" ? "checked" : false} onChange={() => this.setBillingPeriod("monthly")}/>
                            
                                <span className="checkmark"></span>
                            </label>

                            <p>${parseFloat(planData["Monthly"]).toFixed(1)} / month</p>
                            <p>Billing monthly for ${parseFloat(planData["Monthly"]).toFixed(1)}</p> 
                        </div>
                    </div>

                    {!!planData && 
                    <Checkout 
                        plan={planName} 
                        subType="main" 
                        trialDays={30} 
                        setLoading={this.setLoading} 
                        setProfile={this.props.startSetProfile} 
                        text="">
                        <button className="magento-btn mt50">Proceed to Checkout</button>    
                    </Checkout>}
                    
                </div>
                : this.state.loading && <LoaderWithOverlay />
                }

                {middleware == "billing" && addon ?
                <div className="box billing channels-box">

                    <div className="col-md-12">
                        <h5>Twitter Growth</h5>
                    </div>
                    <div className="plan-box col-md-12 col-xs-12">
                        <div className={`billingPeriodSelection col-md-12 ${this.state.billingPeriod === 'monthly' && 'selected'}`}>

                            <label className="custom-radio-container">{`${!!addonTrial ? 'Free trial period of 3 days' : 'Monthly'}`}
                                
                                <input type="radio" name="billingPeriod" checked={true} onChange={() => this.setBillingPeriod("monthly")}/>
                            
                                <span className="checkmark"></span>
                            </label>

                            <p>{`${!!addonTrial ? '3 days free trial' : '$10.0 / month'}`}</p>
                            <p>Billing monthly for {!!addonTrial ? '$0.0 (3 days free trial)' : '$10.0'}</p> 
                        </div>
                    </div>

                    {!!addon && !(!!addonTrial) ? 
                        <Checkout 
                            plan="twitter_growth" 
                            subType="addon" 
                            trialDays={3} 
                            setLoading={this.setLoading} 
                            setProfile={this.props.startSetProfile} 
                            text="">
                            <button className="magento-btn mt50">Proceed to Checkout</button>    
                        </Checkout> : <button className="magento-btn mt50" onClick={this.setRole}>Continue</button>  

                    }
                </div> : this.state.loading && <LoaderWithOverlay />

                }
                </div>
                <div className="col-md-5 middleware-side">
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const filter = { selected: 1, provider: undefined };
    const selectedChannel = channelSelector(state.channels.list, filter);


    return {
        middleware: state.middleware.step,
        channels: state.channels.list,
        profile: state.profile,
        selectedChannel
    }
};

const mapDispatchToProps = (dispatch) => ({
    setMiddleware: (middleware) => dispatch(setMiddleware(middleware)),
    startSetChannels: () => dispatch(startSetChannels()),
    startAddFacebookChannel: (token) => dispatch(startAddFacebookChannel(token)),
    startAddTwitterChannel: (token, secret) => dispatch(startAddTwitterChannel(token, secret)),
    startAddLinkedinChannel: (token) => dispatch(startAddLinkedinChannel(token)),
    startAddPinterestChannel: (token) => dispatch(startAddPinterestChannel(token)),
    startSetProfile: () => dispatch(startSetProfile())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Middleware));