import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setMiddleware } from '../actions/middleware';
import SelectAccountsModal from './Accounts/SelectAccountsModal';
import { startSetChannels, startAddFacebookChannel, startAddLinkedinChannel, startAddPinterestChannel, startAddTwitterChannel } from "../actions/channels";
import { startSetProfile } from "../actions/profile";
import { changePlan, activateAddon, getPlanData } from '../requests/billing';
// import PinterestButton from "./PinterestButton";
import channelSelector, { findAccounts } from "../selectors/channels";
import { destroyChannel } from "../requests/channels";
import Loader, { LoaderWithOverlay } from './Loader';
import { getParameterByName, getCookie } from "../utils/helpers";
import { PRICING_COOKIE_KEY } from '../utils/constants';
import Checkout from "./Settings/Sections/Checkout";
import ConnectAccounts from './ConnectAccounts';

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
        if (
            prevProps.profile.subscription !== this.props.profile.subscription ||
            prevProps.profile.addon !== this.props.profile.addon
        ) {
            if ((this.state.plan || this.state.addon) && !this.props.profile.subscription.activeSubscription && !this.props.profile.addon.activeAddon && !this.state.addonTrial) {
                this.props.setMiddleware("billing");
                return;
            } else {
                // We don't want to show the modal when the app is still fetching the channels
                if (this.props.channels.length < 1 && !this.props.channelsLoading) {
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

            // If the cookie is present, we want to redirect the
            // user to the billing page as soon as he add his accounts
            const pricingCookie = getCookie(PRICING_COOKIE_KEY);
            if (pricingCookie) {
                this.props.history.push('/settings/billing');
            }
        });
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

    getAccountsForModal = () => {
        const { channels } = this.props;
        const { bussinesPages } = this.state;

        // first we get the facebook channels that are already registered
        const facebookChannels = channels.filter(channel => channel.type === 'facebook');
        const filteredAccounts = bussinesPages
            .filter(page => facebookChannels.findIndex(fb => fb.details.original_id === page.id) === -1);

        return filteredAccounts;
    };

    render() {
        const { middleware, channels } = this.props;
        const { loading, allPlans, addon, addonTrial, addAccounts, bussinesModal } = this.state;
        let planParam = getParameterByName("plan", this.props.location.search);
        let planData = allPlans.filter(plan => plan["Name"].toLowerCase() === planParam);
        planData = planData.length > 0 ? planData[0] : false;
        let planName = "";
        if (planData) {
            planName = this.state.billingPeriod === "annually" ? planData["Name"].toLowerCase() + "_annual" : planData["Name"].toLowerCase();
        }
        
        return (
            <div className={`login-container ${middleware}`}>
                { middleware && middleware !== 'loading' && (
                    <div className="logo">
                        <span className="minimalist-logo">Uniclix.</span>
                    </div>)
                }

                <div className="col-md-7 col-xs-12 text-center">
                    <div className="col-xs-12 text-center">
                        <SelectAccountsModal 
                            isOpen={bussinesModal}
                            accounts={this.getAccountsForModal()}
                            onSave={this.onBussinesPagesSave}
                            error={this.state.error}
                            closeModal={this.togglebussinesModal}
                        />
                        {middleware !== "channels" && middleware !== "billing" && <Loader />}
                        {loading && <LoaderWithOverlay />}
                        
                        {
                            middleware == "channels" && (
                                <div className="box channels-box">
                                    <div>
                                        <ConnectAccounts middleware={'channels'} />
                                        {
                                            channels.length > 0  ?
                                                <button
                                                    className="magento-btn mt50"
                                                    onClick={this.setRole}
                                                >
                                                    Connect and continue
                                                </button> :
                                                <button className="magento-btn mt50 disabled-btn">
                                                    Connect and continue
                                                </button>
                                            }
                                    </div>
                                </div>
                            )
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
                { middleware && middleware !== 'loading' && <div className="col-md-5 middleware-side"></div> }
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
        selectedChannel,
        channelsLoading: state.channels.loading
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