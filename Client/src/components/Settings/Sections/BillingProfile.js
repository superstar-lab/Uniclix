import React from 'react';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import { startSetProfile } from "../../../actions/profile";
import { changePlan, activateAddon, cancelAddon, getPlanData, resumeSubscription, cancelSubscription } from '../../../requests/billing';
import SweetAlert from "sweetalert2-react";
import UpgradeAlert from '../../UpgradeAlert';
import Checkout from './Checkout';
import Loader, {LoaderWithOverlay} from '../../Loader';


class BillingProfile extends React.Component {
    
    state = {
        allPlans: [],
        billingPeriod: this.props.profile.subscription.annual ? "annually" : "monthly",
        loading: false,
        forbidden: false,
        planChange: false,
        planCancel: false,
        planResume: false,
        roleBilling: this.props.profile.role.name
    }

    componentDidMount() {
        getPlanData().then(response => {
            this.setState({
                allPlans: response.allPlans
            });
        });
    }

    onPlanClick = (plan) => {

        this.setState(() => ({
            planChange: false,
            loading: true
        }));

        changePlan(plan).then(response => {
            this.props.startSetProfile();
            this.setLoading();
        }).then()
            .catch(error => {
                this.setLoading();
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
    };

    onAddonClick = (addon) => {
        activateAddon(addon).then(response => {
            this.props.startSetProfile();
        });
    };

    onAddonCancel = (addon) => {
        this.setLoading(true);
        cancelAddon(addon).then(response => {
            this.setLoading(false);
            this.props.startSetProfile();
        });
    };

    cancelPlan = () => {
        this.setLoading(true);
        cancelSubscription().then(response => {
          this.props.startSetProfile();
          this.setLoading(false);
        });
    };
    
    resumePlan = (type) => {
        this.setLoading(true);
        resumeSubscription(type).then(response => {
            this.props.startSetProfile();
            this.setLoading(false);
        });
    };

    setBillingPeriod = () => {
        this.setState(() => ({billingPeriod: this.state.billingPeriod === "annually" ? "monthly" : "annually"}));
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

    setPlanChange = (planName) => {
        this.setState(() => ({
            planChange: planName
        }));
    };

    setPlanCancel = (cancel = true) => {
        this.setState(() => ({
            planCancel: cancel
        }));
    };

    setPlanResume = (resume = true) => {
        this.setState(() => ({
            planResume: resume
        }));
    };

    render(){
       const {allPlans} = this.state;
       const {profile} = this.props;
       let planData = allPlans.filter(plan => plan["Name"].toLowerCase() === profile.role.name);
       planData = planData.length > 0 ? planData[0] : false;
       let planName = "";
       if(planData){
           planName = this.state.billingPeriod === "annually" ? planData["Name"].toLowerCase() + "_annual" : planData["Name"].toLowerCase();
       }

       return (
            <div>
                {this.state.loading && <LoaderWithOverlay />}

                <UpgradeAlert
                    isOpen={this.state.forbidden}
                    setForbidden={this.setForbidden}
                    title="Change required"
                    confirmBtn="Accounts"
                    text={this.state.error}
                    type="info"
                    redirectUri={this.state.redirect}
                />

                <SweetAlert
                    show={!!this.state.planChange}
                    title={`You are about to change your billing period`}
                    text={`Do you wish to proceed with this change for ${this.state.planChange}?`}
                    showCancelButton
                    type="info"
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                    onConfirm={() => {
                        this.onPlanClick(this.state.planChange);
                        this.setBillingPeriod();
                    }}
                    onCancel={() => this.setPlanChange(false)}
                />

                <SweetAlert
                    show={!!this.state.planCancel}
                    title={`You are about to cancel your subscription`}
                    text={`Do you really wish to cancel your current subscription?`}
                    showCancelButton
                    type="info"
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                    onConfirm={() => {
                        this.cancelPlan();
                        this.setPlanCancel(false);
                    }}
                    onCancel={() => this.setPlanCancel(false)}
                />

                <SweetAlert
                    show={!!this.state.planResume}
                    title={`You are about to continue your subscription`}
                    text={`Do you wish to proceed with your current subscription?`}
                    showCancelButton
                    type="info"
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                    onConfirm={() => {
                        this.resumePlan("main");
                        this.setPlanResume(false);
                    }}
                    onCancel={() => this.setPlanResume(false)}
                />

                {!!planData ? <div className="shadow-box main-content-style">
                    <h3>Plan Type</h3>

                    <div className="col-md-12">
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <h5>Selected Plan</h5>
                                <h5 className="magento-color">{planData["Name"]}</h5>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="col-md-12">
                                <h5>Change Plan Type</h5>
                                <p>You can upgrade or downgrade your base plan type anytime</p>
                                <NavLink to="/settings/billing/plans"><button className="default-white-btn">Change plan type</button></NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="clearer clearfix">
                        <h5>What's included</h5>

                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>{planData["Social Accounts"]} Social accounts</p>
                            </div>
                        </div>

                        {(planData["Name"] === "Premium" || planData["Name"] === "Pro" || planData["Name"] === "Agency")&&
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>{planData["Users"]} Users</p>
                            </div>
                        </div>}

                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>{planData["Post Limitation"]} Posts per account</p>
                            </div>
                        </div>

                        {planData["Name"] !== "Free" && 
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Schedule and Publish</p>
                            </div>
                        </div>}

                        {planData["Name"] !== "Free" && 
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Content Curation</p>
                            </div>
                        </div>}

                        {planData["Name"] !== "Free" && 
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Mentions</p>
                            </div>
                        </div>}

                        {planData["Name"] !== "Free" && 
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Social Listening</p>
                            </div>
                        </div>}

                        {planData["Name"] !== "Free" && 
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Analytics</p>
                            </div>
                        </div>}

                        {planData["Name"] !== "Free" && 
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Advanced Schedule</p>
                            </div>
                        </div>}

                        {(planData["Name"] === "Premium" || planData["Name"] === "Pro" || planData["Name"] === "Agency")&&
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Draft Posts</p>
                            </div>
                        </div>}

                        {(planData["Name"] === "Premium" || planData["Name"] === "Pro" || planData["Name"] === "Agency")&&
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Team users</p>
                            </div>
                        </div>}

                        {(planData["Name"] === "Premium" || planData["Name"] === "Pro" || planData["Name"] === "Agency")&&
                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Approval workflow</p>
                            </div>
                        </div>}
                    </div>

                    {planData["Name"] !== "Free" &&<div className="seperator"></div>}

                    {planData["Name"] !== "Free" && <div className="">
                        <div className="box billing channels-box">

                            <div className="col-md-12 mb20">
                                <h5>Billing Cycle</h5>
                            </div>
                            
                            <div className="plan-box col-md-6 col-xs-12">
                                <div className={`billingPeriodSelection col-md-12 ${this.state.billingPeriod === 'annually' && 'selected'}`}>

                                    <label className="custom-radio-container">Annually
                                        {profile.subscription.activeSubscription ?
                                            <input type="radio" name="billingPeriod" checked={this.state.billingPeriod === "annually" ? "checked" : false} onChange={() => this.setPlanChange(planData["Name"].toLowerCase()+"_annual")}/>
                                            :
                                            <input type="radio" name="billingPeriod" checked={this.state.billingPeriod === "monthly" ? "checked" : false} onChange={() => this.setBillingPeriod("annually")}/>
                                        }
                                        <span className="checkmark"></span>
                                    </label>

                                    <p>${parseFloat(planData["Annual Billing"] / 12).toFixed(1)} / month</p>
                                    <p>Billing annually for ${parseFloat(planData["Annual Billing"]).toFixed(1)}</p>
                                </div>
                            </div>
                            <div className="plan-box col-md-6 col-xs-12">
                                <div className={`billingPeriodSelection col-md-12 ${this.state.billingPeriod === 'monthly' && 'selected'}`}>

                                    <label className="custom-radio-container">Monthly
                                        
                                        {profile.subscription.activeSubscription ?
                                            <input type="radio" name="billingPeriod" checked={this.state.billingPeriod === "monthly" ? "checked" : false} onChange={() => this.setPlanChange(planData["Name"].toLowerCase())}/>
                                            :
                                            <input type="radio" name="billingPeriod" checked={this.state.billingPeriod === "monthly" ? "checked" : false} onChange={() => this.setBillingPeriod("monthly")}/>
                                        }
                                    
                                        <span className="checkmark"></span>
                                    </label>

                                    <p>${parseFloat(planData["Monthly"]).toFixed(1)} / month</p>
                                    <p>Billing monthly for ${parseFloat(planData["Monthly"]).toFixed(1)}</p> 
                                </div>
                            </div>
                        </div>
                    </div>}

                    {planData["Name"] !== "Free" && 
                    <div className="col-md-12">
                        {   profile.subscription.onGracePeriod ?
                            <button className="magento-btn mt20 small-btn" onClick={() => this.setPlanResume()}>Resume plan</button>
                            :
                            (profile.subscription.activeSubscription ?
                                <button className="default-white-btn mt20" onClick={() => this.setPlanCancel()}>Cancel plan</button>
                                :
                                <Checkout 
                                    plan={planName}
                                    subType="main" 
                                    trialDays={0} 
                                    setLoading={this.setLoading} 
                                    setProfile={this.props.startSetProfile} 
                                    amount={ this.state.billingPeriod === "annually" ? (planData["Annual Billing"] * 100) : (planData["Monthly"] * 100) }
                                    text="">
                                    <button className="magento-btn mt20 small-btn">Purchase plan</button> 
                                </Checkout>
                            )   
                        }
                    </div>}
                    
                </div>                
                :
                <Loader />
                }

                <div className="shadow-box main-content-style">
                    <h3>Twitter Growth</h3>

                    <div className="col-md-12">
                        <h5>What's included</h5>

                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Recommended Followers</p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Recommended Unfollowers</p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Targeted Audience</p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Clear Inactive Users</p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Reply to Followers</p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="included-feature">
                                <img src="/images/plan-success.svg" />
                                <p>Mentions</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        {   profile.addon.activeAddon && !profile.addon.addonOnGracePeriod && !profile.addon.addonTrial ?
                            <button className="default-white-btn mt20" onClick={() => this.onAddonCancel('twitter_growth')}>Cancel addon</button>
                            :
                            
                            (profile.addon.addonOnGracePeriod ?
                            <button className="magento-btn mt20 small-btn" onClick={() => this.resumePlan('addon')}>Resume addon</button>
                            :
                            (<Checkout 
                                plan="twitter_growth" 
                                subType="addon" 
                                trialDays={0} 
                                setLoading={this.setLoading} 
                                setProfile={this.props.startSetProfile} 
                                amount={10 * 100}
                                text="">
                                <button className="magento-btn mt20 small-btn">Purchase addon</button>   
                            </Checkout>)
                            
                            )
                            
                        }
                    </div>
                    
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetProfile: () => dispatch(startSetProfile())
});

export default connect(mapStateToProps, mapDispatchToProps)(BillingProfile);