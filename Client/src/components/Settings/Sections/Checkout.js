import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { createSubscription } from '../../../requests/billing';
import { stripePublishableKey } from '../../../config/api';

export default class Checkout extends React.Component {
  onToken = (token) => {
    token.plan = this.props.plan
    token.trialDays = this.props.trialDays
    token.subType = this.props.subType
    this.props.setLoading(true);
    createSubscription(token).then(response=>{
      this.props.setLoading(false);
      this.props.setProfile();
    }).catch(e => {
      this.props.setLoading(false);
    })
  }

  render() {
    const {amount} = this.props;
    return (
      <StripeCheckout
        stripeKey={stripePublishableKey}
        token={this.onToken}
        amount={amount}
        currency={'USD'}
      >
      {this.props.children}
      </StripeCheckout>
    )
  }
}