import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setMiddleware } from '../actions/middleware';
import TwitterLogin from 'react-twitter-auth';
import SelectAccountsModal from './Accounts/SelectAccountsModal';
import { startSetChannels, startAddFacebookChannel, startAddLinkedinChannel, startAddPinterestChannel, startAddTwitterChannel } from "../actions/channels";
import { startSetProfile } from "../actions/profile";
import { getAccounts, saveAccounts } from "../requests/facebook/channels";
import FacebookLogin from 'react-facebook-login';
import { twitterRequestTokenUrl, twitterAccessTokenUrl, backendUrl, facebookAppId, linkedinAppId, pinterestAppId } from "../config/api";
import LinkedInButton from "./LinkedInButton";
import { changePlan, activateAddon, cancelAddon, getPlanData } from '../requests/billing';
import PinterestButton from "./PinterestButton";
import channelSelector, { findAccounts } from "../selectors/channels";
import { fbFields, fbScope } from "./FacebookButton";
import { destroyChannel } from "../requests/channels";
import Loader, { LoaderWithOverlay } from './Loader';
import UpgradeAlert from "./UpgradeAlert";
import { getParameterByName } from "../utils/helpers";
import Checkout from "./Settings/Sections/Checkout";

class Middleware extends React.Component {

    state = {
        continueBtn: this.props.channels.length > 0,
        facebookPagesModal: false,
        facebookPages: [],
        twitterBooster: this.props.location.search.indexOf('twitter-booster') != -1,
        billingPeriod: getParameterByName("period", this.props.location.search) || "annually",
        plan: getParameterByName("plan", this.props.location.search),
        addon: getParameterByName("addon", this.props.location.search),
        addonTrial: getParameterByName("addontrial", this.props.location.search),
        allPlans: [],
        loading: false,
        forbidden: false
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
        if (prevProps.channels !== this.props.channels) {
            this.setState(() => ({
                continueBtn: this.props.channels.length > 0
            }));
        }

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
                        this.setState(() => ({ loading: false }));
                    }).catch(error => {
                        this.setState(() => ({ loading: false }));
                        if (error.response.status === 403) {
                            this.setForbidden(true);
                        } else {
                            this.setError("Something went wrong!");
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
                this.setState(() => ({ loading: false }));
                this.props.startAddFacebookChannel(response.accessToken)
                    .then(() => {
                        this.setState(() => ({ loading: true }));
                        getAccounts().then((response) => {

                            if (response.length) {
                                this.setState(() => ({
                                    facebookPages: response,
                                    facebookPagesModal: true,
                                    loading: false
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
                            this.setError("This facebook account is already registered from another uniclix account.");
                        }
                        else {
                            this.setError("Something went wrong!");
                        }
                    });
            }
        } catch (e) {
            console.log(e);
            this.setState(() => ({ loading: false }));
        }

    };

    onFacebookPagesSave = (accounts) => {
        this.setState(() => ({
            error: "",
            loading: true
        }));
        saveAccounts(accounts)
            .then(() => {
                this.setState(() => ({ loading: false }));
                this.props.startSetChannels();
                this.toggleFacebookPagesModal();
            }).catch(error => {
                this.setState(() => ({ loading: false }));
                if (error.response.status === 403) {
                    this.setForbidden(true);
                } else {
                    this.setError("Something went wrong!");
                }
            });
    };

    toggleFacebookPagesModal = () => {
        this.setState(() => ({
            facebookPagesModal: !this.state.facebookPagesModal
        }));
    }

    onLinkedInSuccess = (response) => {
        try {
            this.setState(() => ({ loading: true }));
            this.props.startAddLinkedinChannel(response.accessToken).then(() => {
                this.setState(() => ({ loading: false }));
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

    onPinterestSuccess = (response) => {
        try {
            this.setState(() => ({ loading: true }));
            this.props.startAddPinterestChannel(response.accessToken).then(() => {
                this.setState(() => ({ loading: false }));
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

    render() {
        const { middleware, channels } = this.props;
        const { continueBtn, loading, twitterBooster, allPlans, addon, addonTrial } = this.state;
        let planParam = getParameterByName("plan", this.props.location.search);
        let planData = allPlans.filter(plan => plan["Name"].toLowerCase() === planParam);
        planData = planData.length > 0 ? planData[0] : false;
        let planName = "";
        if (planData) {
            planName = this.state.billingPeriod === "annually" ? planData["Name"].toLowerCase() + "_annual" : planData["Name"].toLowerCase();
        }

        return (
            <div className="login-container">
                <div className="logo">
                    <img src="/images/uniclix.png" />
                </div>
                {this.state.loading && <LoaderWithOverlay />}
                <div className="col-md-7 col-xs-12 text-center">
                    <div className="col-xs-12 text-center">
                    <SelectAccountsModal 
                        isOpen={this.state.facebookPagesModal} 
                        accounts={this.state.facebookPages}
                        onSave={this.onFacebookPagesSave}
                        error={this.state.error}
                    />
                    {/* {middleware !== "loading" && <h2>{middleware === "channels" ? "Connect your social profiles." : ((!(!!addon) && addonTrial) || !!planParam ? "Start Your Free Trial" : "Boost Your Twitter")}</h2>} */}
                    {middleware !== "channels" && middleware !== "billing" && <Loader />}
                    {loading && <LoaderWithOverlay />}
                    
                    {middleware == "channels" &&
                    <div className="box channels-box">
                        
                        {channels.length > 0 ? 
                        <div className="">  
                        <h5>Cats who destroy birds. Eat an easter feather as if it were a bird then burp victoriously</h5>

                            <div className="channel-profiles">
                                {channels.map(channel => (
                                    <div key={channel.id} className="channel-profile-box col-xs-12">
                                        <img className="channel-profile-picture" src={channel.avatar} />
                                        <div className="channel-profile-info">                                
                                            <p className="channel-profile-name">{channel.name}</p>
                                            <p className="channel-profile-type">{channel.type}</p>
                                        </div>
                                        <i className="fa fa-close" onClick={() => this.remove(channel.id)}></i>
                                    </div>  
                                ))}
                            </div>
                        </div>
                        :
                        <div className="header-title">
                            {middleware !== "loading" && <h2>Connect your accounts</h2>}
                            <h5>Click one of the buttons below to get started:</h5>
                        </div>
                    }
                    
                    <div className="channel-buttons">
                        <FacebookLogin
                            appId={facebookAppId}
                            autoLoad={false}
                            fields={fbFields}
                            scope={fbScope}
                            callback={this.onFacebookSuccess} 
                            cssClass="col-md-12 twitter-middleware-btn"
                            icon={<i className="fa fa-facebook"></i>}
                            textButton="Connect my Facebook Account"
                            ref={this.facebookRef}
                            disableMobileRedirect={true}
                        />
                        <button className="col-md-12 twitter-middleware-btn" onClick={(e) => this.twitterRef.current.onButtonClick(e)}> <i className="fa fa-twitter"></i> Connect my Twitter Account</button>

                        <LinkedInButton 
                            clientId={linkedinAppId}
                            redirectUri={`${backendUrl}/api/linkedin/callback`}
                            onSuccess={this.onLinkedInSuccess}
                            onError={this.onFailure}
                            cssClass="col-md-12 twitter-middleware-btn"
                            icon={<i className="fa fa-linkedin"></i>}
                            textButton="Connect my Linkedin Account"
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
                        {   
                            continueBtn ?
                            <button className="magento-btn mt50" onClick={this.setRole}>Connect and continue</button>
                            :
                            <button className="magento-btn mt50 disabled-btn">Connect and continue</button>
                        }
                    </div>

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