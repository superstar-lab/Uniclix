import React from 'react';
import { connect } from 'react-redux';
import { startSetProfile } from "../../../actions/profile";
import { changePlan, getPlanData } from '../../../requests/billing';
import SweetAlert from "sweetalert2-react";
import Checkout from './Checkout';
import Loader, { LoaderWithOverlay } from '../../Loader';
import Modal from 'react-modal';
import { cancelSubscription } from '../../../requests/billing';
import CongratsPayment from "./CongratsPayment";

class BillingProfile extends React.Component {
    state = {
        allPlans: [],
        error: 'Please delete some accounts to correspond to the limits of your new plan.',
        redirect: '/accounts',
        billingPeriod: this.props.profile.subscription.annual ? "annually" : "monthly",
        planChange: false,
        planName: "",
        selectedPlan: null,
        loading: false,
        roleBilling: "",
        buttontext: "Upgrade",
        onAddCard: false,
        subscriptionStatus: false,
        forbidden: false,
    }

    componentDidMount() {
        getPlanData().then(response => {
            this.setState({
                allPlans: response.allPlans,
                roleBilling: this.props.profile.role.name,
                planName: this.props.profile.role.name,
            });
        });
    };

    onPlanClick = (plan) => {
        this.setState(() => ({
            planChange: false,
            planName: plan,
            onAddCard: true
        }));
    };
    setBillingPeriod = () => {
        this.setState(() => ({ billingPeriod: this.state.billingPeriod === "annually" ? "monthly" : "annually" }));
    };

    setRole = (role) => {
        let item = role.toLowerCase();
        this.setState({
            roleBilling: item,
            subscriptionStatus: !this.state.subscriptionStatus,
        });
    }
    setForbidden = () => {
        this.setState(() => ({
            loading: true,
        }));
        
        cancelSubscription().then(response => {
            if(response.success){
                this.setState({
                    loading: false,
                    roleBilling: "",
                    subscriptionStatus: !this.state.subscriptionStatus,
                });
            }
            
        });
    };

    setPlanChange = (planName) => {
        this.setState(() => ({
            planChange: planName,
            planName: planName,
        }));
    };

    setChangeButtonText = () => {
        this.setState(() => ({
            buttontext: "Confirm Order"
        }));
    };


    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    };

    render() {
        const { allPlans, onAddCard, planName, planChange, selectedPlan, billingPeriod } = this.state;
        const { profile } = this.props;

        return (
            onAddCard ?
                <Checkout planName={planName} plan={selectedPlan} billingPeriod={billingPeriod} onChangePlan={() => this.setState({onAddCard: false})} onChangePeriod={() => this.setBillingPeriod()} />
                :
                <div>
                    <SweetAlert
                        show={!!planChange}
                        title={`You are about to change to ${planChange}`}
                        text="Do you wish to proceed with this change?"
                        showCancelButton
                        type="info"
                        confirmButtonText="Yes"
                        cancelButtonText="No"
                        onConfirm={() => {
                            this.onPlanClick(planChange);
                        }}
                        onCancel={() => this.setPlanChange(false)}
                    />
                    {this.state.subscriptionStatus && 
                        <Modal
                        ariaHideApp={false}
                        className="billing-profile-modal"
                        isOpen={this.state.subscriptionStatus}
                        >
                            <div className="modal-title">Are you sure you want to cancel your subscription?</div>
                            <div className="modal-contents">All the accounts and members linked will be lost</div>
                            <div style={{float:'right'}}>
                                <button onClick={() => this.setState({subscriptionStatus: !this.state.subscriptionStatus})} className="cancelBtn" >Cancel</button>
                                <button onClick={() => this.setForbidden()} className="cancelBtn" >Yes, cancel it</button>
                            </div>
                            
                        </Modal>
                    }
                    {this.state.loading && <LoaderWithOverlay />}

                    {allPlans.length > 0 ?
                        <div className="container billing-top">
                            <div className="montly-annual text-right">
                                <span className="billing-toggle">monthly billing</span>
                                <label className="label">
                                    <div className="toggle">
                                        <input id="toggleMonthlyYearly"
                                            className="toggle-state"
                                            type="checkbox" name="check"
                                            value={this.state.billingPeriod}
                                            onChange={this.setBillingPeriod}
                                            checked={this.state.billingPeriod === "annually"} 
                                        />
                                        <div className="toggle-inner">
                                            <div className="indicator"></div>
                                        </div>
                                        <div className="active-bg"></div>
                                    </div>
                                </label>
                                <span className="billing-toggle">annual billing</span>
                            </div>
                            <section className="pricing py-5">
                                {allPlans.map((plan, index) => {
                                    return (
                                        <div key={index} className="col-4 col-md-4 col-sm-12">
                                            <div className={`card billing-body-c ${plan["Name"].toLowerCase() == this.state.roleBilling ? 'active' : ''}`}>
                                                <div className="card-body">
                                                    <h6 className="card-selected text-center">{plan["Name"].toLowerCase() == this.state.roleBilling ? 'Selected plan' : ''}</h6>
                                                    <h5 className="card-title text-muted text-uppercase text-center">{plan["Name"]}</h5>
                                                    {this.state.billingPeriod === "annually" ?
                                                        <h6 className="card-price text-center">${plan['Annual Billing']}<span className="period">/annual</span></h6>
                                                        :
                                                        <h6 className="card-price text-center">${plan["Monthly"]}<span className="period">/month</span></h6>
                                                    }
                                                    <ul className="fa-ul ">
                                                        <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Social Accounts"]} social accounts </li>
                                                        <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Users"]} user</li>
                                                        <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Post Limitation"]} post</li>
                                                        <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Schedule and Publish"] != true ? 'manage and schedule posts' : ''}</li>
                                                        {plan["Content Curation"] == true ? <li><span className="fa-li"><i className="fa fa-check"></i></span>Content Curation</li> : ''}
                                                        <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Social Listening & Monitoring"]} monitor activity</li>
                                                        <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Mentions"]} track mentions</li>
                                                        {plan["Analytics"] == true ? <li><span className="fa-li"><i className="fa fa-check"></i></span>Analytics</li> : ''}
                                                        {plan["Create and Manage Draft Posts"] == true ? <li><span className="fa-li"><i className="fa fa-check"></i></span>Create and Manage Draft Posts</li> : ''}
                                                        {plan["Team: Invite Additional Users"] == true ? <li><span className="fa-li"><i className="fa fa-check"></i></span>Team: Invite Additional Users</li> : ''}
                                                        {plan["Approval Workflow"] == true ? <li><span className="fa-li"><i className="fa fa-check"></i></span>Approval Workflow</li> : ''}
                                                    </ul>
                                                    {
                                                        plan["Name"].toLowerCase() == this.state.roleBilling
                                                            ?
                                                            // duhet edhe ni button, Confirm Order / Cancel Subscribtion
                                                            <button className={`btn billing-btn  ${plan["Name"].toLowerCase() == this.state.roleBilling ? 'active' : ''}`} onClick={() => this.setRole(plan["Name"])}>Cancel Subscription</button>
                                                            :

                                                            <button className="btn billing-btn" onClick={() => { this.setState({selectedPlan: plan}); this.setPlanChange(plan["Name"].toLowerCase()) }}>Upgrade</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </section>
                        </div> : <Loader />
                    }
                    <div>
                        <div className="billing-bottom-container">
                            <div className="bottom-title">Enterprise</div>
                            <div className="billing-profile-content">Contact us to get a custom plan that fits your needs
                                <button className="billing-profile-button">Contact us</button>
                            </div>
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