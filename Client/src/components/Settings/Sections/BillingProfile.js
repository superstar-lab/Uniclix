import React from 'react';
import { connect } from 'react-redux';
import { startSetProfile } from "../../../actions/profile";
import { changePlan, getPlanData } from '../../../requests/billing';
import Checkout from './Checkout';
import { isValid } from 'cc-validate';
import Loader, { LoaderWithOverlay } from '../../Loader';
import Modal from 'react-modal';
import FunctionModal from '../../Modal';
import { getCookie } from '../../../utils/helpers';
import { PRICING_COOKIE_KEY } from '../../../utils/constants';
import { cancelSubscription, resumeSubscription, createSubscription, updateSubscription } from '../../../requests/billing';
import Picker from 'react-month-picker';
import { Select } from 'antd';
import Countries from "../../../fixtures/country";
import { stripePublishableKey } from '../../../config/api';
import { startAddTwitterChannel, startSetChannels } from "../../../actions/channels";


const Option = Select.Option;

class BillingProfile extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
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
            message: '',
            showFreeTrialEndedModal: props.freeTrialEnded,
            cardBrand: '',
            lastNumber: '',
            payInfoEdit: false,
            validClaas: "",
            validClaasCvv: "",
            form: {
              cardnumber: '',
              cvc: '',
              exp_month: '',
              exp_year: '',
              exp_date: '',
              name: '',
              last_name: '',
              address_line1: '',
              address_city: '',
              postal: ''
          },
          countries: [],
          openCountry: false,
          locations: [],
          location: "",
          couponCode: '',
        }
    }

    componentDidMount() {
        const pricingCookie = getCookie(PRICING_COOKIE_KEY);

        getPlanData().then(response => {
            this.setState({
                allPlans: response.allPlans,
                roleBilling: pricingCookie ? pricingCookie : this.props.profile.role.name,
                planName: this.props.profile.role.name,
            });
        });
        this.setState({
            cardBrand: this.props.profile.user.card_brand,
            lastNumber: this.props.profile.user.card_last_four,
            countries: Countries,
        });
        this.activeYears();
        this.loadStripe();
    };

    handleAMonthChange = (value, text) => {
        let valueTxt = text + " / " + value
    
        this.setState({
          form: {
            ...this.state.form,
            exp_date: valueTxt || 'N/A',
            exp_month: text,
            exp_year: value
          }
        })
      }

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
            this.props.startSetProfile();
            this.setLoading();
            this.setState({
                roleBilling: plan,
            })
        }).then()
            .catch(error => {
                this.setLoading();
                if (error.response.status === 432) {
                    FunctionModal({
                        type: 'confirm',
                        title: 'Social Media accounts limit',
                        content: (
                            <div>
                                <div>The current amount of accounts that you have is beyond the limit permited of accounts in the plan that you want to switch to.</div>
                                <div>Please delete a few to be able to downgrade your plan</div>
                            </div>
                        ),
                        okText: "Ok, let's go to accounts",
                        onOk: this.limitAccountsReachedOnOk
                    })
                } else if (error.response.status === 433) {
                    FunctionModal({
                        type: 'confirm',
                        title: 'Team Members limit',
                        content: (
                            <div>
                                <div>The current amount of team members that you have is beyond the limit permited of members in the plan that you want to switch to.</div>
                                <div>Please delete a few to be able to downgrade your plan</div>
                            </div>
                        ),
                        okText: "Ok, let's go to team",
                        onOk: this.limitMembersReachedOnOk
                    })
                }
            });
    };

    limitAccountsReachedOnOk = () => {
        this.props.history.push('/settings/manage-account');
    }

    limitMembersReachedOnOk = () => {
        this.props.history.push('/settings/team');
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
            payInfoEdit: false,
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
            planCancel: cancel,
            payInfoEdit: false,
        }));
    };

    setPlanResume = (resume = true) => {
        this.setState(() => ({
            planResume: resume,
            payInfoEdit: false,
        }));
    };

    onPayInfoEdit = () => {
        this.setState({
            payInfoEdit: true,
        });
    }
    
    
    checkIfValidCC = (val) => {
        let patern = new RegExp("^[0-9_ ]*$");
        if (patern.test(val) && val.length < 20) {
          let newval = '';
          val = val.replace(/\s/g, '');
          for (var i = 0; i < val.length; i++) {
            if (i % 4 == 0 && i > 0)
              newval = newval.concat(' ');
            newval = newval.concat(val[i]);
          }
    
          this.setState({
            form: {
              ...this.state.form,
              cardnumber: newval
            }
          })
          let result = isValid(newval);
          this.setState({
            validClaas: result.isValid ? '' : "error"
          })
        }
    }
    
    
    activeYears = () => {
        const todayDate = new Date();
        const year = todayDate.getFullYear();
        let activeYears = []
        for (let y = 1; y < 11; y++) {
          activeYears.push(year + y)
        }
        this.setState({
          years: activeYears,
          loading: false
        })
    }

    handleClickMonthBox = (e) => {
        this.refs.pickAMonth.show()
    }
    
    handleClickMonthBoxHidde = (e) => {
        this.refs.pickAMonth.hidden()
    }

    ValidateCvv = (e) => {
        let value = e.target.value;
        let cvv = value * 1;
        if (!isNaN(cvv) && value.length < 5) {
            var myRe = /^[0-9]{3,4}?$/;
            var myArray = myRe.exec(cvv);
            this.setState({
                validClaasCvv: cvv != myArray ? '' : "error",
                form: {
                    ...this.state.form,
                    cvc: value
                }
            });
        }
    }
        
    onFieldChange = (e) => {
        const id = e.target.name;
        let form = Object.assign({}, this.state.form);
        form[id] = e.target.value;
        this.setState({
            form: {
            ...form
            }
        })
    }

    setLocation = (val) => {
        this.setState({ 
            location: val
        })
    }

    loadStripe = () => {
        if (!window.document.getElementById('stripe-script')) {
            var s = window.document.createElement("script");
            s.id = "stripe-script";
            s.type = "text/javascript";
            s.src = "https://js.stripe.com/v2/";
            s.onload = () => {
            window['Stripe'].setPublishableKey(stripePublishableKey);
            }
            window.document.body.appendChild(s);
        }
    }
      
    onConfirmChange = () => {
        this.setState({
            loading: true,
        });

        window.Stripe.card.createToken({
            number: this.state.form.cardnumber,
            exp_month: this.state.form.exp_month,
            exp_year: this.state.form.exp_year,
            cvc: this.state.form.cvc,
            address_city: this.state.form.address_city,
            address_zip: this.state.form.postal,
            address_line1: this.state.form.address_line1
            }, (status, response) => {
            response.plan = this.state.billingPeriod === "annually" ? this.state.planName + "_annual" : this.state.planName;
            response.trialDays = 0;
            response.created = new Date().getTime();
            response.subType = "main"
            response.couponCode = this.state.billingPeriod === "annually" ? this.state.couponCode : '';
            if (status === 200) {
                updateSubscription(response).then(response => {
                this.props.startSetChannels().then(res => {
                    this.props.startSetProfile().then(res => {
                    this.setState({
                        loading: false,
                        payInfoEdit: false,
                    });
                    window.location.reload();
                    });
                })
                });
            } else {
                this.setState({
                loading: true,
                message: ""
                });
            }
        });
    }
    
    render() {
        const {
            allPlans,
            onAddCard,
            planName,
            planChange,
            planCancel,
            planResume,
            planConfirm,
            selectedPlan,
            billingPeriod,
            roleBilling,
            showFreeTrialEndedModal,
            cardBrand,
            lastNumber,
            validClaas,
            form, 
			years,
            countries,
            payInfoEdit
        } = this.state;
        const { profile, freeTrialEnded } = this.props;
        const todayDate = new Date();
        const minumumYear = todayDate.getFullYear();
        const minumumMonth = todayDate.getMonth();
        let pickerLang = {
			months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
			, from: 'From', to: 'To'
        }
        , mvalue = { year: minumumYear, month: minumumMonth + 1 }

        return (
            <div>
                <Modal
                    ariaHideApp={false}
                    className="billing-profile-modal"
                    isOpen={!!showFreeTrialEndedModal}
                >
                    <div className="modal-title">{`Attention`}</div>
                    <div className="modal-content1">Your free trial has expired, please choose a plan.</div>
                    <div style={{float:'right'}}>
                        <button onClick={() => this.setState({showFreeTrialEndedModal: false})} className="cancelBtn" >OK</button>
                    </div>
                </Modal>
                {
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

                        {this.state.loading && <LoaderWithOverlay />}

                        {allPlans.length > 0 ?
                            <div className="container billing-top">
                                {
                                    freeTrialEnded && <div className="free-trial-end-msg">
                                        <strong>You don't have an active subscription</strong>
                                        <span>To access your project again, please subscribe. Otherwise, your account will be permanently deleted soon.</span>
                                    </div>
                                }
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
                                                            <li><span className="fa-li"><i className="fa fa-check"></i></span>{plan["Schedule and Publish"] != true ? '' : 'manage and schedule posts'}</li>
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
                    {!payInfoEdit && this.props.profile.subscription.activeSubscription &&
                        <div className="payment-info">
                            <div className="row">
                                <div className="col-md-3 col-sm-4"><b>Payment Info:</b></div>
                                <div className="col-md-2 col-sm-2"><b>{cardBrand}</b></div>
                                <div className="col-md-3 col-sm-4"> *****{lastNumber}</div>
                                <div className="col-md-4 col-sm-3">
                                    <button className="payment-info-edit" onClick={() => this.onPayInfoEdit()}>Edit</button>    
                                </div>
                            </div>
                        </div>
                    }
                    
                    {!!payInfoEdit &&

                        <div className="payment-detail">
                        <div className="section-header__second-row">
                            <h3>Payment details</h3>
                        </div>
                        <div className="card-inputs form-field row">
                            <div className="col-12 col-md-6">
                            <input className={'form-control whiteBg ' + validClaas}
                                onChange={(e) => this.checkIfValidCC(e.target.value)}
                                type="tel"
                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                size="19"
                                maxLength="19"
                                value={form.cardnumber} placeholder="Card number" />
                            </div>
                            <div className="col-12 col-md-3">
                            <Picker
                                ref="pickAMonth"
                                years={years}
                                value={mvalue}
                                lang={pickerLang.months}
                                onChange={this.handleAMonthChange}
                                onDismiss={this.handleAMonthDissmis}
                            >
                                <input className="form-control whiteBg"
                                type="tel"
                                onChange={(e) => this.onDateChange(e)}
                                value={form.exp_date}
                                onClick={this.handleClickMonthBox}
                                onFocus={this.handleClickMonthBox}
                                onBlur={this.handleClickMonthBoxHidde}
                                name="exp_date"
                                autoComplete={"off"}
                                autoComplete="new-password"
                                maxLength="9"
                                placeholder="Expiry date" />
                            </Picker>
                            </div>
                            <div className="col-12 col-md-3">
                            <input className="form-control whiteBg"
                                onChange={(e) => this.ValidateCvv(e)}
                                value={form.cvc}
                                name="cvc"
                                placeholder="CVV" />
                                <img className="cvv-image" src="/images/cvv-image.svg"/>
                            </div>
                        </div>
                        <div className="section-header__second-row">
                            <h3>Billing information</h3>
                        </div>
                    
                        <div className="row">
                            <div className="form-field col-12 col-md-6 mb1">
                                <input className={'form-control whiteBg '}
                                onChange={(e) => this.onFieldChange(e)}
                                value={form.name}
                                name="name"
                                placeholder="Name" />
                            </div>
                            <div className="form-field col-12 col-md-6 mb1">
                            <input className={'form-control whiteBg '}
                                onChange={(e) => this.onFieldChange(e)}
                                value={form.last_name}
                                name="last_name"
                                placeholder="Last Name" />
                            </div>
                            <div className="form-field col-12 col-md-6 mb1">
                            <input className={'form-control whiteBg '}
                                onChange={(e) => this.onFieldChange(e)}
                                value={form.address_line1}
                                name="address_line1"
                                placeholder="Address" />
                            </div>
                            <div className="form-field col-12 col-md-6 mb1">
                            <input className={'form-control whiteBg '}
                                onChange={(e) => this.onFieldChange(e)}
                                value={form.address_city}
                                name="address_city"
                                placeholder="City" />
                            </div>
                            <div className="form-field col-12 col-md-6 mb1 form-field form-country">
                            <Select
                                size="default"
                                onChange={(value) => this.setLocation(value)}
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Select a country"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {!!countries &&
                                countries.map((item) => (
                                <Option value={item}>{item}</Option>
                                ))
                                }
                            </Select>
                            </div>
                            <div className="form-field col-12 col-md-6 mb1">
                            <input className={'form-control whiteBg '}
                                onChange={(e) => this.onFieldChange(e)}
                                value={form.postal}
                                name="postal"
                                placeholder="Zip Code" />
                            </div>
                        </div>
                        <div className="confirm-button">
                        {
                            form.cardnumber != "" ?
                                <button className="btn-blue" onClick={() => this.onConfirmChange()}>Confirm changes</button>
                                :
                                <button className="btn-blue disabled-btn">Confirm changes</button>
                        }
                        </div>
                    </div>
                    }
                        <div>
                            <div className="billing-bottom-container">
                                <div className="bottom-title">Enterprise</div>
                                <div className="billing-profile-content">Contact us to get a custom plan that fits your needs
                                    <a
                                        className="billing-profile-button"
                                        href="mailto:info@uniclixapp.com"
                                        target="_blank"
                                    >
                                        Contact us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        profile: state.profile,
        freeTrialEnded: state.profile.remain_date <= 0 &&
            state.profile.subscription.activeSubscription === false
    };
};
const mapDispatchToProps = (dispatch) => ({
    startSetProfile: () => dispatch(startSetProfile()),
    startAddTwitterChannel: (accessToken, accessTokenSecret) => dispatch(startAddTwitterChannel(accessToken, accessTokenSecret)),
    startSetChannels: () => dispatch(startSetChannels()),
  
});
export default connect(mapStateToProps, mapDispatchToProps)(BillingProfile);