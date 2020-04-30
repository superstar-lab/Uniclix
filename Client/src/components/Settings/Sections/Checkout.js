import React from 'react';
import { connect } from 'react-redux';
import { isValid } from 'cc-validate';
import Picker from 'react-month-picker'
import SweetAlert from "sweetalert2-react";
import { startSetProfile } from "../../../actions/profile";
import { startAddTwitterChannel, startSetChannels } from "../../../actions/channels";
import channelSelector from "../../../selectors/channels";
import Loader, { LoaderWithOverlay } from '../../Loader';
import CongratsPayment from "./CongratsPayment";
import { createSubscription, deleteSubscription, addSubscription } from '../../../requests/billing';
import { stripePublishableKey } from '../../../config/api';
import Countries from "../../../fixtures/country";
import { Select } from 'antd';
import ReactTooltip from 'react-tooltip';
import { Typography } from '@material-ui/core';
import Modal from 'react-modal';
import { Modal as OurModal } from '../../Modal';
import { PRICING_COOKIE_KEY } from '../../../utils/constants';
import { getCookie, eraseCookie } from '../../../utils/helpers';

const Option = Select.Option;

class Checkout extends React.Component {
  constructor(props) {
    super(props);
  }

  defaultAction = {
    id: "",
    type: ""
  };

