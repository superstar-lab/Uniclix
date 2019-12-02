import React from 'react';
import { connect } from 'react-redux';
import { startSetProfile } from "../../../actions/profile";
import { changePlan, getPlanData } from '../../../requests/billing';
import UpgradeAlert from '../../UpgradeAlert';
import SweetAlert from "sweetalert2-react";
import Checkout from './Checkout';
import Loader, { LoaderWithOverlay } from '../../Loader';

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
        this.setState(() => ({ billingPeriod: this.state.billingPeriod === "annually" ? "monthly" : "annually" }));
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
        const { allPlans } = this.state;
        const { profile } = this.props;
        const planHeading = allPlans.map((plan, index) => {
            const btnText = plan["Name"] === "Free" ? "Get for free" : "Purchase plan";
            const planName = this.state.billingPeriod === "annually" ? plan["Name"].toLowerCase() + "_annual" : plan["Name"].toLowerCase();

            let planButton = "";
            if ((profile.role.name === plan["Name"].toLowerCase() && profile.subscription.activeSubscription) || (profile.role.name === "free" && plan["Name"].toLowerCase() === "free")) {
                planButton = <a className="btn plan-price-btn disabled-btn" data-period="annually" href="javascript:void(0);">Current Plan</a>;
            } else if (plan["Name"] == "Free" && profile.role.name !== "free") {
                planButton = <a className="btn plan-price-btn" onClick={() => this.onPlanClick("free")} href="javascript:void(0);">{btnText}</a>;
            } else if (profile.role.name !== "free" && profile.subscription.activeSubscription) {
                planButton = <a className="btn plan-price-btn" onClick={() => this.setPlanChange(planName)} href="javascript:void(0);">Change plan</a>;
            } else {
                planButton = (
                    <Checkout
                        plan={planName}
                        subType="main"
                        trialDays={30}
                        setLoading={this.setLoading}
                        setProfile={this.props.startSetProfile}
                        amount={this.state.billingPeriod === "annually" ? (plan["Annual Billing"] * 100) : (plan["Monthly"] * 100)}
                        text={btnText}>
                        <a className="btn plan-price-btn" data-period="annually" href="javascript:void(0);">{btnText}</a>
                    </Checkout>);
            }

            return (
                <th key={`${index}-1`}>
                    <h5>{plan["Name"]} {`${index}`}</h5>
                    {/* {planButton} */}
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
                    <div className="container billing-top">
                        <div className="montly-annual text-right">
                            <span className="billing-toggle">monthly billing</span>
                            <label className="label">
                                <div className="toggle">
                                    <input id="toggleMonthlyYearly" className="toggle-state" type="checkbox" name="check" value={this.state.billingPeriod} onChange={this.setBillingPeriod} checked={this.state.billingPeriod === "annually"} />
                                    <div className="toggle-inner">
                                        <div className="indicator"></div>
                                    </div>
                                    <div className="active-bg"></div>
                                </div>
                            </label>
                            <span className="billing-toggle">annual billing</span>
                        </div>
                      
                        <section class="pricing py-5">
                            <div className="col-4 col-md-4 col-sm-12">

                                <div class="card mb-5 mb-lg-0">
                                    <div class="card-body">
                                        <h5 class="card-title text-muted text-uppercase text-center">Free</h5>
                                        <h6 class="card-price text-center">$0<span class="period">/month</span></h6>
                                        {/* <hr> */}
                                        <ul class="fa-ul">
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>Single User</li>
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>5GB Storage</li>
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>Unlimited Public Projects</li>
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>Community Access</li>
                                            <li class="text-muted"><span class="fa-li"><i class="fa fa-times"></i></span>Unlimited Private Projects</li>
                                            <li class="text-muted"><span class="fa-li"><i class="fa fa-times"></i></span>Dedicated Phone Support</li>
                                            
                                        </ul>
                                        <a href="#" class="btn btn-block btn-primary text-uppercase">Button</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 col-md-4 col-sm-12">

                                <div class="card mb-5 mb-lg-0">
                                    <div class="card-body">
                                        <h5 class="card-title text-muted text-uppercase text-center">Free</h5>
                                        <h6 class="card-price text-center">$0<span class="period">/month</span></h6>
                                        {/* <hr> */}
                                        <ul class="fa-ul">
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>Single User</li>
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>5GB Storage</li>
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>Unlimited Public Projects</li>
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>Community Access</li>
                                            <li class="text-muted"><span class="fa-li"><i class="fa fa-times"></i></span>Unlimited Private Projects</li>
                                            <li class="text-muted"><span class="fa-li"><i class="fa fa-times"></i></span>Dedicated Phone Support</li>
                                          
                                        </ul>
                                        <a href="#" class="btn btn-block btn-primary text-uppercase">Button</a>
                                    </div>
                                </div>
                            </div>

                            <div className="col-4 col-md-4 col-sm-12">

                                <div class="card mb-5 mb-lg-0">
                                    <div class="card-body">
                                        <h5 class="card-title text-muted text-uppercase text-center">Free</h5>
                                        <h6 class="card-price text-center">$0<span class="period">/month</span></h6>
                                        {/* <hr> */}
                                        <ul class="fa-ul">
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>Single User</li>
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>5GB Storage</li>
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>Unlimited Public Projects</li>
                                            <li><span class="fa-li"><i class="fa fa-check"></i></span>Community Access</li>
                                            <li class="text-muted"><span class="fa-li"><i class="fa fa-times"></i></span>Unlimited Private Projects</li>
                                            <li class="text-muted"><span class="fa-li"><i class="fa fa-times"></i></span>Dedicated Phone Support</li>
                                            
                                        </ul>
                                        <a href="#" class="btn btn-block btn-primary text-uppercase">Button</a>
                                    </div>
                                </div>
                            </div>
                        </section>



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