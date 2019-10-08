import React from 'react';
import { connect } from 'react-redux';
import { startSetProfile } from "../../../actions/profile";
import { changePlan, getPlanData } from '../../../requests/billing';
import UpgradeAlert from '../../UpgradeAlert';
import SweetAlert from "sweetalert2-react";
import Checkout from './Checkout';
import Loader, {LoaderWithOverlay} from '../../Loader';

class BillingPlans extends React.Component {
    state = {
        allPlans: [],
        error: 'Please delete some accounts to correspond to the limits of your new plan.',
        redirect: '/accounts',
        billingPeriod: this.props.profile.subscription.annual ? "annually" : "monthly",
        planChange: false,
        loading: false
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

    setBillingPeriod = () => {
        this.setState(() => ({billingPeriod: this.state.billingPeriod === "annually" ? "monthly" : "annually"}));
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden
        }));
    };

    setPlanChange = (planName) => {
        this.setState(() => ({
            planChange: planName
        }));
    };

    setLoading = (loading = false) => {
        this.setState(() => ({
          loading
        }));
    };

    render() {
        const {allPlans} = this.state;
        const {profile} = this.props;
        const planHeading = allPlans.map((plan, index) => {
            const btnText = plan["Name"] === "Free" ? "Get for free" : "Purchase plan";
            const planName = this.state.billingPeriod === "annually" ? plan["Name"].toLowerCase() + "_annual" : plan["Name"].toLowerCase();

            let planButton = "";
                if((profile.role.name === plan["Name"].toLowerCase() && profile.subscription.activeSubscription) || (profile.role.name === "free" && plan["Name"].toLowerCase() === "free")){
                    planButton = <a className="btn plan-price-btn disabled-btn" data-period="annually" href="javascript:void(0);">Current Plan</a>;
                }else if(plan["Name"] == "Free" && profile.role.name !== "free"){
                    planButton = <a className="btn plan-price-btn" onClick={() => this.onPlanClick("free")} href="javascript:void(0);">{btnText}</a>; 
                }else if(profile.role.name !== "free" && profile.subscription.activeSubscription){
                    planButton = <a className="btn plan-price-btn" onClick={() => this.setPlanChange(planName)} href="javascript:void(0);">Change plan</a>;
                }else{
                    planButton = (
                    <Checkout 
                        plan={planName} 
                        subType="main" 
                        trialDays={30} 
                        setLoading={this.setLoading} 
                        setProfile={this.props.startSetProfile} 
                        amount={ this.state.billingPeriod === "annually" ? (plan["Annual Billing"] * 100) : (plan["Monthly"] * 100) }
                        text={btnText}>
                        <a className="btn plan-price-btn" data-period="annually" href="javascript:void(0);">{btnText}</a>    
                    </Checkout>);
                }
            
            return (
                <th key={`${index}-1`}>
                    <h5>{plan["Name"]}</h5>
                    {planButton}
                </th>
            );
        });

        return (
            <div>
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
                    title={`You are about to change to ${this.state.planChange}`}
                    text="Do you wish to proceed with this change?"
                    showCancelButton
                    type="info"
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                    onConfirm={() => {
                        this.onPlanClick(this.state.planChange);
                    }}
                    onCancel={() => this.setPlanChange(false)}
                />

                {this.state.loading && <LoaderWithOverlay />}
                {allPlans.length > 0 ? 
                <div className="container">

                    <div className="montly-annual text-right">
                        <span className="billing-toggle">monthly billing</span>
                        <label className="label">
                            <div className="toggle">
                                <input id="toggleMonthlyYearly" className="toggle-state" type="checkbox" name="check" value={this.state.billingPeriod} onChange={this.setBillingPeriod} checked={this.state.billingPeriod === "annually"}/>
                                    <div className="toggle-inner">
                                        <div className="indicator"></div>
                                    </div>
                                    <div className="active-bg"></div>
                            </div>
                        </label>
                        <span className="billing-toggle">annual billing</span>
                    </div>
                    <div className="text-right mb30">save up to 20%</div>

                    <div className="compare-plans-table-container">

                        <table className="compare-plans-table">
                            <thead>
                                <tr>

                                    <th>
                                    </th>
                                    {planHeading}

                                </tr>
                            </thead>
                            <tbody>
                                <tr className="grey-tr">
                                    <td className="fs14 text-left">Monthly</td>
                                    {allPlans.map((plan, index) => {
                                        if(plan["Monthly"] > 0)
                                            return <td key={`${index}-2`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}>${plan["Monthly"]}</td>
                                        else
                                            return <td key={`${index}-2`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}></td>
                                    })}
                                    
                                </tr>
                                <tr>
                                    <td className="fs14 text-left">Annual Billing</td>
                                    {allPlans.map((plan, index) => {
                                        if(plan["Annual Billing"] > 0)
                                            return <td key={`${index}-3`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}>${plan["Annual Billing"]}</td>
                                        else
                                            return <td key={`${index}-3`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}></td>
                                    })}
                                    
                                </tr>
                                <tr className="grey-tr">
                                    <td className="fs14 text-left">Social Accounts</td>
                                    {allPlans.map((plan, index) => {
                                        return <td key={`${index}-4`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}>{plan["Social Accounts"]}</td>
                                    })}
                                </tr>
                                <tr>
                                    <td className="fs14 text-left">Users</td>
                                    {allPlans.map((plan, index) => {
                                        return <td key={`${index}-5`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}>{plan["Users"]}</td>
                                    })}
                                    
                                    
                                </tr>
                                <tr className="grey-tr">
                                    <td className="fs14 text-left">Post Limitation</td>
                                    {allPlans.map((plan, index) => {
                                        return <td key={`${index}-6`} className={`plan-table-text ${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}>{plan["Post Limitation"]}</td>
                                    })}
                                </tr>
                                <tr>
                                    <td className="fs14 text-left">Schedule and Publish</td>
                                    {allPlans.map((plan, index) => {
                                        if(plan["Schedule and Publish"] === 'Limited')
                                            return <td key={`${index}-7`} className={`plan-table-text ${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}>{plan["Schedule and Publish"]}</td>
                                        else
                                            return <td key={`${index}-7`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/plan-success.svg" /></td>
                                    })} 
                                </tr>

                                <tr className="grey-tr">
                                    <td className="fs14 text-left">Content Curation</td>
                                    {allPlans.map((plan, index) => {
                                        if(plan["Content Curation"] === 'Limited')
                                            return <td key={`${index}-8`} className={`plan-table-text ${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}>{plan["Content Curation"]}</td>
                                        else
                                            return <td key={`${index}-8`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/plan-success.svg" /></td>
                                    })}
                                </tr>
                                <tr>
                                    <td className="fs14 text-left">Mentions</td>
                                    {allPlans.map((plan, index) => {
                                        if(!plan["Mentions"])
                                            return <td key={`${index}-9`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/red-x.svg" /></td>
                                        else
                                            return <td key={`${index}-9`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/plan-success.svg" /></td>
                                    })}
                                    
                                </tr>
                                <tr className="grey-tr">
                                    <td className="fs14 text-left">Social Listening & Monitoring</td>
                                    {allPlans.map((plan, index) => {
                                        if(!plan["Social Listening & Monitoring"])
                                            return <td key={`${index}-10`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/red-x.svg" /></td>
                                        else
                                            return <td key={`${index}-10`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/plan-success.svg" /></td>
                                    })}
                                </tr>
                                <tr>
                                    <td className="fs14 text-left">Analytics</td>
                                    {allPlans.map((plan, index) => {
                                        if(plan["Analytics"] === 'Limited')
                                            return <td key={`${index}-11`} className={`plan-table-text ${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}>{plan["Analytics"]}</td>
                                        else
                                            return <td key={`${index}-11`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/plan-success.svg" /></td>
                                    })}
                                    
                                </tr>
                                <tr className="grey-tr">
                                    <td className="fs14 text-left">Advanced Schedule</td>
                                    {allPlans.map((plan, index) => {
                                        if(!plan["Advanced Schedule"])
                                            return <td key={`${index}-12`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/red-x.svg" /></td>
                                        else
                                            return <td key={`${index}-12`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/plan-success.svg" /></td>
                                    })}
                                    
                                </tr>
                                <tr>
                                    <td className="fs14 text-left">Create and Manage Draft Posts</td>
                                    {allPlans.map((plan, index) => {
                                        if(!plan["Create and Manage Draft Posts"])
                                            return <td key={`${index}-13`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/red-x.svg" /></td>
                                        else
                                            return <td key={`${index}-13`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/plan-success.svg" /></td>
                                    })}
                                    
                                </tr>
                                <tr className="grey-tr">
                                    <td className="fs14 text-left">Team: Invite Additional Users</td>
                                    {allPlans.map((plan, index) => {
                                        if(!plan["Team: Invite Additional Users"])
                                            return <td key={`${index}-14`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/red-x.svg" /></td>
                                        else
                                            return <td key={`${index}-14`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/plan-success.svg" /></td>
                                    })}
                                    
                                </tr>
                                <tr>
                                    <td className="fs14 text-left">Approval Workflow</td>
                                    {allPlans.map((plan, index) => {
                                        if(!plan["Approval Workflow"])
                                            return <td key={`${index}-15`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/red-x.svg" /></td>
                                        else
                                            return <td key={`${index}-15`} className={`${profile.role.name === plan["Name"].toLowerCase() && "disabled-btn"}`}><img src="/images/plan-success.svg" /></td>
                                    })}
                                    
                                </tr>
                            </tbody>
                            <thead>
                                <tr>
                                    <th>
                                    </th>
                                    {planHeading}
                                    
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div> : <Loader />}
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

export default connect(mapStateToProps, mapDispatchToProps)(BillingPlans);