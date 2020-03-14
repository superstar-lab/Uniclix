import React from 'react';
import { connect } from 'react-redux';
import { startSetProfile } from "../../../actions/profile";
import { changePlan, getPlanData } from '../../../requests/billing';
import Checkout from './Checkout';
import Loader, { LoaderWithOverlay } from '../../Loader';
import Modal from 'react-modal';
import { cancelSubscription, resumeSubscription } from '../../../requests/billing';

class BillingProfile extends React.Component {
    state = {
        allPlans: [],
        error: 'Please delete some accounts to correspond to the limits of your new plan.',
        redirect: '/accounts',
        billingPeriod: this.props.profile.subscription.annual ? "annually" : "monthly",
        planChange: false,
        planCancel: false,
        planResume: false,
        planConfirm: false,
        planName: "",
        selectedPlan: null,
        loading: false,
        roleBilling: "",
        onAddCard: false,
        subscriptionStatus: false,
        forbidden: false,
        accountsModal: false,
        message: '',
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

    onCheckout = (plan) => {
        this.setState(() => ({
            planChange: false,
            planName: plan,
            onAddCard: true
        }));
    };

    onPlanClick = (plan) => {
        
        if(this.props.profile.subscription.activeSubscription == false){
            this.setState(() => ({
                planChange: false,
                planName: plan,
                onAddCard: true
            }));
            return;
        }

        this.setState(() => ({
            planChange: false,
            planName: plan,
            loading: true
        }));

        changePlan(plan).then(response => {
            let message = response.message;
            if(message == 'more than 5 accounts') {
                this.setState({
                    accountsModal: true,
                    message: 'You currently are utilizing more than 5 accounts, please assure that you have five active accounts only before downgrade.'
                });
                this.setLoading();
                return;
            } else if(message == 'more than 20 accounts'){
                this.setState({
                    accountsModal: true,
                    message: 'You currently are utilizing more than 20 accounts, please assure that you have five active accounts only before downgrade.'
                });
                this.setLoading();
                return;
            }
            this.props.startSetProfile();
            this.setLoading();
            this.setState({
                roleBilling: plan,
            })
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
        this.setState(() => ({ billingPeriod: this.state.billingPeriod === "annually" ? "monthly" : "annually" }));
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

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
          forbidden
        }));
    };

    setPlanChange = (planName) => {
        this.setState(() => ({
            planChange: planName,
            planName: planName,
        }));
    };

    setPlanConfirm = (planName) => {
        this.setState(() => ({
            planConfirm: planName,
            planName: planName,
        }));
    }

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
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