  state = {
    action: this.defaultAction,
    countries: [],
    error: "",
    forbidden: false,
    validClaas: "",
    openCountry: false,
    locations: [],
    location: "",
    years: [],
    loading: false,
    validClaasCvv: "",
    shouldBlockNavigation: true,
    newAccounts: 0,
    actualUsers: 0,
    planTitle: "Basic Plan",    
    couponCode: '',
    setStart: false,
    endCardSetting: false,
    editCardSetting: false,
    editCardInfo: false,
    deleteCard: false,
    customerId: '',
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
    }
  }

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

  componentWillMount() {
    this.setState({countries: Countries});
    this.setState({setStart: true});
    this.setState({editCardInfo: false});
  }

  componentDidMount() {
    this.activeYears();
    this.loadStripe();
    this.accountsBilling();

    this.setState({planTitle: this.props.planName.charAt(0).toUpperCase() + this.props.planName.slice(1) + " Plan"});

  }
  setLocation = (val) => {
    this.setState({ 
        location: val
    })
  }

  accountsBilling = () => {
    this.setState({ loading: true })
    this.setState({
      // newAccounts: (this.props.channels).filter(channel => channel.details.payload == 0).length,
      // actualUsers: (this.props.channels).filter(channel => channel.details.payload == 1).length
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

  beforeunload = (e) => {
    if (this.props.dataUnsaved) {
      e.preventDefault();
      e.returnValue = true;
    }
  }

  onDateChange = (e) => {

  }

  activateDm = (e) => {

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
      })
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

  activeYears = () => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    let activeYears = []
    for (let y = 1; y < 11; y++) {
      activeYears.push(year + y)
    }
    this.setState({
      years: activeYears,
      loading: true
    })
  }

  handleClickMonthBox = (e) => {
    this.refs.pickAMonth.show()
  }

  handleClickMonthBoxHidde = (e) => {
    this.refs.pickAMonth.hidden()
  }

  setCouponCode = (e) => {
    let val = e.target.value;
    this.setState({couponCode: val});
  }

  ConfirmOrder = (e) => {

    this.setState({
      loading: false
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

      if (status === 200) {
        this.onToken(response)
        const pricingCookie = getCookie(PRICING_COOKIE_KEY);

        // If the purchase is successful, we delete the cookie
        if (pricingCookie) {
          eraseCookie(PRICING_COOKIE_KEY);
        }
      } else if (status === 402) {
        this.setState({
          stripeError: 'The card number is incorrect. Please change it and try again.',
          loading: true
        });
      }
    });
  }

  onToken = (token) => {    
    token.plan = this.props.billingPeriod === "annually" ? this.props.planName + "_annual" : this.props.planName;
    token.trialDays = 0;
    token.created = new Date().getTime();
    token.subType = "main"
    token.couponCode = this.props.billingPeriod === "annually" ? this.state.couponCode : '';
    createSubscription(token).then(response => {
      this.props.startSetChannels().then(res => {
        this.props.startSetProfile().then(res => {
          this.setState({
            loading: true,
            orderFinished: true
          });
        });
      })
    }).catch(e => {
      this.setState({
        loading: true,
        message: ""
      });
    })
  }

  saveCardInfo = (e) => {
    this.setState({
      endCardSetting: true,
      editCardSetting: false
    });

    this.setState({
      loading: false
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
      response.plan = this.props.billingPeriod === "annually" ? this.props.planName + "_annual" : this.props.planName;
      response.trialDays = 0;
      response.created = new Date().getTime();
      response.subType = "main"
      response.couponCode = this.props.billingPeriod === "annually" ? this.state.couponCode : '';
      if (status === 200) {
        addSubscription(response).then(response => {
          this.props.startSetChannels().then(res => {
            this.props.startSetProfile().then(res => {
              this.setState({
                loading: true,
                customerId: response.customer_id,
              });
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

  setDeleteCard = (remove = true) => {
    this.setState(() => ({
        deleteCard: remove
    }));
  };

  deleteCard = () => {
    this.setLoading(true);
    deleteSubscription(this.state.customerId).then(response => {
      this.props.startSetProfile();
      this.setLoading(true);
      this.setState({
        setStart: true, 
        endCardSetting: false,
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
        }});
    });
  }

  setLoading = (loading = false) => {
    this.setState(() => ({
        loading
    }));
  };

  render() {
    const { validClaas, form, years, loading, 
      orderFinished, countries, newAccounts, actualUsers, openCountry, location, planTitle, setStart, endCardSetting, editCardSetting, editCardInfo, deleteCard, stripeError } = this.state
    const { plan, billingPeriod, onChangePlan, onChangePeriod } = this.props;
    const todayDate = new Date();
    const minumumYear = todayDate.getFullYear();
    const minumumMonth = todayDate.getMonth();
    let pickerLang = {
      months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      , from: 'From', to: 'To'
    }
      , mvalue = { year: minumumYear, month: minumumMonth + 1 }
    let card_type;
    switch(form.cardnumber.charAt(0)) {
      case "3":
        card_type = "American Express"
        break;
      case "4":
        card_type = "Visa"
        break;
      case "5":
        card_type = "MasterCard"
        break;
      case "6":
        card_type = "Discover Card"
        break;
    }

    return (
      <div className="main-container">
        {!loading ? <LoaderWithOverlay /> :
          <div>
            {orderFinished ?
              <CongratsPayment /> :
              <div>
                <OurModal
                  title="Error"
                  message={stripeError}
                  isOpen={!!stripeError}
                  onOk={() => this.setState({ stripeError: '' })}
                  okText="Ok"
                />
                <SweetAlert
                  show={!!this.state.error}
                  title={`Error`}
                  text={this.state.error}
                  type="error"
                  confirmButtonText="Ok"
                  cancelButtonText="No"
                  onConfirm={() => {
                    this.setError("");
                  }}
                />
                {!!deleteCard && 
                  <Modal
                  ariaHideApp={false}
                  className="billing-profile-modal"
                  isOpen={!!deleteCard}
                  >
                    <div className="modal-title">{`Are you sure you want to delete this payment method?`}</div>
                    <div className="modal-contents">{`If you delete your payment method, your subscription will not renew automatically and you could loose access to your accounts.`}</div>
                    <div style={{float:'right'}}>
                        <button onClick={() => this.setDeleteCard(false)} className="cancelBtn" >Cancel</button>
                        <button onClick={() => {this.deleteCard();this.setDeleteCard(false);}} className="cancelBtn" >Yes, delete it</button>
                    </div>
                  </Modal>
                }

                <div className="row">
                  <div className="col-md-6">
                    <div className="section-header no-border">
                      <div className="section-header__first-row">
                        <h2>Checkout</h2>
                      </div>
                      <p>Review your order summary and enter your payment information to complete the purchase</p>
                    </div>
                  </div>
                </div>


                <div className="row ">
                  <div className="col-md-7">

                    <div className="section-header__second-row">
                      <h3>Payment details</h3>
                    </div>
                    {
                      setStart && !endCardSetting?
                        <div className="card-selector row" onClick={() =>this.setState({setStart: false})}>
                            <div className="card-image col-12 col-md-2">
                              <img src="/images/card-image.svg"/>
                            </div>
                            <div className="common-font col-12 col-md-9">
                              Add a new payment method
                            </div>
                            <div className="icon-spacing col-12 col-md-1">
                              <i className="fa fa-chevron-right" aria-hidden="true" style={{color: '#2D86DA'}}></i>
                            </div>
                        </div>
                      :
                        (
                          endCardSetting ?
                            (
                              editCardSetting?
                                (
                                  editCardInfo?
                                  <div>
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
                                    <div>
                                      {
                                        form.cardnumber == "" ?
                                        <button className="save-card-button disabled-btn">Save card</button>
                                      :
                                        <button className="save-card-button" onClick={(e) => this.saveCardInfo(e)}>Save card</button>
                                      }
                                    </div>
                                  </div>
                                :
                                  <div className="card-save-result row">
                                    <div className="card-image col-12 col-md-2">
                                      <img src="/images/card-image.svg"/>
                                    </div>
                                    <div className="common-font col-12 col-md-8">
                                      {card_type} ended in {this.state.form.exp_year}
                                    </div>
                                    <div className="col-12 col-md-1" >
                                      <div className="edit-icon-spacing" data-for="edit" data-tip data-iscapture='true' data-event-off='click' onClick={() => this.setState({editCardInfo: true, endCardSetting: false})}>
                                        <img src="/images/pencil.svg"/>
                                      </div>
                                      <ReactTooltip className="stream-menu-tooltip" place="bottom" type="info" effect="solid" globalEventOff='click' id="edit">
                                        <Typography className="stream-menu-tooltip-label">Edit</Typography>
                                      </ReactTooltip>
                                    </div>
                                    <div className="col-12 col-md-1">
                                      <div className="edit-icon-spacing" data-for="delete" data-tip data-iscapture='true' data-event-off='click' onClick={() => this.setDeleteCard()}>
                                        <img src="/images/trash.svg"/>
                                      </div>
                                      <ReactTooltip className="stream-menu-tooltip" place="bottom" type="info" effect="solid" globalEventOff='click' id="delete">
                                        <Typography className="stream-menu-tooltip-label">Delete</Typography>
                                      </ReactTooltip>
                                    </div>
                                  </div>  
                                )
                            :
                              <div className="card-save-result row" onClick={() =>this.setState({editCardSetting: true, editCardInfo: false})}>
                                <div className="card-image col-12 col-md-2">
                                  <img src="/images/card-image.svg"/>
                                </div>
                                <div className="common-font col-12 col-md-9">
                                  {card_type} ended in {this.state.form.exp_year}
                                </div>
                                <div className="icon-spacing col-12 col-md-1">
                                  <i className="fa fa-check" aria-hidden="true" style={{color: '#2D86DA'}}></i>
                                </div>
                              </div>
                            )
                          :
                            <div>
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
                              <div>
                                {
                                  form.cardnumber == "" ?
                                  <button className="save-card-button disabled-btn">Save card</button>
                                :
                                  <button className="save-card-button" onClick={(e) => this.saveCardInfo(e)}>Save card</button>
                                }
                              </div>
                            </div>
                        )
                    }
                    <div className="section-header__second-row">
                      <h3>Billing information</h3>
                    </div>
                    <div>
                      <p>Send receipt to my email
                          <label className="switch round">
                          <input type="checkbox" defaultChecked='checked' onChange={(e) => this.activateDm(e)} />
                          <span className="slider round"></span>
                          <p className={"off"}>Off</p>
                          <p className={"on"}>On</p>
                        </label>
                      </p>
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
                  </div>

                  <div className="col-md-5">
                    <div className=" plan-info-container">
                      <h3>Order summary</h3>

                      <div className="plan-content table">
                          <div className="row-price">
                            <div className="col-price">
                              <p className="plan-content-description">{planTitle}</p>
                              <p className="price">${billingPeriod === "annually" ? plan['Annual Billing'] : plan["Monthly"]}</p>
                              <button className="btn-text-pink" onClick={() => onChangePlan() }>Change</button>
                            </div>
                          </div>
                          <br />
                      </div>
                      <div className="order-total table">
                        <div className="row-price">
                          <div className="col-price">
                            <p className="plan-content-description">TOTAL</p>
                            <p className="plan-content-accounts">{billingPeriod === "annually" ? 'Annually' : 'Monthly'}</p>
                            <button className="btn-text-pink" onClick={() => onChangePeriod()}>Switch to {billingPeriod === "annually" ? 'monthly' : 'yearly'}</button>
                          </div>
                          <div className="currency-label">
                            <p>${Math.round((billingPeriod === "annually" ? plan['Annual Billing'] : plan["Monthly"]) * 100.0) / 100.0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="discount-cnt">
                        <input className="discount" placeholder="Add discount code" onChange={(e) => this.setCouponCode(e)}/>
                      </div>
                      {
                        form.cardnumber != "" ?
                        <button className="btn-blue" onClick={(e) => this.ConfirmOrder(e)}>Confirm order</button>
                        :
                        <button className="btn-blue disabled-btn">Confirm order</button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div >


    );
  };
}

const mapStateToProps = (state) => {

  const twitterChannelsFilter = { selected: undefined, provider: "twitter" };
  const channels = channelSelector(state.channels.list, twitterChannelsFilter);
  const profile = state.profile
  return {
    channels,
    loading: state.channels.loading,
    profile
  };
};

const mapDispatchToProps = (dispatch) => ({
  startAddTwitterChannel: (accessToken, accessTokenSecret) => dispatch(startAddTwitterChannel(accessToken, accessTokenSecret)),
  startSetChannels: () => dispatch(startSetChannels()),
  startSetProfile: () => dispatch(startSetProfile()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Checkout);