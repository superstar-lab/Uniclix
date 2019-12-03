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
        loading: false,
        roleBilling: "",
    }
    componentDidMount() {
        getPlanData().then(response => {
            this.setState({
                allPlans: response.allPlans,
                roleBilling: this.props.profile.role.name
            });
        });
    };
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

    setRole = (role) => {
        let item = role.toLowerCase();
        console.log(item)
        this.setState({
            roleBilling: item
        });
        console.log(this.state.roleBilling, 'role');
    }
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
        // console.log('all plans', allPlans);
        // console.log('useri', profile.role.name);
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
                                    <input id="toggleMonthlyYearly"
                                        className="toggle-state"
                                        type="checkbox" name="check"
                                        value={this.state.billingPeriod}
                                        onChange={this.setBillingPeriod}
                                        checked={this.state.billingPeriod === "annually"} />
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
                                        <div className="card">
                                            <div className={`card-body billing-body-c ${plan["Name"].toLowerCase() == this.state.roleBilling ? 'active' : ''}`}>
                                                {plan["Name"].toLowerCase() == this.state.roleBilling ? 'selected account' : ''}
                                                <h5 className="card-title text-muted text-uppercase text-center">{plan["Name"]}</h5>
                                                {this.state.billingPeriod === "annually" ?
                                                    <h6 className="card-price text-center">${plan['Annual Billing']}<span className="period">/annual</span></h6>
                                                    :
                                                    <h6 className="card-price text-center">${plan["Monthly"]}<span className="period">/month</span></h6>
                                                }
                                                <ul className="fa-ul">
                                                    <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Social Accounts"]} social accounts </li>
                                                    <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Users"]} user</li>
                                                    <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Post Limitation"]} post</li>
                                                    <li><span className="fa-li"><i className="fa fa-check"></i></span>manage and schedule posts {plan["Schedule and Publish"] != true ? plan["Schedule and Publish"] : ''}</li>
                                                    <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Mentions"]} track mentions</li>
                                                    <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Social Listening & Monitoring"]} monitor activity</li>
                                                    {plan["Content Curation"] == true ? <li><span className="fa-li"><i className="fa fa-check"></i></span>Content Curation</li> : ''}
                                                </ul>
                                                <button className={`btn billing-btn text-uppercase ${plan["Name"].toLowerCase() == this.state.roleBilling ? 'active' : ''}`}   onClick={() => this.setRole(plan["Name"])}>Button</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </section>
                    </div> : <Loader />
                }
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