    render() {
        const { allPlans, onAddCard, planName, planChange, planCancel, planResume, planConfirm, selectedPlan, billingPeriod, roleBilling, accountsModal, message } = this.state;
        const { profile } = this.props;

        return (
            onAddCard ?
                <Checkout planName={planName} plan={selectedPlan} billingPeriod={billingPeriod} onChangePlan={() => this.setState({onAddCard: false})} onChangePeriod={() => this.setBillingPeriod()} />
                :
                <div>
                    {!!planConfirm && 
                        <Modal
                        ariaHideApp={false}
                        className="billing-profile-modal"
                        isOpen={!!planConfirm}
                        >
                            <div className="modal-title">{`You can order ${planConfirm}`}</div>
                            <div className="modal-contents">{`Do you wish to proceed with this confirm order?`}</div>
                            <div style={{float:'right'}}>
                                <button onClick={() => this.setPlanConfirm(false)} className="cancelBtn" >No</button>
                                <button onClick={() => {this.setPlanConfirm(false); this.onPlanClick(planConfirm)}} className="cancelBtn" >Yes</button>
                            </div>
                        </Modal>
                    }

                    {!!planChange && 
                        <Modal
                        ariaHideApp={false}
                        className="billing-profile-modal"
                        isOpen={!!planChange}
                        >
                            <div className="modal-title">{`You are about to change to ${planChange}`}</div>
                            <div className="modal-contents">{`Do you wish to proceed with this change?`}</div>
                            <div style={{float:'right'}}>
                                <button onClick={() => this.setPlanChange(false)} className="cancelBtn" >No</button>
                                <button onClick={() => {this.setPlanChange(false);this.onPlanClick(planChange)}} className="cancelBtn" >Yes</button>
                            </div>
                        </Modal>
                    }

                    {!!planResume && 
                        <Modal
                        ariaHideApp={false}
                        className="billing-profile-modal"
                        isOpen={!!planResume}
                        >
                            <div className="modal-title">{`You are about to continue your subscription`}</div>
                            <div className="modal-contents">{`Do you wish to proceed with your current subscription?`}</div>
                            <div style={{float:'right'}}>
                                <button onClick={() => this.setPlanResume(false)} className="cancelBtn" >No</button>
                                <button onClick={() => {this.resumePlan("main"); this.setPlanResume(false);}} className="cancelBtn" >Yes</button>
                            </div>
                        </Modal>
                    }

                    {!!planCancel && 
                        <Modal
                        ariaHideApp={false}
                        className="billing-profile-modal"
                        isOpen={!!planCancel}
                        >
                            <div className="modal-title">{`Are you sure you want to cancel your subscription?`}</div>
                            <div className="modal-contents">{`All the accounts and members linked will be lost`}</div>
                            <div style={{float:'right'}}>
                                <button onClick={() => this.setPlanCancel(false)} className="cancelBtn" >Cancel</button>
                                <button onClick={() => {this.cancelPlan();this.setPlanCancel(false);}} className="cancelBtn" >Yes, cancel it</button>
                            </div>
                        </Modal>
                    }

                    {!!accountsModal && 
                        <Modal
                        ariaHideApp={false}
                        className="billing-profile-modal"
                        isOpen={!!accountsModal}
                        >
                            <div className="modal-title">{`Attention`}</div>
                            <div className="modal-content1">{message}</div>
                            <div style={{float:'right'}}>
                                <button onClick={() => this.setState({accountsModal: false})} className="cancelBtn" >No</button>
                                <a href="/settings/manage-account" className="cancelBtn1" >Yes</a>
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
                                            <div className={`card billing-body-c ${plan["Name"].toLowerCase() == roleBilling ? 'active' : ''}`}>
                                                <div className="card-body">
                                                    <h6 className="card-selected text-center">{plan["Name"].toLowerCase() == roleBilling ? 'Selected plan' : ''}</h6>
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
                                                        !profile.subscription.activeSubscription ?
                                                        <button className={`btn billing-btn active`} onClick={() => {this.setState({selectedPlan: plan}); this.setPlanConfirm(plan["Name"].toLowerCase())}}>Confirm order</button>
                                                        :                                                        
                                                        (plan["Name"].toLowerCase() == roleBilling ?
                                                            (profile.subscription.onGracePeriod ?
                                                                <button className={`btn billing-btn active`} onClick={() => this.setPlanResume(plan["Name"].toLowerCase())}>Resume plan</button>
                                                            :
                                                                <button className={`btn billing-btn active`} onClick={() => this.setPlanCancel(plan["Name"].toLowerCase())}>Cancel Subscription</button>
                                                            )
                                                        :
                                                            // Separate the plans by price
                                                            (plan["Monthly"] > allPlans.find(item => item["Name"] == roleBilling.charAt(0).toUpperCase() + roleBilling.slice(1))["Monthly"] ?
                                                                <button className="btn billing-btn" onClick={() => { this.setPlanChange(plan["Name"].toLowerCase()) }}>Upgrade</button>
                                                            :
                                                                <button className="btn billing-btn" onClick={() => { this.setPlanChange(plan["Name"].toLowerCase()) }}>Downgrade</button>
                                                            )
                                                        )
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
                                <button className="billing-profile-button" onClick={() => window.location.href='mailto:Info@uniclixapp.com'}>Contact us</button>
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